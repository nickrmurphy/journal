import { isSameDay } from "date-fns";
import { createEffect, createSignal, onCleanup } from "solid-js";
import { db } from "../database/db";
import type { Comment } from "../schemas/comment";
import type { Entry } from "../schemas/entry";

type EntryWithComments = Entry & { comments: Comment[] };

/**
 * Base hook for fetching entries with their comments
 * @param filter Optional filter function to apply to entries
 */
const useEntriesBase = (filter?: () => (entry: Entry) => boolean) => {
	const [entries, setEntries] = createSignal<EntryWithComments[]>([]);

	createEffect(() => {
		const loadEntries = () => {
			let allEntries = db.entries.getAll();
			const allComments = db.comments.getAll();

			// Apply filter if provided
			const filterFn = filter?.();
			if (filterFn) {
				allEntries = allEntries.filter(filterFn);
			}

			// Group comments by entryId
			const commentsByEntry = new Map<string, Comment[]>();
			for (const comment of allComments) {
				const existing = commentsByEntry.get(comment.entryId) || [];
				commentsByEntry.set(comment.entryId, [...existing, comment]);
			}

			// Combine entries with their comments and sort comments
			const combined = allEntries.map((entry) => ({
				...entry,
				comments: (commentsByEntry.get(entry.id) || []).sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
				),
			}));

			// Sort entries by createdAt descending
			combined.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			);

			setEntries(combined);
		};

		loadEntries();

		const unsubscribe = db.on("mutation", (mutation) => {
			if (
				mutation.collection === "entries" ||
				mutation.collection === "comments"
			) {
				loadEntries();
			}
		});

		onCleanup(() => unsubscribe());
	});

	return entries;
};

/**
 * Hook to fetch all entries with their comments
 */
export const useEntries = () => {
	return useEntriesBase();
};

/**
 * Hook to fetch entries for a specific date with their comments
 * @param date ISO date string to filter entries by
 */
export const useEntriesOnDate = (date: () => string) => {
	return useEntriesBase(() => {
		const targetDate = new Date(date());
		return (entry) => isSameDay(new Date(entry.createdAt), targetDate);
	});
};
