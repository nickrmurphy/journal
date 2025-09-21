import { createJSONStorage, type StateStorage } from "zustand/middleware";

class IndexedDBStorage {
	private dbName = "keyval-store";
	private storeName = "keyval";
	private dbPromise: Promise<IDBDatabase>;

	constructor() {
		this.dbPromise = this.initDB();
	}

	private initDB(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, 1);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve(request.result);

			request.onupgradeneeded = () => {
				const db = request.result;
				if (!db.objectStoreNames.contains(this.storeName)) {
					db.createObjectStore(this.storeName);
				}
			};
		});
	}

	async get(key: string): Promise<string | null> {
		try {
			const db = await this.dbPromise;
			const transaction = db.transaction(this.storeName, "readonly");
			const store = transaction.objectStore(this.storeName);
			const request = store.get(key);

			return new Promise((resolve, reject) => {
				request.onerror = () => reject(request.error);
				request.onsuccess = () => resolve(request.result || null);
			});
		} catch (error) {
			console.error("IndexedDB get error:", error);
			return null;
		}
	}

	async set(key: string, value: string): Promise<void> {
		try {
			const db = await this.dbPromise;
			const transaction = db.transaction(this.storeName, "readwrite");
			const store = transaction.objectStore(this.storeName);
			const request = store.put(value, key);

			return new Promise((resolve, reject) => {
				request.onerror = () => reject(request.error);
				request.onsuccess = () => resolve();
			});
		} catch (error) {
			console.error("IndexedDB set error:", error);
			throw error;
		}
	}

	async del(key: string): Promise<void> {
		try {
			const db = await this.dbPromise;
			const transaction = db.transaction(this.storeName, "readwrite");
			const store = transaction.objectStore(this.storeName);
			const request = store.delete(key);

			return new Promise((resolve, reject) => {
				request.onerror = () => reject(request.error);
				request.onsuccess = () => resolve();
			});
		} catch (error) {
			console.error("IndexedDB delete error:", error);
			throw error;
		}
	}
}

const idbStorage = new IndexedDBStorage();

const storage: StateStorage = {
	getItem: async (name: string): Promise<string | null> => {
		return await idbStorage.get(name);
	},
	setItem: async (name: string, value: string): Promise<void> => {
		await idbStorage.set(name, value);
	},
	removeItem: async (name: string): Promise<void> => {
		await idbStorage.del(name);
	},
};

export const createStorage = () => createJSONStorage(() => storage);
