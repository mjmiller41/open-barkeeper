/**
 * A generic storage service wrapper around localStorage.
 * Handles JSON serialization/deserialization and provides a simple API.
 */
export class StorageService {
    private static instance: StorageService;
    private listeners: Map<string, Set<(value: any) => void>> = new Map();

    private constructor() {
        // Listen for storage events from other tabs
        window.addEventListener("storage", this.handleStorageEvent);
    }

    public static getInstance(): StorageService {
        if (!StorageService.instance) {
            StorageService.instance = new StorageService();
        }
        return StorageService.instance;
    }

    private handleStorageEvent = (event: StorageEvent) => {
        if (event.key && this.listeners.has(event.key)) {
            const newValue = event.newValue ? JSON.parse(event.newValue) : null;
            this.notifyListeners(event.key, newValue);
        }
    };

    private notifyListeners(key: string, value: any) {
        const keyListeners = this.listeners.get(key);
        if (keyListeners) {
            keyListeners.forEach((listener) => listener(value));
        }
    }

    /**
     * Get an item from storage.
     * @param key The key to retrieve.
     * @param defaultValue The default value if the key does not exist.
     */
    public getItem<T>(key: string, defaultValue: T): T {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading key "${key}" from localStorage:`, error);
            return defaultValue;
        }
    }

    /**
     * Save an item to storage.
     * @param key The key to save to.
     * @param value The value to save.
     */
    public setItem<T>(key: string, value: T): void {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
            this.notifyListeners(key, value);
        } catch (error) {
            console.error(`Error writing key "${key}" to localStorage:`, error);
        }
    }

    /**
     * Remove an item from storage.
     * @param key The key to remove.
     */
    public removeItem(key: string): void {
        try {
            localStorage.removeItem(key);
            this.notifyListeners(key, null);
        } catch (error) {
            console.error(`Error removing key "${key}" from localStorage:`, error);
        }
    }

    /**
     * Subscribe to changes for a specific key.
     * @param key The key to listen for.
     * @param callback The function to call when the value changes.
     * @returns A cleanup function to unsubscribe.
     */
    public subscribe<T>(key: string, callback: (value: T) => void): () => void {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        this.listeners.get(key)!.add(callback);

        return () => {
            const keyListeners = this.listeners.get(key);
            if (keyListeners) {
                keyListeners.delete(callback);
                if (keyListeners.size === 0) {
                    this.listeners.delete(key);
                }
            }
        };
    }
}

export const storage = StorageService.getInstance();
