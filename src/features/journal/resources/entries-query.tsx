import { isSameDay } from "date-fns";
import { createQuery } from "@/lib/primitives/query";
import {
	combineEntriesWithComments,
	sortByCreatedAtDesc,
} from "@/lib/utils/entries";

/**
 * Hook to fetch entries with their comments.
 * Uses reactive query pattern - automatically updates when entries or comments change.
 * @param date Optional ISO date string to filter entries by. If omitted, returns all entries.
 */
export const createEntriesQuery = (date?: string) => {
	const entries = createQuery((tx) => {
		const entries = tx.entries.find(
			(entry) =>
				date ? isSameDay(new Date(entry.createdAt), new Date(date)) : true,
			{ sort: sortByCreatedAtDesc },
		);
		const allComments = tx.comments.getAll().sort(sortByCreatedAtDesc);
		return combineEntriesWithComments(entries, allComments);
	}, []);

	return entries;
};
