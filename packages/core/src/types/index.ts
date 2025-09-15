import type { z } from "zod";
import type {
	CreateJournalEntrySchema,
	CreateUserSchema,
	JournalEntrySchema,
	UpdateJournalEntrySchema,
	UpdateUserSchema,
	UserSchema,
} from "../schemas/index.js";

// Infer TypeScript types from Zod schemas
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export type JournalEntry = z.infer<typeof JournalEntrySchema>;
export type CreateJournalEntry = z.infer<typeof CreateJournalEntrySchema>;
export type UpdateJournalEntry = z.infer<typeof UpdateJournalEntrySchema>;
