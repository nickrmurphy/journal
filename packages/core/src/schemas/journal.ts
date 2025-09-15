import { z } from "zod";

export const JournalEntrySchema = z.object({
	id: z.string().uuid(),
	userId: z.string().uuid(),
	title: z.string().min(1).max(200),
	content: z.string(),
	mood: z.enum(["happy", "sad", "neutral", "excited", "anxious"]).optional(),
	tags: z.array(z.string()).default([]),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const CreateJournalEntrySchema = JournalEntrySchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const UpdateJournalEntrySchema = JournalEntrySchema.partial().omit({
	id: true,
	userId: true,
	createdAt: true,
	updatedAt: true,
});
