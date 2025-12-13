export const LoadingSpinner = () => {
	return (
		<div className="flex h-[50vh] w-full items-center justify-center">
			<div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400"></div>
			<span className="sr-only">Loading...</span>
		</div>
	);
};
