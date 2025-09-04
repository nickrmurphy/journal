import { type EntryStore, entryStore } from "./store";
import type { Entry } from "./types";

export const getEntries = (store: EntryStore) => {
	return store.get();
};

export const createEntry = async (store: EntryStore, content: string) => {
	const id = crypto.randomUUID();
	const entry: Entry = {
		$id: id,
		content,
		createdAt: new Date().toISOString(),
	};
	return store.set({ [id]: entry });
};

export const createEntryService = () => {
	const loadPromise = entryStore.load();

	return {
		listEntries: async () => {
			await loadPromise;
			const entries = getEntries(entryStore);
			console.log("Entries:");
			for (const entry of Object.values(entries || {})) {
				console.log(entry);
			}
			if (Object.values(entries || {}).length === 0) {
				console.log("No entries found.");
			}
		},
		createEntry: async (content: string) => {
			const success = await createEntry(entryStore, content);
			if (success) {
				console.log("Created entry!");
			} else {
				console.log("Failed to create entry.");
			}
		},
	};
};
