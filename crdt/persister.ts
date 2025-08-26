// Simple IndexedDB promise-based functions
const openDB = (): Promise<IDBDatabase> => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open("keyval-store", 1);
		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);
		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains("keyval")) {
				db.createObjectStore("keyval");
			}
		};
	});
};

const get = async <T>(key: string): Promise<T | undefined> => {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction("keyval", "readonly");
		const store = transaction.objectStore("keyval");
		const request = store.get(key);
		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);
	});
};

const set = async (key: string, value: unknown): Promise<void> => {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction("keyval", "readwrite");
		const store = transaction.objectStore("keyval");
		const request = store.put(value, key);
		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve();
	});
};

export type Persister<T> = {
	get: () => Promise<T | null>;
	set: (data: T) => Promise<void>;
};

export const createIdbPersister = <T>(key: string): Persister<T> => {
	const getState = async (): Promise<T | null> => {
		const state = await get<T>(key);
		return state || null;
	};

	const setState = async (data: T) => {
		return set(key, data);
	};

	return { get: getState, set: setState };
};
