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
	makeComment: (entryId: string, content: string): JournalEntryComment => {
		return JournalEntryCommentSchema.parse({ entryId, content });
	},
} as const;
