import Fuse from "fuse.js";
import { Recipe as BaseRecipe } from "./schema";
import { getUserRecipes, saveUserRecipes } from "./storage";

export type Recipe = BaseRecipe & { slug: string };

// Cache for Fuse instances to avoid re-creation
// We use a WeakMap so if the recipe array is garbage collected, the index is too.
// Note: This relies on the caller passing the SAME array reference if data hasn't changed.
const fuseCache = new WeakMap<Recipe[], Fuse<Recipe>>();

export function getRecipeImageSrc(imagePath: string): string {
    if (!imagePath) return "/logo.svg"; // Default fallback
    if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
        return imagePath;
    }
    return `/img/recipes/${imagePath}`;
}

// Load all recipe JSON files lazy
const recipeFiles = import.meta.glob<BaseRecipe>("/src/recipes/*.json");

// Cache the promise so we don't fetch multiple times
let loadedRecipesPromise: Promise<Recipe[]> | null = null;

export async function loadStaticRecipes(): Promise<Recipe[]> {
    if (loadedRecipesPromise) return loadedRecipesPromise;

    loadedRecipesPromise = (async () => {
        const results = await Promise.all(
            Object.entries(recipeFiles).map(async ([path, loader]) => {
                const module = await loader();
                const slug = path.split("/").pop()?.replace(".json", "") || "";
                const data = (module as any).default || module;
                return {
                    ...data,
                    slug,
                } as Recipe;
            }),
        );
        return results;
    })();

    return loadedRecipesPromise;
}

// Deprecated: No longer available synchronously
export function getStaticRecipes(): Recipe[] {
    return [];
}

export function getRecipeBySlug(recipes: Recipe[], slug: string): Recipe | undefined {
    return recipes.find((recipe) => recipe.slug === slug);
}

export function searchRecipes(recipes: Recipe[], query: string): Recipe[] {
    const lowerQuery = query.toLowerCase();
    return recipes.filter((recipe) => {
        return (
            recipe.name.toLowerCase().includes(lowerQuery) ||
            recipe.keywords.some((keyword) => keyword.toLowerCase().includes(lowerQuery)) ||
            recipe.ingredients.some((ing) => ing.ingredient.toLowerCase().includes(lowerQuery))
        );
    });
}

export function searchRecipesAdvanced(recipes: Recipe[], criteria: { name?: string; ingredients?: string[]; keywords?: string[] }): Recipe[] {
    return recipes.filter((recipe) => {
        // Name check
        if (criteria.name) {
            if (!recipe.name.toLowerCase().includes(criteria.name.toLowerCase())) {
                return false;
            }
        }

        // Ingredients check (must match ALL provided ingredients)
        if (criteria.ingredients && criteria.ingredients.length > 0) {
            const recipeIngredients = recipe.ingredients.map((i) => i.ingredient.toLowerCase());
            const hasAllIngredients = criteria.ingredients.every((searchIng) =>
                recipeIngredients.some((recipeIng) => recipeIng.includes(searchIng.toLowerCase())),
            );
            if (!hasAllIngredients) return false;
        }

        // Keywords check (must match ALL provided keywords)
        if (criteria.keywords && criteria.keywords.length > 0) {
            const recipeKeywords = recipe.keywords.map((k) => k.toLowerCase());
            const hasAllKeywords = criteria.keywords.every((searchKw) => recipeKeywords.some((recipeKw) => recipeKw.includes(searchKw.toLowerCase())));
            if (!hasAllKeywords) return false;
        }

        return true;
    });
}

export function searchRecipesFuzzy(
    recipes: Recipe[],
    query: string,
    filters: {
        ingredients?: string[];
        keywords?: string[];
    } = {},
): Recipe[] {
    let results = [...recipes];

    // 1. Fuzzy Search by Query
    if (query.trim()) {
        let fuse = fuseCache.get(results);
        if (!fuse) {
            fuse = new Fuse(results, {
                keys: [
                    { name: "name", weight: 3 }, // Higher weight for name matches
                    { name: "ingredients.ingredient", weight: 1 },
                    { name: "keywords", weight: 2 },
                ],
                threshold: 0.4, // Adjust for fuzziness (0.0 = exact, 1.0 = match anything)
                ignoreLocation: true,
            });
            fuseCache.set(results, fuse);
        }

        results = fuse.search(query).map((result) => result.item);
    }

    // 2. Exact/Normalized Filtering
    // We can use a simple normalization helper for the filters
    const normalize = (s: string) => s.toLowerCase().trim();

    if (filters.ingredients && filters.ingredients.length > 0) {
        results = results.filter((recipe) =>
            filters.ingredients!.every((filterIng) => recipe.ingredients.some((recipeIng) => normalize(recipeIng.ingredient).includes(normalize(filterIng)))),
        );
    }

    if (filters.keywords && filters.keywords.length > 0) {
        results = results.filter((recipe) =>
            filters.keywords!.every((filterTag) => recipe.keywords.some((recipeTag) => normalize(recipeTag).includes(normalize(filterTag)))),
        );
    }

    return results;
}

/*
export function getAllRecipes(): Recipe[] {
    const userRecipes = getUserRecipes();

    return [...getStaticRecipes(), ...userRecipes];
}
*/

export function addUserRecipe(recipe: Recipe) {
    const userRecipes = getUserRecipes();

    userRecipes.push(recipe);

    saveUserRecipes(userRecipes);
}
