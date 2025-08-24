import { createIdbPersister } from "@crdt/persister";
import { createRepo } from "@crdt/repo";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import z from "zod";
import { queryClient } from "./shared";

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

const entryRepo = createRepo<Entry>(createIdbPersister("entries"));

export const entryCollection = createCollection(
	queryCollectionOptions({
		queryKey: ["entries"],
		schema: entrySchema,
		queryFn: async () => {
			const entries = await entryRepo.materialize();
			return entries;
		},
		queryClient,
		getKey: (item) => item.$id,
		onInsert: async ({ transaction }) => {
			const promises = transaction.mutations.map((mutation) => {
				if (mutation.type === "insert") {
					const val = entrySchema.parse(mutation.changes);
					return entryRepo.mutate(val);
				}
			});
			await Promise.all(promises);
		},
		onUpdate: async ({ transaction }) => {
			const promises = transaction.mutations.map((mutation) => {
				if (mutation.type === "update") {
					return entryRepo.mutate({
						$id: mutation.key,
						...mutation.changes,
					});
				}
			});
			await Promise.all(promises);
		},
	}),
);
