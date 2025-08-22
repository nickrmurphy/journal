import { createIdbPersister } from "@crdt/persister";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import z from "zod";
import { queryClient } from "./shared";

const entrySchema = z.object({
	$id: z
		.uuid()
		.optional()
		.default(() => crypto.randomUUID()),
	content: z.string().min(1),
	date: z.iso.date(),
	isBookmarked: z.boolean().optional().default(false),
	createdAt: z.iso
		.datetime()
		.optional()
		.default(() => new Date().toISOString()),
});

export type Entry = z.infer<typeof entrySchema>;

const entryPersister = createIdbPersister<Entry>("entries");

export const entryCollection = createCollection(
	queryCollectionOptions({
		queryKey: ["entries"],
		schema: entrySchema,
		queryFn: async () => {
			const entries = await entryPersister.materialize();
			return entries;
		},
		queryClient,
		getKey: (item) => item.$id,
		onInsert: async ({ transaction }) => {
			const promises = transaction.mutations.map((mutation) => {
				if (mutation.type === "insert") {
					const val = entrySchema.parse(mutation.changes);
					return entryPersister.mutate(val);
				}
			});
			await Promise.all(promises);
		},
		onUpdate: async ({ transaction }) => {
			const promises = transaction.mutations.map((mutation) => {
				if (mutation.type === "update") {
					return entryPersister.mutate({
						$id: mutation.key,
						...mutation.changes,
					});
				}
			});
			await Promise.all(promises);
		},
	}),
);
