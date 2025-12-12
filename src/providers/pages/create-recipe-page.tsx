import { useState } from "react";
import { useNavigate } from "react-router";
import { Recipe, addUserRecipe } from "@/lib/recipes";

export function CreateRecipePage() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [ingredients, setIngredients] = useState("");
	const [directions, setDirections] = useState("");

	const [keywords, setKeywords] = useState("");
	const [image, setImage] = useState("");
	const [imageType, setImageType] = useState<"url" | "upload">("url");

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const ingredientList = ingredients
			.split("\n")
			.map((line) => {
				// Simple parsing: "2 oz Tequila" -> quantity: "2 oz", ingredient: "Tequila"
				// This is naive but sufficient for a basic UI
				const parts = line.trim().split(" ");
				const quantity = parts[0] || "";
				const ingredient = parts.slice(1).join(" ") || line.trim();
				return { quantity, measure: "", ingredient };
			})
			.filter((i) => i.ingredient);

		const directionList = directions.split("\n").filter((d) => d.trim());
		const keywordList = keywords
			.split(",")
			.map((k) => k.trim())
			.filter((k) => k);

		const newRecipe: Recipe = {
			slug: name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
			name,
			description,
			github: "",
			ingredients: ingredientList,
			directions: directionList,

			image,
			keywords: keywordList,
			source: "User Created",
		};

		addUserRecipe(newRecipe);
		navigate("/recipes");
	};

	return (
		<div className="mx-auto max-w-2xl space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Create Recipe</h1>
				<p className="text-gray-500 dark:text-gray-400">Add a new cocktail recipe to your collection.</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
				<div className="space-y-2">
					<label className="text-sm font-medium">Name</label>
					<input
						required
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-800"
						placeholder="e.g. My Custom Margarita"
					/>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium">Description</label>
					<textarea
						required
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-800"
						placeholder="A brief description of the drink..."
					/>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium">Ingredients (one per line)</label>
					<textarea
						required
						value={ingredients}
						onChange={(e) => setIngredients(e.target.value)}
						className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-800"
						placeholder="2 oz Tequila&#10;1 oz Lime Juice&#10;0.5 oz Agave Syrup"
					/>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium">Directions (one per line)</label>
					<textarea
						required
						value={directions}
						onChange={(e) => setDirections(e.target.value)}
						className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-800"
						placeholder="Shake with ice.&#10;Strain into glass.&#10;Garnish with lime."
					/>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium">Keywords (comma separated)</label>
					<input
						value={keywords}
						onChange={(e) => setKeywords(e.target.value)}
						className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-800"
						placeholder="Summer, Fruity, Strong"
					/>
				</div>

				<div className="space-y-4">
					<label className="text-sm font-medium">Recipe Image</label>
					<div className="flex gap-4">
						<button
							type="button"
							onClick={() => setImageType("url")}
							className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${imageType === "url"
								? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
								: "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
								}`}
						>
							Image URL
						</button>
						<button
							type="button"
							onClick={() => setImageType("upload")}
							className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${imageType === "upload"
								? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
								: "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
								}`}
						>
							Upload File
						</button>
					</div>

					{imageType === "url" ? (
						<input
							value={image}
							onChange={(e) => setImage(e.target.value)}
							className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-800"
							placeholder="https://example.com/cocktail.jpg"
						/>
					) : (
						<input
							type="file"
							accept="image/*"
							onChange={handleImageUpload}
							className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
						/>
					)}

					{image && (
						<div className="mt-4 aspect-video w-full max-w-sm overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900">
							<img src={image} alt="Preview" className="h-full w-full object-cover" />
						</div>
					)}
				</div>

				<div className="flex justify-end gap-4">
					<button
						type="button"
						onClick={() => navigate("/recipes")}
						className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
					>
						Cancel
					</button>
					<button
						type="submit"
						className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
					>
						Save Recipe
					</button>
				</div>
			</form>
		</div>
	);
}
