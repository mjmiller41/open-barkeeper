import { useState } from "react";
import { RecipeCard } from "@/components/recipe-card";
import { Recipe, searchRecipesAdvanced } from "@/lib/recipes";

export function SearchPage() {
    const [name, setName] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [keywords, setKeywords] = useState("");
    const [results, setResults] = useState<Recipe[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = () => {
        const ingredientList = ingredients
            .split(",")
            .map((i) => i.trim())
            .filter((i) => i);
        const keywordList = keywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k);

        const found = searchRecipesAdvanced({
            name: name.trim() || undefined,
            ingredients: ingredientList,
            keywords: keywordList,
        });
        setResults(found);
        setHasSearched(true);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Advanced Search</h1>
                <p className="text-gray-500 dark:text-gray-400">Find your perfect cocktail by name, ingredients, or tags.</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                        <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Recipe Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Margarita"
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:ring-offset-gray-950 dark:focus:ring-blue-400"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Ingredients (comma separated)
                        </label>
                        <input
                            type="text"
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            placeholder="e.g. Tequila, Lime"
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:ring-offset-gray-950 dark:focus:ring-blue-400"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Keywords (comma separated)
                        </label>
                        <input
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="e.g. Summer, Fruity"
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:ring-offset-gray-950 dark:focus:ring-blue-400"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSearch}
                        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400"
                    >
                        Search Recipes
                    </button>
                </div>
            </div>

            {hasSearched && (
                <div className="space-y-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Found {results.length} recipes</div>
                    {results.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {results.map((recipe) => (
                                <RecipeCard key={recipe.slug} recipe={recipe} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 p-8 text-center dark:border-gray-800">
                            <h3 className="text-lg font-semibold">No matches found</h3>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your filters to find what you're looking for.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
