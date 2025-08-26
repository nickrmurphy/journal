import { createNetworker } from "@crdt/network";
import { createIdbPersister } from "@crdt/persister";
import { createRepo } from "@crdt/repo";
import z from "zod";

export const entrySchema = z.object({
	$id: z
		.uuid()
		.optional()
		.default(() => crypto.randomUUID()),
	content: z.string().min(1),
	date: z.iso.date(),
	isBookmarked: z.boolean().optional().default(false),
	comments: z
		.object({
			id: z
				.uuid()
				.optional()
				.default(() => crypto.randomUUID()),
			content: z.string().min(1),
			createdAt: z.iso
				.datetime()
				.optional()
				.default(() => new Date().toISOString()),
		})
		.array()
		.optional()
		.default([]),
	createdAt: z.iso
		.datetime()
		.optional()
		.default(() => new Date().toISOString()),
});

export type Entry = z.infer<typeof entrySchema>;

export const networker = createNetworker(createIdbPersister("nodeId"));

export const entryRepo = createRepo<Entry>({
	persister: createIdbPersister("entries"),
	networker,
});
