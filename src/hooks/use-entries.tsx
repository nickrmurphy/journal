import { isSameDay } from "date-fns";
import { createEffect, createSignal, onCleanup } from "solid-js";
import type { Comment } from "@/schemas";
import {
	combineEntriesWithComments,
	sortByCreatedAtDesc,
} from "@/utils/entries";
import { db } from "../database/db";
import type { Entry } from "../schemas/entry";

type EntryWithComments = Entry & {
	comments: Comment[];
};

/**
 * Hook to fetch all entries with their comments.
 * Uses reactive query pattern - automatically updates when entries or comments change.
 */
export const useEntries = () => {
	const [entries, setEntries] = createSignal<EntryWithComments[]>([]);

	createEffect(() => {
		const query = db.query((tx) => {
			const entries = tx.entries.getAll().sort(sortByCreatedAtDesc);
			const allComments = tx.comments.getAll().sort(sortByCreatedAtDesc);
			return combineEntriesWithComments(entries, allComments);
		});

		setEntries(query.result);

		const unsubscribe = query.subscribe((results) => {
			setEntries(results);
		});

		onCleanup(() => {
			unsubscribe();
			query.dispose();
		});
	});

	return entries;
};

/**
 * Hook to fetch entries for a specific date with their comments.
 * Uses reactive query pattern - automatically updates when data changes.
 * @param date ISO date string to filter entries by
 */
export const useEntriesOnDate = (date: string) => {
	const [entries, setEntries] = createSignal<EntryWithComments[]>([]);

	createEffect(() => {
		const targetDate = new Date(date);

		const query = db.query((tx) => {
			const entries = tx.entries.find(
				(entry) => isSameDay(new Date(entry.createdAt), targetDate),
				{ sort: sortByCreatedAtDesc },
			);
			const allComments = tx.comments.getAll().sort(sortByCreatedAtDesc);
			return combineEntriesWithComments(entries, allComments);
		});

		setEntries(query.result);

		const unsubscribe = query.subscribe((results) => {
			setEntries(results);
		});

		onCleanup(() => {
			unsubscribe();
			query.dispose();
		});
	});

	return entries;
};
