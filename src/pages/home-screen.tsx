import { Link } from "react-router";

export const HomeScreen = () => {
    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-gray-50">Open Barkeeper</h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600 dark:text-gray-300">
                Your open source cocktail recipe manager. Browse hundreds of recipes, search by ingredients, and manage your own collection.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                    to="/recipes"
                    className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    Browse Recipes
                </Link>
                <Link to="/search" className="text-sm leading-6 font-semibold text-gray-900 dark:text-gray-50">
                    Search <span aria-hidden="true">→</span>
                </Link>
            </div>
        </div>
    );
};
