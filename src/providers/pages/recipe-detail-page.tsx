import { Link, useNavigate, useParams } from "react-router";
import { getRecipeBySlug, getImageSrc } from "@/lib/recipes";

export function RecipeDetailPage() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const recipe = getRecipeBySlug(slug || "");

	if (!recipe) {
		return (
			<div className="flex min-h-[400px] flex-col items-center justify-center">
				<h1 className="mb-4 text-2xl font-bold">Recipe Not Found</h1>
				<Link to="/recipes" className="text-blue-600 hover:underline dark:text-blue-400">
					Return to Recipes
				</Link>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-4xl">
			<button
				onClick={() => navigate(-1)}
				className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
			>
				← Back
			</button>

			<div className="grid gap-8 md:grid-cols-2">
				<div className="space-y-6">
					<div>
						<h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50">{recipe.name}</h1>
						<p className="mt-2 text-lg text-gray-500 dark:text-gray-400">{recipe.description}</p>
					</div>

					<div className="flex flex-wrap gap-2">
						{recipe.keywords.map((keyword) => (
							<span
								key={keyword}
								className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"
							>
								{keyword}
							</span>
						))}
					</div>

					<div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
						<h2 className="mb-4 text-xl font-semibold">Ingredients</h2>
						<ul className="space-y-3">
							{recipe.ingredients.map((ing, index) => (
								<li key={index} className="flex items-start">
									<span className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
										{index + 1}
									</span>
									<span className="text-gray-700 dark:text-gray-300">
										<span className="font-medium text-gray-900 dark:text-gray-100">
											{ing.quantity} {ing.measure}
										</span>{" "}
										{ing.ingredient}
									</span>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="space-y-6">
					<div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900">
						<img
							src={getImageSrc(recipe.image)}
							alt={recipe.name}
							className="h-full w-full object-cover"
							onError={(e) => {
								(e.target as HTMLImageElement).src = "/vite.svg";
							}}
						/>
					</div>

					<div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
						<h2 className="mb-4 text-xl font-semibold">Directions</h2>
						<ol className="space-y-4">
							{recipe.directions.map((step, index) => (
								<li key={index} className="flex gap-4">
									<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-sm font-bold text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
										{index + 1}
									</span>
									<p className="pt-1 text-gray-700 dark:text-gray-300">{step}</p>
								</li>
							))}
						</ol>
					</div>

					{recipe.source && (
						<div className="text-sm text-gray-500 dark:text-gray-400">
							Source:{" "}
							<a href={recipe.source} target="_blank" rel="noopener noreferrer" className="hover:underline">
								{recipe.source}
							</a>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
