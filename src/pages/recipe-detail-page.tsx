import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Recipe, deleteUserRecipe, getRecipeBySlug, getRecipeImageSrc, isUserRecipe, updateUserRecipe } from "@/lib/recipes";
import { OfflineAwareImage } from "@/components/offline-aware-image";

export function RecipeDetailPage() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const [recipe, setRecipe] = useState<Recipe | undefined>();
	const [isEditing, setIsEditing] = useState(false);
	const [canDelete, setCanDelete] = useState(false);

	// Form states
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [image, setImage] = useState("");
	const [ingredients, setIngredients] = useState("");
	const [directions, setDirections] = useState("");
	const [keywords, setKeywords] = useState("");

	// Force re-render on updates
	const [updateTrigger, setUpdateTrigger] = useState(0);

	useEffect(() => {
		const found = getRecipeBySlug(slug || "");
		setRecipe(found);
		if (found) {
			setName(found.name);
			setDescription(found.description);
			setImage(found.image);
			setIngredients(found.ingredients.map(i => `${i.quantity} ${i.measure} ${i.ingredient}`.trim()).join("\n"));
			setDirections(found.directions.join("\n"));
			setKeywords(found.keywords.join(", "));

			setCanDelete(isUserRecipe(found.slug));
		}
	}, [slug, updateTrigger]);

	useEffect(() => {
		const handleUpdate = () => setUpdateTrigger(prev => prev + 1);
		window.addEventListener('recipes-updated', handleUpdate);
		return () => window.removeEventListener('recipes-updated', handleUpdate);
	}, []);

	const handleSave = (e: React.FormEvent) => {
		e.preventDefault();
		if (!recipe) return;

		const ingredientList = ingredients.split("\n")
			.map(line => {
				const parts = line.trim().split(" ");
				const quantity = parts[0] || "";
				const measure = parts[1] || "";
				const ingredient = parts.slice(2).join(" ") || line.trim();
				return { quantity, measure, ingredient };
			})
			.filter(i => i.ingredient);

		const directionList = directions.split("\n").filter(d => d.trim());
		const keywordList = Array.from(new Set(
			keywords.split(",").map(k => k.trim()).filter(k => k)
		));

		const updatedRecipe: Recipe = {
			...recipe,
			name,
			description,
			image,
			ingredients: ingredientList,
			directions: directionList,
			keywords: keywordList,
		};

		updateUserRecipe(updatedRecipe);
		setIsEditing(false);
	};

	// Generate Schema.org JSON-LD
	const structuredData = recipe ? {
		"@context": "https://schema.org/",
		"@type": "Recipe",
		"name": recipe.name,
		"image": [getRecipeImageSrc(recipe.image)],
		"description": recipe.description,
		"keywords": recipe.keywords.join(", "),
		"recipeIngredient": recipe.ingredients.map(i => `${i.quantity} ${i.measure} ${i.ingredient}`.trim()),
		"recipeInstructions": recipe.directions.map((step) => ({
			"@type": "HowToStep",
			"text": step
		})),
	} : null;

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

	if (isEditing) {
		return (
			<div className="mx-auto max-w-4xl">
				<button
					onClick={() => setIsEditing(false)}
					className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
				>
					Cancel Edit
				</button>
				<form onSubmit={handleSave} className="space-y-6">
					<div className="space-y-2">
						<label className="text-sm font-medium">Name</label>
						<input value={name} onChange={e => setName(e.target.value)} className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-800" />
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium">Description</label>
						<textarea value={description} onChange={e => setDescription(e.target.value)} className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-800" />
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium">Image URL</label>
						<input value={image} onChange={e => setImage(e.target.value)} className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-800" />
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium">Ingredients (one per line)</label>
						<textarea value={ingredients} onChange={e => setIngredients(e.target.value)} className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-800" />
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium">Directions (one per line)</label>
						<textarea value={directions} onChange={e => setDirections(e.target.value)} className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-800" />
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium">Keywords (comma separated)</label>
						<input value={keywords} onChange={e => setKeywords(e.target.value)} className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-800" />
					</div>
					<div className="flex justify-end gap-4">
						<button type="button" onClick={() => setIsEditing(false)} className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">Cancel</button>
						<button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Save Changes</button>
					</div>
				</form>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-4xl">
			{structuredData && (
				<script type="application/ld+json">
					{JSON.stringify(structuredData)}
				</script>
			)}
			<div className="mb-6 flex items-center justify-between">
				<button
					onClick={() => navigate(-1)}
					className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
				>
					← Back
				</button>
			</div>

			<div className="grid gap-8 md:grid-cols-2">
				<div className="space-y-6">
					<div>
						<div className="flex items-center gap-4">
							<h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50">{recipe.name}</h1>
							<div className="flex gap-2">
								<button
									onClick={() => setIsEditing(true)}
									className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
									title="Edit Recipe"
								>
									<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
									</svg>
								</button>
								<button
									disabled={!canDelete}
									onClick={() => {
										if (canDelete && confirm("Are you sure you want to delete this recipe?")) {
											deleteUserRecipe(recipe.slug);
											navigate("/recipes");
										}
									}}
									className={`rounded-full p-2 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 ${!canDelete ? "cursor-not-allowed opacity-50" : ""}`}
									title={canDelete ? "Delete Recipe" : "Cannot delete built-in recipes"}
								>
									<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
									</svg>
								</button>
							</div>
						</div>
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
						<OfflineAwareImage
							src={getRecipeImageSrc(recipe.image)}
							alt={recipe.name}
							className="h-full w-full object-cover"
							onError={(e: any) => {
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
