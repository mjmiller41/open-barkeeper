import { useState, useEffect, lazy, Suspense } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { useAdSense } from "@/hooks/use-adsense";

// FirstLoadPrompt removed


export function Layout() {
	useAdSense();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	// const [showOfflinePrompt, setShowOfflinePrompt] = useState(false); // Removed
	const location = useLocation();

	// Close menu when route changes
	useEffect(() => {
		setIsMenuOpen(false);
	}, [location.pathname]);

	return (
		<div className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900 dark:bg-gray-900 dark:text-gray-100">
			<header className="sticky top-0 z-50 w-full flex-[0_0_auto] border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-950/80">
				<div className="container mx-auto flex h-16 items-center justify-between px-4">
					<div className="flex items-center">
						<Link to="/" className="mr-6 flex items-center space-x-2 text-xl font-bold">
							<span>Open Barkeeper</span>
						</Link>
						<nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
							<Link to="/recipes" className="transition-colors hover:text-gray-900/80 dark:hover:text-gray-50/80">
								Recipes
							</Link>
							<Link to="/search" className="transition-colors hover:text-gray-900/80 dark:hover:text-gray-50/80">
								Search
							</Link>
							<Link to="/recipes/new" className="transition-colors hover:text-gray-900/80 dark:hover:text-gray-50/80">
								Add Recipe
							</Link>
							<Link to="/settings" className="transition-colors hover:text-gray-900/80 dark:hover:text-gray-50/80">
								Settings
							</Link>
						</nav>
					</div>
					<div className="flex items-center gap-2">
						{/* Download button removed */}
						<button
							className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 focus:outline-none md:hidden dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400 dark:hover:bg-gray-900"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							<span className="sr-only">Toggle menu</span>
							{isMenuOpen ? (
								<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							) : (
								<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
								</svg>
							)}
						</button>
					</div>
				</div>
				{/* Mobile Menu */}
				{isMenuOpen && (
					<div className="border-t border-gray-200 bg-white px-4 py-6 md:hidden dark:border-gray-800 dark:bg-gray-950">
						<nav className="flex flex-col space-y-4">
							<Link to="/recipes" className="text-sm font-medium transition-colors hover:text-gray-900/80 dark:hover:text-gray-50/80">
								Recipes
							</Link>
							<Link to="/search" className="text-sm font-medium transition-colors hover:text-gray-900/80 dark:hover:text-gray-50/80">
								Search
							</Link>
							<Link to="/recipes/new" className="text-sm font-medium transition-colors hover:text-gray-900/80 dark:hover:text-gray-50/80">
								Add Recipe
							</Link>
							<Link to="/settings" className="text-sm font-medium transition-colors hover:text-gray-900/80 dark:hover:text-gray-50/80">
								Settings
							</Link>
						</nav>
					</div>
				)}
			</header>
			<main className="container mx-auto flex-[1_0_auto] px-4 py-6">
				<Outlet />
			</main>
			{/* FirstLoadPrompt removed */}
			<footer className="border-t border-gray-200 bg-white py-8 flex-[0_0_auto] dark:border-gray-800 dark:bg-gray-950">
				<div className="container mx-auto px-4">
					<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
						<div className="text-sm text-gray-500 dark:text-gray-400">
							&copy; {new Date().getFullYear()} Open Barkeeper. All rights reserved.
						</div>
						<nav className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
							<Link to="/about" className="hover:text-gray-900 hover:underline dark:hover:text-gray-50">
								About
							</Link>
							<Link to="/contact" className="hover:text-gray-900 hover:underline dark:hover:text-gray-50">
								Contact
							</Link>
							<Link to="/privacy" className="hover:text-gray-900 hover:underline dark:hover:text-gray-50">
								Privacy
							</Link>
							<Link to="/terms" className="hover:text-gray-900 hover:underline dark:hover:text-gray-50">
								Terms
							</Link>
						</nav>
					</div>
				</div>
			</footer>
		</div>
	);
}
