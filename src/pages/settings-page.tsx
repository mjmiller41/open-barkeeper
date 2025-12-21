import { useState, useRef } from "react";
import { Recipe } from "@/lib/recipes";
import { useOfflineStorage } from "@/hooks/use-offline-storage";
import { useRecipes } from "@/providers/recipe-provider";

export function SettingsPage() {
	const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
	const [conflicts, setConflicts] = useState<Array<{ existing: Recipe, new: Recipe }>>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const favoritesFileInputRef = useRef<HTMLInputElement>(null);
	const { isDownloaded, isDownloading, progress, downloadRecipes, deleteRecipes } = useOfflineStorage();

	const {
		exportRecipes,
		importRecipes,
		deleteAllUserRecipes,
		updateUserRecipe,
		exportFavorites,
		importFavorites
	} = useRecipes();

	const handleExport = () => {
		const recipes = exportRecipes();
		const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(recipes, null, 2));
		const downloadAnchorNode = document.createElement('a');
		downloadAnchorNode.setAttribute("href", dataStr);
		downloadAnchorNode.setAttribute("download", "user_recipes.json");
		document.body.appendChild(downloadAnchorNode); // required for firefox
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
		setMessage({ type: 'success', text: `Exported ${recipes.length} recipes.` });
	};

	const handleExportFavorites = () => {
		const favorites = exportFavorites();
		const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(favorites, null, 2));
		const downloadAnchorNode = document.createElement('a');
		downloadAnchorNode.setAttribute("href", dataStr);
		downloadAnchorNode.setAttribute("download", "favorites.json");
		document.body.appendChild(downloadAnchorNode);
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
		setMessage({ type: 'success', text: `Exported ${favorites.length} favorites.` });
	};

	const handleImportClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const fileObj = event.target.files && event.target.files[0];
		if (!fileObj) {
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			const content = e.target?.result as string;
			const result = importRecipes(content);

			if (result.conflicts.length > 0) {
				setConflicts(result.conflicts);
				setMessage({ type: 'error', text: `${result.message} Please resolve conflicts.` });
			} else {
				if (result.success) {
					setMessage({ type: 'success', text: result.message });
				} else {
					setMessage({ type: 'error', text: result.message });
				}
			}

			// Reset input so same file can be selected again if needed
			if (fileInputRef.current) fileInputRef.current.value = "";
		};
		reader.readAsText(fileObj);
	};

	const handleFavoritesFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const fileObj = event.target.files && event.target.files[0];
		if (!fileObj) {
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			const content = e.target?.result as string;
			const result = importFavorites(content);

			if (result.success) {
				setMessage({ type: 'success', text: result.message });
			} else {
				setMessage({ type: 'error', text: result.message });
			}

			if (favoritesFileInputRef.current) favoritesFileInputRef.current.value = "";
		};
		reader.readAsText(fileObj);
	};

	const handleDeleteUserRecipes = () => {
		if (window.confirm("Are you sure you want to delete ALL user-created recipes? This action cannot be undone.")) {
			deleteAllUserRecipes();
			setMessage({ type: 'success', text: "All user recipes have been deleted." });
		}
	};

	const resolveConflict = (action: 'keep' | 'overwrite') => {
		if (conflicts.length === 0) return;

		const conflict = conflicts[0];
		if (action === 'overwrite') {
			updateUserRecipe(conflict.new);
		}
		// If 'keep', we do nothing (existing remains)

		// Move to next conflict
		const remaining = conflicts.slice(1);
		setConflicts(remaining);

		if (remaining.length === 0) {
			setMessage({ type: 'success', text: "All conflicts resolved." });
		}
	};

	return (
		<div className="mx-auto max-w-2xl space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Settings</h1>
				<p className="text-gray-500 dark:text-gray-400">Manage your application data and preferences.</p>
			</div>

			<div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
				<h2 className="text-xl font-semibold">Data Management</h2>
				<div className="space-y-4">
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Export your locally created recipes to a JSON file, or import recipes from a backup.
					</p>

					<div className="flex gap-4">
						<button
							onClick={handleExport}
							className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							Export Recipes
						</button>
						<button
							onClick={handleImportClick}
							className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
						>
							Import Recipes
						</button>
						<input
							type="file"
							accept=".json"
							ref={fileInputRef}
							style={{ display: 'none' }}
							onChange={handleFileChange}
						/>
						<button
							onClick={handleDeleteUserRecipes}
							className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
						>
							Delete User Recipes
						</button>
					</div>

					{message && (
						<div className={`mt-4 rounded-md p-4 text-sm ${message.type === 'success'
							? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
							: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
							}`}>
							{message.text}
						</div>
					)}
				</div>
			</div>

			<div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
				<h2 className="text-xl font-semibold">Favorites Management</h2>
				<div className="space-y-4">
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Backup your favorite recipes listing or restore from a file.
					</p>

					<div className="flex gap-4">
						<button
							onClick={handleExportFavorites}
							className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
						>
							Export Favorites
						</button>
						<button
							onClick={() => favoritesFileInputRef.current?.click()}
							className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
						>
							Import Favorites
						</button>
						<input
							type="file"
							accept=".json"
							ref={favoritesFileInputRef}
							style={{ display: 'none' }}
							onChange={handleFavoritesFileChange}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
				<h2 className="text-xl font-semibold">Save Recipes to Localstorage</h2>
				<div className="space-y-4">
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Make all recipes available offline by downloading the images to your device.
					</p>

					{/* Progress Bar */}
					{isDownloading && (
						<div className="space-y-2">
							<div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
								<div
									className="h-full bg-blue-600 transition-all duration-300"
									style={{ width: `${progress}%` }}
								/>
							</div>
							<p className="text-xs text-gray-500 text-right">{progress}%</p>
						</div>
					)}

					<div className="flex gap-4">
						<button
							onClick={downloadRecipes}
							disabled={isDownloaded || isDownloading}
							className={`rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDownloaded || isDownloading
								? 'bg-blue-400 cursor-not-allowed dark:bg-blue-800'
								: 'bg-blue-600 hover:bg-blue-700'
								}`}
						>
							{isDownloaded ? 'Downloaded' : isDownloading ? 'Downloading...' : 'Download Recipes'}
						</button>
						<button
							onClick={deleteRecipes}
							disabled={!isDownloaded || isDownloading}
							className={`rounded-md border px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${!isDownloaded || isDownloading
								? 'border-gray-200 text-gray-400 cursor-not-allowed dark:border-gray-800 dark:text-gray-600'
								: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40'
								}`}
						>
							Delete Localstorage
						</button>
					</div>

					<p className="text-xs text-gray-500 italic">
						Note: User created recipes will not be deleted.
					</p>
				</div>
			</div>

			{/* Conflict Resolution Modal */}
			{conflicts.length > 0 && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
					<div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
						<h3 className="mb-4 text-lg font-bold">Import Conflict ({conflicts.length} remaining)</h3>
						<p className="mb-4 text-sm text-gray-500">
							The recipe <b>"{conflicts[0].new.name}"</b> already exists but has different content.
						</p>

						<div className="mb-6 grid grid-cols-2 gap-4">
							<div className="overflow-hidden rounded border border-gray-200 p-2 dark:border-gray-800">
								<h4 className="mb-2 font-semibold text-gray-700 dark:text-gray-300">Existing</h4>
								<pre className="h-64 overflow-auto text-xs text-gray-600 dark:text-gray-400">
									{JSON.stringify(conflicts[0].existing, null, 2)}
								</pre>
							</div>
							<div className="overflow-hidden rounded border border-blue-200 bg-blue-50 p-2 dark:border-blue-900 dark:bg-blue-900/20">
								<h4 className="mb-2 font-semibold text-blue-700 dark:text-blue-300">Importing</h4>
								<pre className="h-64 overflow-auto text-xs text-blue-800 dark:text-blue-200">
									{JSON.stringify(conflicts[0].new, null, 2)}
								</pre>
							</div>
						</div>

						<div className="flex justify-end gap-3">
							<button
								onClick={() => resolveConflict('keep')}
								className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
							>
								Keep Existing
							</button>
							<button
								onClick={() => resolveConflict('overwrite')}
								className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
							>
								Overwrite
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
