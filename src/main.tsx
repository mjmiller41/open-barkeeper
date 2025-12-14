import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "@/components/layout";
import { LoadingSpinner } from "@/components/loading-spinner";
import { RouteProvider } from "@/providers/router-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "@/styles/globals.css";
import { registerSW } from "virtual:pwa-register";

// Lazy load pages
const CreateRecipePage = lazy(() => import("@/pages/create-recipe-page").then(module => ({ default: module.CreateRecipePage })));
const HomeScreen = lazy(() => import("@/pages/home-screen").then(module => ({ default: module.HomeScreen })));
const NotFound = lazy(() => import("@/pages/not-found").then(module => ({ default: module.NotFound })));
const RecipeDetailPage = lazy(() => import("@/pages/recipe-detail-page").then(module => ({ default: module.RecipeDetailPage })));
const RecipesPage = lazy(() => import("@/pages/recipes-page").then(module => ({ default: module.RecipesPage })));
const SearchPage = lazy(() => import("@/pages/search-page").then(module => ({ default: module.SearchPage })));
const AboutPage = lazy(() => import("@/pages/about-page").then(module => ({ default: module.AboutPage })));
const ContactPage = lazy(() => import("@/pages/contact-page").then(module => ({ default: module.ContactPage })));
const PrivacyPolicyPage = lazy(() => import("@/pages/privacy-policy-page").then(module => ({ default: module.PrivacyPolicyPage })));
const TermsPage = lazy(() => import("@/pages/terms-page").then(module => ({ default: module.TermsPage })));
const SettingsPage = lazy(() => import("@/pages/settings-page").then(module => ({ default: module.SettingsPage })));

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
					<Suspense fallback={<LoadingSpinner />}>
						<Routes>
							<Route element={<Layout />}>
								<Route path="/" element={<HomeScreen />} />
								<Route path="/recipes" element={<RecipesPage />} />
								<Route path="/recipes/new" element={<CreateRecipePage />} />
								<Route path="/recipes/:slug" element={<RecipeDetailPage />} />
								<Route path="/search" element={<SearchPage />} />
								<Route path="/about" element={<AboutPage />} />
								<Route path="/contact" element={<ContactPage />} />
								<Route path="/privacy" element={<PrivacyPolicyPage />} />
								<Route path="/terms" element={<TermsPage />} />
								<Route path="/settings" element={<SettingsPage />} />
							</Route>
							<Route path="*" element={<NotFound />} />
						</Routes>
					</Suspense>
				</RouteProvider>
			</BrowserRouter>
		</ThemeProvider>
	</StrictMode>,
);
