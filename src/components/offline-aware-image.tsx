import { useState, useEffect } from "react";
import { useOnlineStatus } from "@/hooks/use-online-status";

interface OfflineAwareImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
	fallback?: React.ReactNode;
}

export function OfflineAwareImage({ src, fallback, alt, className, ...props }: OfflineAwareImageProps) {
	const isOnline = useOnlineStatus();
	const [isCached, setIsCached] = useState(false);
	const [isChecked, setIsChecked] = useState(false);

	useEffect(() => {
		if (!src) {
			setIsChecked(true);
			return;
		}

		// Check if image is in cache
		async function checkCache() {
			try {
				if ('caches' in window) {
					const match = await window.caches.match(src as string);
					if (match) {
						setIsCached(true);
					}
				}
			} catch (e) {
				console.error("Error checking cache", e);
			} finally {
				setIsChecked(true);
			}
		}

		checkCache();
	}, [src]);

	// If online, always attempt to render the image
	// If offline, only render if we confirmed it's cached
	const shouldRenderImage = isOnline || isCached;

	if (!isChecked && !isOnline) {
		// While checking cache offline, show nothing or placeholder
		// Using a div with same dimensions would be ideal but we don't know them here
		return <div className={`bg-gray-100 dark:bg-gray-800 ${className}`} />;
	}

	if (shouldRenderImage && src) {
		return (
			<img
				src={src}
				alt={alt}
				className={className}
				{...props}
				onError={(e) => {
					// Check if we have an onError prop to call
					if (props.onError) {
						props.onError(e);
					} else {
						// Default fallback logic if image fails to load even when we thought we could
						// For example, hides the image or replaces source
						(e.target as HTMLImageElement).style.display = 'none';
					}
				}}
			/>
		);
	}

	// Fallback content when offline and not cached
	return (
		<div className={`flex items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 ${className}`}>
			{fallback || (
				<svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
			)}
		</div>
	);
}
