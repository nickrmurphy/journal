import { isSameDay, isWithinInterval } from "date-fns";
import { useMemo } from "react";
import { create, type StateCreator } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { Entry } from "../domains/entry";
import type { CreateJournalEntry, JournalEntry } from "../types";

type JournalEntriesState = {
	entries: { [key: string]: JournalEntry };
	addEntry: (entry: CreateJournalEntry) => string | undefined;
	addComment: (entryId: string, content: string) => string | undefined;
};

const journalEntryStateCreator: StateCreator<JournalEntriesState> = (set) => ({
	entries: {
		[crypto.randomUUID()]: {
			...Entry.make({ content: "Hello, world!" }),
			createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
		},
	},
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
	useJournalEntries(
		useShallow((state) =>
			Object.values(state.entries).filter((e) => isSameDay(date, e.createdAt)),
		),
	);

export const useEntriesInRange = (start: string, end: string) => {
	const entries = useJournalEntries(
		useShallow((state) =>
			Object.values(state.entries).filter((e) =>
				isWithinInterval(new Date(e.createdAt), {
					start: new Date(start),
					end: new Date(end),
				}),
			),
		),
	);

	return useMemo(() => {
		const grouped = Object.groupBy(
			entries,
			// biome-ignore lint/style/noNonNullAssertion: <Always defined>
			(entry) => new Date(entry.createdAt).toISOString().split("T")[0]!,
		);
		return Object.entries(grouped).map(([date, entries]) => ({
			date,
			entries: entries || [],
		}));
	}, [entries]);
};

export { useJournalEntries };
