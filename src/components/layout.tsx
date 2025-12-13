import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { FirstLoadPrompt } from "./first-load-prompt";

export function Layout() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const location = useLocation();

	// Close menu when route changes
	useEffect(() => {
		setIsMenuOpen(false);
	}, [location.pathname]);

	return (
		<div className="min-h-screen bg-gray-50 font-sans text-gray-900 dark:bg-gray-900 dark:text-gray-100">
			<header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-950/80">
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
						</nav>
					</div>
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
						</nav>
					</div>
				)}
			</header>
			<main className="container mx-auto px-4 py-6">
				<Outlet />
			</main>
			<FirstLoadPrompt />
		</div>
	);
}
