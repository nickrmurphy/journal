import type { z } from "zod";
import type {
	CreateJournalEntrySchema,
	JournalEntrySchema,
	UpdateJournalEntrySchema,
} from "../schemas/index.js";

// Infer TypeScript types from Zod schemas
export type JournalEntry = z.infer<typeof JournalEntrySchema>;
export type CreateJournalEntry = z.infer<typeof CreateJournalEntrySchema>;
export type UpdateJournalEntry = z.infer<typeof UpdateJournalEntrySchema>;
