export interface Ingredient {
	quantity: string;
	measure: string;
	ingredient: string;
}

export interface Recipe {
	name: string;
	description: string;
	github: string;
	ingredients: Ingredient[];
	directions: string[];
	image: string;
	source?: string;
	keywords: string[];
	slug: string; // Added for routing
}

export function getRecipeImageSrc(imagePath: string): string {
	if (!imagePath) return "/vite.svg"; // Default fallback
	if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
		return imagePath;
	}
	return `/img/recipes/${imagePath}`;
}

// Load all recipe JSON files
const recipeFiles = import.meta.glob<Recipe>('/src/recipes/*.json', { eager: true });

// Process recipes into a list
const staticRecipes: Recipe[] = Object.entries(recipeFiles).map(([path, module]) => {
	const slug = path.split('/').pop()?.replace('.json', '') || '';
	const data = (module as any).default || module;
	return {
		...data,
		slug,
	};
});

// Helper to get user recipes from storage
function getUserRecipes(): Recipe[] {
	try {
		const stored = localStorage.getItem('user_recipes');
		return stored ? JSON.parse(stored) : [];
	} catch (e) {
		console.error("Failed to load user recipes", e);
		return [];
	}
}

// Helper to save user recipes
function saveUserRecipes(recipes: Recipe[]) {
	localStorage.setItem('user_recipes', JSON.stringify(recipes));
	window.dispatchEvent(new Event('recipes-updated'));
}

function saveUserRecipe(recipe: Recipe) {
	const current = getUserRecipes();
	const updated = [...current, recipe];
	saveUserRecipes(updated);
}

export function updateUserRecipe(recipe: Recipe) {
	const current = getUserRecipes();
	const index = current.findIndex(r => r.slug === recipe.slug);

	if (index >= 0) {
		// Update existing user recipe
		const updated = [...current];
		updated[index] = recipe;
		saveUserRecipes(updated);
	} else {
		// Add as new (or override static)
		saveUserRecipe(recipe);
	}
}

export function deleteUserRecipe(slug: string) {
	const current = getUserRecipes();
	const updated = current.filter(r => r.slug !== slug);
	saveUserRecipes(updated);
}

export function isUserRecipe(slug: string): boolean {
	const current = getUserRecipes();
	return current.some(r => r.slug === slug);
}

export function getAllRecipes(): Recipe[] {
	const userRecipes = getUserRecipes();
	const userRecipeSlugs = new Set(userRecipes.map(r => r.slug));

	// Filter out static recipes that have been overridden by user recipes
	const visibleStaticRecipes = staticRecipes.filter(r => !userRecipeSlugs.has(r.slug));

	return [...visibleStaticRecipes, ...userRecipes];
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
	return getAllRecipes().find((recipe) => recipe.slug === slug);
}

export function searchRecipes(query: string): Recipe[] {
	const lowerQuery = query.toLowerCase();
	return getAllRecipes().filter((recipe) => {
		return (
			recipe.name.toLowerCase().includes(lowerQuery) ||
			recipe.keywords.some((keyword) => keyword.toLowerCase().includes(lowerQuery)) ||
			recipe.ingredients.some((ing) => ing.ingredient.toLowerCase().includes(lowerQuery))
		);
	});
}

export function searchRecipesAdvanced(criteria: {
	name?: string;
	ingredients?: string[];
	keywords?: string[];
}): Recipe[] {
	return getAllRecipes().filter((recipe) => {
		// Name check
		if (criteria.name) {
			if (!recipe.name.toLowerCase().includes(criteria.name.toLowerCase())) {
				return false;
			}
		}

		// Ingredients check (must match ALL provided ingredients)
		if (criteria.ingredients && criteria.ingredients.length > 0) {
			const recipeIngredients = recipe.ingredients.map(i => i.ingredient.toLowerCase());
			const hasAllIngredients = criteria.ingredients.every(searchIng =>
				recipeIngredients.some(recipeIng => recipeIng.includes(searchIng.toLowerCase()))
			);
			if (!hasAllIngredients) return false;
		}

		// Keywords check (must match ALL provided keywords)
		if (criteria.keywords && criteria.keywords.length > 0) {
			const recipeKeywords = recipe.keywords.map(k => k.toLowerCase());
			const hasAllKeywords = criteria.keywords.every(searchKw =>
				recipeKeywords.some(recipeKw => recipeKw.includes(searchKw.toLowerCase()))
			);
			if (!hasAllKeywords) return false;
		}

		return true;
	});
}


import Fuse from 'fuse.js';

export function addUserRecipe(recipe: Recipe) {
	saveUserRecipe(recipe);
}

export function searchRecipesFuzzy(
	query: string,
	filters: {
		ingredients?: string[];
		keywords?: string[];
	} = {}
): Recipe[] {
	let results = getAllRecipes();

	// 1. Fuzzy Search by Query
	if (query.trim()) {
		const fuse = new Fuse(results, {
			keys: [
				{ name: 'name', weight: 3 }, // Higher weight for name matches
				{ name: 'ingredients.ingredient', weight: 1 },
				{ name: 'keywords', weight: 2 },
			],
			threshold: 0.4, // Adjust for fuzziness (0.0 = exact, 1.0 = match anything)
			ignoreLocation: true,
		});

		results = fuse.search(query).map((result) => result.item);
	}

	// 2. Exact/Normalized Filtering
	// We can use a simple normalization helper for the filters
	const normalize = (s: string) => s.toLowerCase().trim();

	if (filters.ingredients && filters.ingredients.length > 0) {
		results = results.filter((recipe) =>
			filters.ingredients!.every((filterIng) =>
				recipe.ingredients.some((recipeIng) =>
					normalize(recipeIng.ingredient).includes(normalize(filterIng))
				)
			)
		);
	}

	if (filters.keywords && filters.keywords.length > 0) {
		results = results.filter((recipe) =>
			filters.keywords!.every((filterTag) =>
				recipe.keywords.some((recipeTag) =>
					normalize(recipeTag).includes(normalize(filterTag))
				)
			)
		);
	}

	return results;
}
