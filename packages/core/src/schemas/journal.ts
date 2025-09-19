import { z } from "zod";

export const JournalEntryCommentSchema = z.object({
	id: z.uuid().default(() => crypto.randomUUID()),
	entryId: z.uuid(),
	content: z.string(),
	createdAt: z.iso.datetime().default(() => new Date().toISOString()),
});

export const JournalEntrySchema = z.object({
	id: z.uuid().default(() => crypto.randomUUID()),
	content: z.string(),
	createdAt: z.iso.datetime().default(() => new Date().toISOString()),
});

export const CreateJournalEntrySchema = JournalEntrySchema.omit({
	id: true,
	createdAt: true,
});

export const UpdateJournalEntrySchema = JournalEntrySchema.partial().omit({
	id: true,
	createdAt: true,
});
