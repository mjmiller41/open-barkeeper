import { useMemo, useState } from "react";
import { Recipe, searchRecipesFuzzy } from "@/lib/recipes";
import { RecipeCard } from "./recipe-card";

interface RecipeListProps {
    recipes: Recipe[];
}

export function RecipeList({ recipes: initialRecipes }: RecipeListProps) {
    const [query, setQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [ingredientInput, setIngredientInput] = useState("");
    const [tagInput, setTagInput] = useState("");

    const filteredRecipes = useMemo(() => {
        return searchRecipesFuzzy(query, {
            ingredients: selectedIngredients,
            keywords: selectedTags,
        });
    }, [query, selectedIngredients, selectedTags, initialRecipes]);

    const addIngredient = () => {
        const val = ingredientInput.trim();
        if (val && !selectedIngredients.includes(val)) {
            setSelectedIngredients([...selectedIngredients, val]);
            setIngredientInput("");
        }
    };

    const addTag = () => {
        const val = tagInput.trim();
        if (val && !selectedTags.includes(val)) {
            setSelectedTags([...selectedTags, val]);
            setTagInput("");
        }
    };

    const removeIngredient = (ing: string) => {
        setSelectedIngredients(selectedIngredients.filter((i) => i !== ing));
    };

    const removeTag = (tag: string) => {
        setSelectedTags(selectedTags.filter((t) => t !== tag));
    };

    return (
        <div className="space-y-6">
            <div className="sticky top-16 z-40 -mx-4 bg-gray-50/95 px-4 py-4 backdrop-blur md:mx-0 md:px-0 dark:bg-gray-900/95">
                <div className="space-y-4">
                    <div className="relative flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search recipes..."
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
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                                showFilters || selectedIngredients.length > 0 || selectedTags.length > 0
                                    ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900"
                            }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                            Filters
                        </button>
                    </div>

                    {/* Filter Controls */}
                    {showFilters && (
                        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Must include ingredient
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={ingredientInput}
                                            onChange={(e) => setIngredientInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && addIngredient()}
                                            placeholder="e.g. Lime juice"
                                            className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50"
                                        />
                                        <button
                                            onClick={addIngredient}
                                            disabled={!ingredientInput.trim()}
                                            className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Filter by tag
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && addTag()}
                                            placeholder="e.g. Gin"
                                            className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50"
                                        />
                                        <button
                                            onClick={addTag}
                                            disabled={!tagInput.trim()}
                                            className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Active Filters */}
                    {(selectedIngredients.length > 0 || selectedTags.length > 0) && (
                        <div className="flex flex-wrap gap-2">
                            {selectedIngredients.map((ing) => (
                                <span
                                    key={`ing-${ing}`}
                                    className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                >
                                    ing: {ing}
                                    <button
                                        onClick={() => removeIngredient(ing)}
                                        className="ml-0.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                            {selectedTags.map((tag) => (
                                <span
                                    key={`tag-${tag}`}
                                    className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                >
                                    tag: {tag}
                                    <button
                                        onClick={() => removeTag(tag)}
                                        className="ml-0.5 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                            <button
                                onClick={() => {
                                    setSelectedIngredients([]);
                                    setSelectedTags([]);
                                }}
                                className="text-xs text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
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
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Try adjusting your search terms or filters.
                    </p>
                </div>
            )}
        </div>
    );
}
