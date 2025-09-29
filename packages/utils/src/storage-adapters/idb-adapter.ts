import { clear, del, get, set } from "idb-keyval";
import type { AsyncStorageApi } from "../storage-adapters";

/**
 * Creates an IndexedDB storage adapter using idb-keyval
 * @returns AsyncStorageApi implementation backed by IndexedDB
 */
export function createIdbStorage(): AsyncStorageApi {
	return {
		getItem: async (key: string) => {
			const value = await get(key);
			return value ?? null;
		},
		setItem: async (key: string, value: string) => {
			await set(key, value);
		},
		removeItem: async (key: string) => {
			await del(key);
		},
		clear: async () => {
			await clear();
		},
	};
}
