import type { PersistentStore, Store } from "@journal/crdt/store";
import { err, ok, type Result } from "@journal/fn";
import { type Entry, makeEntry } from "@journal/schema";

const getEntries = (store: Store<Record<string, Entry>>) => {
	return store.get();
};

const createEntry = (
	store: Store<Record<string, Entry>>,
	content: string,
): Result<void, string> => {
	const entry = makeEntry({ content });
	if (!entry.ok) {
		return err(entry.error);
	}
	store.set({ [entry.data._id]: entry.data });
	return ok();
};

export const createEntryService = (
	entryStore: PersistentStore<Record<string, Entry>>,
) => {
	const loadPromise = entryStore.load();

	return {
		getEntries: async () => {
			await loadPromise;
			const entries = getEntries(entryStore);
			return entries;
		},
		createEntry: (content: string) => createEntry(entryStore, content),
	};
};
