import type { Comment } from "@/schemas/comment";
import type { Entry } from "@/schemas/entry";

type EntryWithComments = Entry & { comments: Comment[] };

/**
 * Combines entries with their associated comments.
 * Groups comments by entryId and attaches them to their respective entries.
 * Comments are sorted by createdAt descending (newest first).
 *
 * @param entries Array of entries
 * @param allComments Array of all comments
 * @returns Array of entries with their comments attached
 */
export const combineEntriesWithComments = (
	entries: Entry[],
	allComments: Comment[],
): EntryWithComments[] => {
	// Group comments by entryId
	const commentsByEntry = new Map<string, Comment[]>();
	for (const comment of allComments) {
		const existing = commentsByEntry.get(comment.entryId) || [];
		commentsByEntry.set(comment.entryId, [...existing, comment]);
	}

	// Combine entries with their sorted comments
	return entries.map((entry) => ({
		...entry,
		comments: commentsByEntry.get(entry.id) || [],
	}));
};
