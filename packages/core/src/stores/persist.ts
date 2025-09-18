import { del, get, set } from "idb-keyval";
import { createJSONStorage, type StateStorage } from "zustand/middleware";

const storage: StateStorage = {
	getItem: async (name: string): Promise<string | null> => {
		return (await get(name)) || null;
	},
	setItem: async (name: string, value: string): Promise<void> => {
		await set(name, value);
	},
	removeItem: async (name: string): Promise<void> => {
		await del(name);
	},
};

export const createStorage = () => createJSONStorage(() => storage);
