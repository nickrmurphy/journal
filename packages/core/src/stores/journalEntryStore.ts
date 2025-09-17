import { isSameDay, isWithinInterval } from "date-fns";
import { create, type StateCreator } from "zustand";
import { Entry } from "../domains/entry";
import type { CreateJournalEntry, JournalEntry } from "../types";

type JournalEntriesState = {
	entries: { [key: string]: JournalEntry };
	addEntry: (entry: CreateJournalEntry) => string | undefined;
	addComment: (entryId: string, content: string) => string | undefined;
};

const journalEntryStateCreator: StateCreator<JournalEntriesState> = (set) => ({
	entries: {},
	addEntry: (entry: CreateJournalEntry) => {
		try {
			const validatedEntry = Entry.make(entry);
			set((state) => ({
				entries: {
					...state.entries,
					[validatedEntry.id]: validatedEntry,
				},
			}));

			return validatedEntry.id;
		} catch (error) {
			console.error("Failed to add entry:", error);
			return undefined;
		}
	},
	addComment: (entryId: string, content: string) => {
		try {
			const comment = Entry.makeComment(content);

			set((state) => {
				const entry = state.entries[entryId];
				if (!entry) {
					console.error(`Entry with ID ${entryId} not found`);
					return state;
				}

				const updatedEntry = Entry.addComment(entry, comment);
				return {
					entries: {
						...state.entries,
						[entryId]: updatedEntry,
					},
				};
			});

			return comment.id;
		} catch (error) {
			console.error("Failed to add comment:", error);
			return undefined;
		}
	},
});

const useJournalEntries = create(journalEntryStateCreator);

export const useEntriesOnDate = (date: string) =>
	useJournalEntries((state) =>
		Object.values(state.entries).filter((e) => isSameDay(date, e.createdAt)),
	);

export const useEntriesInRange = (start: string, end: string) =>
	useJournalEntries((state) =>
		Object.values(state.entries).filter((e) =>
			isWithinInterval(new Date(e.createdAt), {
				start: new Date(start),
				end: new Date(end),
			}),
		),
	);

export { useJournalEntries };
