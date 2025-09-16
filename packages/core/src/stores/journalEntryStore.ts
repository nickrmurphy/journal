import { create } from "zustand";
import { JournalEntryCommentSchema, JournalEntrySchema } from "../schemas";
import type { CreateJournalEntry, JournalEntry } from "../types";

type JournalEntriesState = {
	entries: { [key: string]: JournalEntry };
	addEntry: (entry: CreateJournalEntry) => string | undefined;
	addComment: (entryId: string, content: string) => string | undefined;
};

const useJournalEntries = create<JournalEntriesState>((set) => ({
	entries: {},
	addEntry: (entry: CreateJournalEntry) => {
		const result = JournalEntrySchema.safeParse(entry);
		if (!result.success) {
			console.error("Failed to add entry:", result.error);
			return undefined;
		}

		const validatedEntry = result.data;
		set((state) => ({
			entries: {
				...state.entries,
				[validatedEntry.id]: validatedEntry,
			},
		}));

		return validatedEntry.id;
	},
	addComment: (entryId: string, content: string) => {
		const result = JournalEntryCommentSchema.safeParse({ content });
		if (!result.success) {
			console.error("Failed to add comment:", result.error);
			return undefined;
		}

		const validatedComment = result.data;
		let entryExists = false;

		set((state) => {
			const entry = state.entries[entryId];
			if (!entry) {
				console.error(`Entry with ID ${entryId} not found`);
				return state;
			}

			entryExists = true;
			return {
				entries: {
					...state.entries,
					[entryId]: {
						...entry,
						comments: [...entry.comments, validatedComment],
					},
				},
			};
		});

		return entryExists ? validatedComment.id : undefined;
	},
}));

export { useJournalEntries };
