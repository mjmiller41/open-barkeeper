import { Recipe } from "./recipes";

// Helper to get user recipes from storage
export function getUserRecipes(): Recipe[] {
    try {
        const stored = localStorage.getItem("user_recipes");
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to load user recipes", e);
        return [];
    }
}

// Helper to save user recipes
export function saveUserRecipes(recipes: Recipe[]) {
    localStorage.setItem("user_recipes", JSON.stringify(recipes));
}

// Helper to get favorite recipes
export function getFavoriteRecipes(): string[] {
    try {
        const stored = localStorage.getItem("favorite_recipes");
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to load favorite recipes", e);
        return [];
    }
}

// Helper to save favorite recipes
export function saveFavoriteRecipes(favorites: string[]) {
    localStorage.setItem("favorite_recipes", JSON.stringify(favorites));
}
