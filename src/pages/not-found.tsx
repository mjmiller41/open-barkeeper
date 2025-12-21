import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";

export function NotFound() {
	const navigate = useNavigate();

	return (
		<section className="flex min-h-screen items-start bg-gray-50 py-16 md:items-center md:py-24 dark:bg-gray-900">
			<div className="mx-auto max-w-container grow px-4 md:px-8">
				<div className="flex w-full max-w-3xl flex-col gap-8 md:gap-12">
					<div className="flex flex-col gap-4 md:gap-6">
						<div className="flex flex-col gap-3">
							<span className="text-md font-semibold text-blue-600 dark:text-blue-400">404 error</span>
							<h1 className="text-display-md font-semibold text-gray-900 md:text-display-lg lg:text-display-xl dark:text-gray-50">We can’t find that page</h1>
						</div>
						<p className="text-lg text-gray-500 md:text-xl dark:text-gray-400">Sorry, the page you are looking for doesn't exist or has been moved.</p>
					</div>

					<div className="flex flex-col-reverse gap-3 sm:flex-row">
						<button
							onClick={() => navigate(-1)}
							className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900"
						>
							<ArrowLeft className="h-4 w-4" />
							Go back
						</button>
						<Link
							to="/"
							className="flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
						>
							Take me home
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
