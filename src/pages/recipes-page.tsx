import { RecipeList } from "@/components/recipe-list";
import { getAllRecipes } from "@/lib/recipes";

export function RecipesPage() {
    const recipes = getAllRecipes();

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Recipes</h1>
                    <p className="text-gray-500 dark:text-gray-400">Explore our collection of {recipes.length} cocktail recipes.</p>
                </div>
            </div>
            <RecipeList recipes={recipes} />
        </div>
    );
}
