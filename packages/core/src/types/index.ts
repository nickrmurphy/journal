import type { z } from "zod";
import type {
	CreateJournalEntrySchema,
	JournalEntryCommentSchema,
	JournalEntrySchema,
	UpdateJournalEntrySchema,
} from "../schemas/index.js";

// Infer TypeScript types from Zod schemas
export type JournalEntry = z.infer<typeof JournalEntrySchema>;
export type JournalEntryComment = z.infer<typeof JournalEntryCommentSchema>;
export type CreateJournalEntry = z.infer<typeof CreateJournalEntrySchema>;
export type UpdateJournalEntry = z.infer<typeof UpdateJournalEntrySchema>;
