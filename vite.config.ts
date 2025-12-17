import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    server: {
        port: 3000,
        host: true,
    },
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: [
                "manifest.json",
                "favicon.ico",
                "favicon.svg",
                "apple-touch-icon.png",
                "android-chrome-96x96.png",
                "android-chrome-192x192.png",
                "android-chrome-512x512.png",
            ],
            manifest: false,
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "google-fonts-cache",
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "gstatic-fonts-cache",
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                    {
                        urlPattern: ({ url }) => url.pathname.startsWith("/img/recipes/"),
                        handler: "CacheFirst",
                        options: {
                            cacheName: "recipe-images-cache",
                            expiration: {
                                maxEntries: 500,
                                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
                            },
                        },
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        if (id.includes("react") || id.includes("react-dom") || id.includes("react-router")) {
                            return "vendor-react";
                        }
                        if (id.includes("@untitledui")) {
                            return "vendor-icons";
                        }
                        if (id.includes("framer-motion") || id.includes("motion") || id.includes("react-aria")) {
                            return "vendor-ui";
                        }
                        // Catch-all for other dependencies
                        return "vendor";
                    }
                    if (id.includes("src/recipes")) {
                        return "data-recipes";
                    }
                },
            },
        },
        chunkSizeWarningLimit: 1000,
    },
});
