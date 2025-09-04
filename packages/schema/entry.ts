import { z } from "zod";

export const entrySchema = z.object({
	_id: z.uuid().default(() => crypto.randomUUID()),
	content: z.string().min(1),
	createdAt: z.iso.datetime().default(() => new Date().toISOString()),
	// biome-ignore lint/style/noNonNullAssertion: split of toISOString always returns at least one element
	date: z.iso.date().default(() => new Date().toISOString().split("T")[0]!),
	isBookmarked: z.boolean().default(false),
	comments: z
		.array(
			z.object({
				_id: z.uuid().default(() => crypto.randomUUID()),
				content: z.string().min(1),
				createdAt: z.iso.datetime().default(() => new Date().toISOString()),
			}),
		)
		.default([]),
});

export type Entry = z.infer<typeof entrySchema>;
export type NewEntry = z.input<typeof entrySchema>;
export type PartialEntry = Partial<Entry>;
