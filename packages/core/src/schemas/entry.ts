import { z } from "zod";

export const EntrySchema = z.object({
	id: z.uuid().default(() => crypto.randomUUID()),
	content: z.string(),
	createdAt: z.iso.datetime().default(() => new Date().toISOString()),
});

export type Entry = z.infer<typeof EntrySchema>;
export type NewEntry = z.input<typeof EntrySchema>;
