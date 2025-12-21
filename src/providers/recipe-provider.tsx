import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loadStaticRecipes, Recipe } from '../lib/recipes';
import {
	getUserRecipes as fetchUserRecipes,
	saveUserRecipes as persistUserRecipes,
	getFavoriteRecipes as fetchFavoriteRecipes,
	saveFavoriteRecipes as persistFavoriteRecipes,
} from '../lib/storage';
import Ajv from 'ajv';
import recipeSchema from '../lib/recipe_schema.json';

interface ImportResult {
	success: boolean;
	message: string;
	conflicts: Array<{ existing: Recipe, new: Recipe }>;
}

interface RecipeContextType {
	recipes: Recipe[];
	favorites: Set<string>;
	toggleFavorite: (slug: string) => void;
	addUserRecipe: (recipe: Recipe) => void;
	updateUserRecipe: (recipe: Recipe) => void;
	deleteUserRecipe: (slug: string) => void;
	deleteAllUserRecipes: () => void;
	isUserRecipe: (slug: string) => boolean;
	importRecipes: (jsonContent: string) => ImportResult;
	exportRecipes: () => Recipe[];
	exportFavorites: () => string[];
	importFavorites: (jsonContent: string) => { success: boolean; message: string };
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
	const [staticRecipes, setStaticRecipes] = useState<Recipe[]>([]);
	const [favorites, setFavorites] = useState<Set<string>>(new Set());

	// Load initial data
	useEffect(() => {
		async function load() {
			const loadedUser = fetchUserRecipes();
			setUserRecipes(loadedUser);

			// Load favorites
			const loadedFavorites = new Set(fetchFavoriteRecipes());
			setFavorites(loadedFavorites);

			// Initial render with just user recipes (fast)
			mergeAndSetRecipes([], loadedUser);

			// Async load static recipes
			try {
				const loadedStatic = await loadStaticRecipes();
				setStaticRecipes(loadedStatic);
				mergeAndSetRecipes(loadedStatic, loadedUser);
			} catch (err) {
				console.error("Failed to load static recipes", err);
			}
		}

		load();
	}, []);

	const mergeAndSetRecipes = (staticList: Recipe[], userList: Recipe[]) => {
		const userSlugs = new Set(userList.map((r) => r.slug));
		const visibleStatic = staticList.filter((r) => !userSlugs.has(r.slug));
		setRecipes([...visibleStatic, ...userList]);
	};

	const syncUserRecipes = (newUserRecipes: Recipe[]) => {
		setUserRecipes(newUserRecipes);
		mergeAndSetRecipes(staticRecipes, newUserRecipes);
		persistUserRecipes(newUserRecipes);
	};

	const toggleFavorite = (slug: string) => {
		const newFavorites = new Set(favorites);
		if (newFavorites.has(slug)) {
			newFavorites.delete(slug);
		} else {
			newFavorites.add(slug);
		}
		setFavorites(newFavorites);
		persistFavoriteRecipes(Array.from(newFavorites));
	};

	const addUserRecipe = (recipe: Recipe) => {
		const updated = [...userRecipes, recipe];
		syncUserRecipes(updated);
	};

	const updateUserRecipe = (recipe: Recipe) => {
		const index = userRecipes.findIndex((r) => r.slug === recipe.slug);
		if (index >= 0) {
			const updated = [...userRecipes];
			updated[index] = recipe;
			syncUserRecipes(updated);
		} else {
			// Overriding a static recipe or adding new
			addUserRecipe(recipe);
		}
	};

	const deleteUserRecipe = (slug: string) => {
		const updated = userRecipes.filter((r) => r.slug !== slug);
		syncUserRecipes(updated);
	};

	const deleteAllUserRecipes = () => {
		syncUserRecipes([]);
	};

	const isUserRecipe = (slug: string) => {
		return userRecipes.some((r) => r.slug === slug);
	};

	const exportRecipes = () => {
		return userRecipes;
	};

	const importRecipes = (jsonContent: string): ImportResult => {
		try {
			const parsed = JSON.parse(jsonContent);
			if (!Array.isArray(parsed)) {
				return { success: false, message: "Invalid format: Root must be an array.", conflicts: [] };
			}

			// Initialize Ajv for validation
			const ajv = new Ajv();
			// Compile schema
			const validate = ajv.compile(recipeSchema);

			const validRecipes: Recipe[] = [];
			const invalidRecipes: any[] = []; // Could track these for error reporting

			for (const recipe of parsed) {
				if (validate(recipe)) {
					if (recipe.slug && recipe.name && recipe.ingredients) {
						validRecipes.push(recipe as Recipe);
					} else {
						// Schema validated but missing logical fields?
						// Schema requires them, so this shouldn't happen if schema is correct.
						validRecipes.push(recipe as Recipe);
					}
				} else {
					console.warn("Skipping invalid recipe:", recipe, validate.errors);
					// We could add an error message about specific failures
					invalidRecipes.push(recipe);
				}
			}

			if (validRecipes.length === 0 && parsed.length > 0) {
				return { success: false, message: "No valid recipes found in file.", conflicts: [] };
			}

			const conflicts: Array<{ existing: Recipe, new: Recipe }> = [];
			const newRecipes: Recipe[] = [];

			const currentMap = new Map(userRecipes.map(r => [r.slug, r]));

			for (const inc of validRecipes) {
				if (currentMap.has(inc.slug)) {
					const existing = currentMap.get(inc.slug)!;
					if (JSON.stringify(existing) !== JSON.stringify(inc)) {
						conflicts.push({ existing, new: inc });
					}
				} else {
					newRecipes.push(inc);
				}
			}

			if (conflicts.length > 0) {
				return { success: false, message: "Conflicts found.", conflicts };
			}

			const final = [...userRecipes, ...newRecipes];
			syncUserRecipes(final);

			const message = invalidRecipes.length > 0
				? `Imported ${newRecipes.length} recipes. (${invalidRecipes.length} invalid skipped)`
				: `Imported ${newRecipes.length} recipes.`;

			return { success: true, message, conflicts: [] };

		} catch (e) {
			console.error(e);
			return { success: false, message: "Failed to parse JSON.", conflicts: [] };
		}
	};

	const exportFavorites = () => {
		return Array.from(favorites);
	};

	const importFavorites = (jsonContent: string): { success: boolean; message: string } => {
		try {
			const parsed = JSON.parse(jsonContent);
			if (!Array.isArray(parsed) || !parsed.every((item) => typeof item === "string")) {
				return { success: false, message: "Invalid format: Must be an array of recipe slugs." };
			}

			const newFavorites = new Set(favorites);
			let addedCount = 0;
			for (const slug of parsed) {
				if (!newFavorites.has(slug)) {
					newFavorites.add(slug);
					addedCount++;
				}
			}

			setFavorites(newFavorites);
			persistFavoriteRecipes(Array.from(newFavorites));

			return { success: true, message: `Imported ${addedCount} new favorites.` };
		} catch (e) {
			console.error(e);
			return { success: false, message: "Failed to parse JSON." };
		}
	};

	return (
		<RecipeContext.Provider value={{
			recipes,
			favorites,
			toggleFavorite,
			addUserRecipe,
			updateUserRecipe,
			deleteUserRecipe,
			deleteAllUserRecipes,
			isUserRecipe,
			importRecipes,
			exportRecipes,
			exportFavorites,
			importFavorites,
		}}>
			{children}
		</RecipeContext.Provider>
	);
};

export const useRecipes = () => {
	const context = useContext(RecipeContext);
	if (context === undefined) {
		throw new Error('useRecipes must be used within a RecipeProvider');
	}
	return context;
};
