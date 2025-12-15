import { useCallback, useEffect, useState } from "react";
import { getAllRecipes } from "@/lib/recipes";

export function useOfflineStorage() {
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const checkStatus = () => {
            const stored = localStorage.getItem("offline-prompt-shown");
            setIsDownloaded(stored === "true");
        };
        checkStatus();
        window.addEventListener("storage", checkStatus);
        return () => window.removeEventListener("storage", checkStatus);
    }, []);

    const downloadRecipes = useCallback(async () => {
        setIsDownloading(true);
        setProgress(0);
        const recipes = getAllRecipes();
        const total = recipes.length;
        let count = 0;

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
        setIsDownloaded(true);
        setIsDownloading(false);
        setProgress(100);
    }, []);

    const deleteRecipes = useCallback(async () => {
        try {
            // Clear localStorage flag
            localStorage.removeItem("offline-prompt-shown");
            setIsDownloaded(false);

            // Delete cache
            if ("caches" in window) {
                const cacheName = "recipe-images-cache"; // Must match vite config
                await caches.delete(cacheName);
            }
        } catch (e) {
            console.error("Failed to delete offline data", e);
        }
    }, []);

    return {
        isDownloaded,
        isDownloading,
        progress,
        downloadRecipes,
        deleteRecipes,
    };
}
