import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "@/components/layout";
import { CreateRecipePage } from "@/pages/create-recipe-page";
import { HomeScreen } from "@/pages/home-screen";
import { NotFound } from "@/pages/not-found";
import { RecipeDetailPage } from "@/pages/recipe-detail-page";
import { RecipesPage } from "@/pages/recipes-page";
import { SearchPage } from "@/pages/search-page";
import { RouteProvider } from "@/providers/router-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "@/styles/globals.css";
import { registerSW } from "virtual:pwa-register";

registerSW({
	onNeedRefresh() {
		// Automatically reload on update for now, or prompt user
	},
	onOfflineReady() {
		console.log("App ready to work offline");
	},
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider>
			<BrowserRouter>
				<RouteProvider>
					<Routes>
						<Route element={<Layout />}>
							<Route path="/" element={<HomeScreen />} />
							<Route path="/recipes" element={<RecipesPage />} />
							<Route path="/recipes/new" element={<CreateRecipePage />} />
							<Route path="/recipes/:slug" element={<RecipeDetailPage />} />
							<Route path="/search" element={<SearchPage />} />
						</Route>
						<Route path="*" element={<NotFound />} />
					</Routes>
				</RouteProvider>
			</BrowserRouter>
		</ThemeProvider>
	</StrictMode>,
);
