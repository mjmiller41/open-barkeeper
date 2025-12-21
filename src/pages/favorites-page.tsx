import { RecipeList } from "@/components/recipe-list";
import { useRecipes } from "@/providers/recipe-provider";
import { Heart } from "lucide-react";

export function FavoritesPage() {
	const { recipes, favorites } = useRecipes();
	const favoriteRecipes = recipes.filter((r) => favorites.has(r.slug));

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
						<Heart className="h-8 w-8 text-red-500 fill-red-500" />
						Favorites
					</h1>
					<p className="text-gray-500 dark:text-gray-400">
						You have {favoriteRecipes.length} favorite recipes.
					</p>
				</div>
			</div>

			{favoriteRecipes.length > 0 ? (
				<RecipeList recipes={favoriteRecipes} />
			) : (
				<div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900">
					<div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
						<Heart className="h-10 w-10 text-gray-400 dark:text-gray-500" />
					</div>
					<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">No favorites yet</h3>
					<p className="mt-2 max-w-sm text-gray-500 dark:text-gray-400">
						Browse the recipes and click the heart icon to save your favorite drinks here.
					</p>
				</div>
			)}
		</div>
	);
}
