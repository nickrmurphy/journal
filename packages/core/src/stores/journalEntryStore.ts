import { isSameDay, isWithinInterval } from "date-fns";
import { useMemo } from "react";
import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import { Entry } from "../domains/entry";
import type {
	CreateJournalEntry,
	JournalEntry,
	JournalEntryComment,
} from "../types";
import { createStorage } from "./persist";

type JournalEntriesState = {
	entries: { [key: string]: JournalEntry };
	comments: { [key: string]: JournalEntryComment };
	addEntry: (entry: CreateJournalEntry) => string | undefined;
	addComment: (entryId: string, content: string) => string | undefined;
	getEntryComments: (entryId: string) => JournalEntryComment[];
};

const createJournalEntryState: StateCreator<JournalEntriesState> = (
	set,
	get,
) => ({
	entries: {},
	comments: {},
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
			const comment = Entry.makeComment(entryId, content);

			set((state) => {
				const entry = state.entries[entryId];
				if (!entry) {
					console.error(`Entry with ID ${entryId} not found`);
					return state;
				}

				return {
					comments: {
						...state.comments,
						[comment.id]: comment,
					},
				};
			});

			return comment.id;
		} catch (error) {
			console.error("Failed to add comment:", error);
			return undefined;
		}
	},
	getEntryComments: (entryId: string) => {
		const { comments } = get();
		return Object.values(comments).filter(
			(comment) => comment.entryId === entryId,
		);
	},
});

const useJournalEntries = create(
	persist(createJournalEntryState, {
		name: "journal-entries",
		storage: createStorage(),
		partialize: (state) => ({
			entries: state.entries,
			comments: state.comments,
		}),
	}),
);

export const useEntriesOnDate = (date: string) =>
	useJournalEntries(
		useShallow((state) =>
			Object.values(state.entries).filter((e) => isSameDay(date, e.createdAt)),
		),
	);

export const useEntryComments = (entryId: string) =>
	useJournalEntries(useShallow((state) => state.getEntryComments(entryId)));

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
