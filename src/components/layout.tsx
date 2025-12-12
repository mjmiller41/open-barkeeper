import { Link, Outlet } from "react-router";
import { FirstLoadPrompt } from "./first-load-prompt";

export function Layout() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-950/80">
                <div className="container mx-auto flex h-16 items-center px-4">
                    <div className="mr-4 hidden md:flex">
                        <Link to="/" className="mr-6 flex items-center space-x-2 text-xl font-bold">
                            <span>Open Barkeeper</span>
                        </Link>
                        <nav className="flex items-center space-x-6 text-sm font-medium">
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
                </div>
            </header>
            <main className="container mx-auto px-4 py-6">
                <Outlet />
            </main>
            <FirstLoadPrompt />
        </div>
    );
}
