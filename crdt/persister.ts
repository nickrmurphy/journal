import * as mutator from "./mutator";
import { deserialize, serialize } from "./serializer";
import type { CRDTState, Entity } from "./types";

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

export const createIdbPersister = <T extends Entity>(key: string) => {
	let init = false;
	let state: CRDTState = [];

	const loadData = async () => {
		const persisted = await get<CRDTState>(key);
		state = persisted || [];
		init = true;
		return state;
	};

	const persist = async () => {
		if (!init) return;
		await set(key, state);
	};

	const materialize = async (): Promise<T[]> => {
		if (!init) await loadData();
		return state ? deserialize(state) : [];
	};

	const mutate = async <T extends Entity>(data: T): Promise<void> => {
		if (!init) await loadData();
		const operations = serialize(new Date().toISOString(), data.$id, data);
		const [newstate, changed] = mutator.set(state, operations);
		if (changed) {
			state = newstate;
			await persist();
		}
	};

	return { materialize, mutate };
};
