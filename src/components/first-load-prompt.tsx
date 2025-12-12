import { useEffect, useState } from "react";
import { getAllRecipes } from "@/lib/recipes";

export function FirstLoadPrompt() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const hasPrompted = localStorage.getItem("offline-prompt-shown");
        if (!hasPrompted) {
            setIsOpen(true);
        }
    }, []);

    const handleDismiss = () => {
        setIsOpen(false);
        localStorage.setItem("offline-prompt-shown", "true");
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        const recipes = getAllRecipes();
        const total = recipes.length;
        let count = 0;

        // Prefetch images to trigger service worker caching
        // We limit concurrency to avoid overwhelming the network/browser
        const batchSize = 5;
        for (let i = 0; i < total; i += batchSize) {
            const batch = recipes.slice(i, i + batchSize);
            await Promise.all(
                batch.map(async (recipe) => {
                    if (recipe.image) {
                        try {
                            const imgPath = `/img/recipes/${recipe.image}`;
                            await fetch(imgPath, { mode: "no-cors" });
                        } catch (e) {
                            console.warn(`Failed to prefetch image for ${recipe.name}`, e);
                        }
                    }
                }),
            );
            count += batch.length;
            setProgress(Math.min(100, Math.round((count / total) * 100)));
        }

        localStorage.setItem("offline-prompt-shown", "true");
        setIsDownloading(false);
        setIsOpen(false);
        alert("All recipes are now available offline!");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Enable Offline Access?</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Would you like to download all recipe images for offline use? This may use around 50MB of data.
                </p>

                {isDownloading ? (
                    <div className="mt-4 space-y-2">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="text-center text-sm text-gray-500">Downloading... {progress}%</p>
                    </div>
                ) : (
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={handleDismiss}
                            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                        >
                            Not Now
                        </button>
                        <button
                            onClick={handleDownload}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                        >
                            Download All
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
