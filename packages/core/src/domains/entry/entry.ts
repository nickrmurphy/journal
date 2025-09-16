import {
	JournalEntryCommentSchema,
	JournalEntrySchema,
} from "../../schemas/journal.js";
import type {
	CreateJournalEntry,
	JournalEntry,
	JournalEntryComment,
} from "../../types/index.js";

export const Entry = {
	/**
	 * Create a new journal entry with validation
	 */
	make: (data: CreateJournalEntry): JournalEntry => {
		return JournalEntrySchema.parse(data);
	},

	/**
	 * Create a new comment with validation
	 */
	makeComment: (content: string): JournalEntryComment => {
		return JournalEntryCommentSchema.parse({ content });
	},

	/**
	 * Add a comment to an entry (returns new entry)
	 */
	addComment: (
		entry: JournalEntry,
		comment: JournalEntryComment,
	): JournalEntry => {
		return {
			...entry,
			comments: [...entry.comments, comment],
		};
	},
} as const;
