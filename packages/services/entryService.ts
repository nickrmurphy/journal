import type { PersistentStore, Store } from "@journal/crdt/store";
import { err, ok, type Result } from "@journal/fn";
import { type Entry, makeComment, makeEntry } from "@journal/schema";

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

const createComment = (
	store: Store<Record<string, Entry>>,
	entryId: string,
	content: string,
): Result<void, string> => {
	const entries = store.get();
	const entry = entries?.[entryId];
	if (!entry) {
		return err("Entry not found");
	}
	const comment = makeComment({ content });
	if (!comment.ok) {
		return err(comment.error);
	}
	entry.comments.push(comment.data);
	store.set({ [entryId]: entry });
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
		createComment: async (entryId: string, content: string) => {
			await loadPromise;
			return createComment(entryStore, entryId, content);
		},
	};
};
