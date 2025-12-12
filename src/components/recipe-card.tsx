import { Link } from "react-router";
import { Recipe } from "@/lib/recipes";

interface RecipeCardProps {
    recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
    return (
        <Link
            to={`/recipes/${recipe.slug}`}
            className="group block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
        >
            <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                <img
                    src={`/img/recipes/${recipe.image}`}
                    alt={recipe.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/vite.svg"; // Fallback image
                    }}
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-50 dark:group-hover:text-blue-400">
                    {recipe.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{recipe.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {recipe.keywords.slice(0, 3).map((keyword) => (
                        <span
                            key={keyword}
                            className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        >
                            {keyword}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}
