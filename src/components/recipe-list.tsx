import { useMemo, useState } from "react";
import { Recipe, searchRecipes } from "@/lib/recipes";
import { RecipeCard } from "./recipe-card";

interface RecipeListProps {
    recipes: Recipe[];
}

export function RecipeList({ recipes: initialRecipes }: RecipeListProps) {
    const [query, setQuery] = useState("");

    const filteredRecipes = useMemo(() => {
        if (!query) return initialRecipes;
        return searchRecipes(query);
    }, [query, initialRecipes]);

    return (
        <div className="space-y-6">
            <div className="sticky top-16 z-40 -mx-4 bg-gray-50/95 px-4 py-4 backdrop-blur md:mx-0 md:px-0 dark:bg-gray-900/95">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search recipes, ingredients, or tags..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 pl-11 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                    />
                    <div className="absolute top-3.5 left-3 text-gray-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">Showing {filteredRecipes.length} recipes</div>

            {filteredRecipes.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredRecipes.map((recipe) => (
                        <RecipeCard key={recipe.slug} recipe={recipe} />
                    ))}
                </div>
            ) : (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 p-8 text-center dark:border-gray-800">
                    <h3 className="text-lg font-semibold">No recipes found</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your search terms.</p>
                </div>
            )}
        </div>
    );
}
