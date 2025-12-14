import { useEffect, useState } from "react";

const ADSENSE_ID = "ca-pub-1542262851763938";

export function useAdSense() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Prevent double injection
        if (document.getElementById("adsense-script")) {
            setIsLoaded(true);
            return;
        }

        const loadScript = () => {
            const script = document.createElement("script");
            script.id = "adsense-script";
            script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`;
            script.async = true;
            script.crossOrigin = "anonymous";
            script.onload = () => setIsLoaded(true);
            document.head.appendChild(script);
        };

        // Defer loading by 2.5 seconds to allow LCP to finish
        const timer = setTimeout(() => {
            if ("requestIdleCallback" in window) {
                window.requestIdleCallback(() => loadScript());
                loadScript();
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return isLoaded;
}
