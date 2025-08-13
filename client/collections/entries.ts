import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import z from "zod";
import { createIdbPersister, queryClient } from "./shared";

const entrySchema = z.object({
	id: z
		.uuid()
		.optional()
		.default(() => crypto.randomUUID()),
	content: z.string().min(1),
	date: z.iso.date(),
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
			const entries = await entryPersister.getAll();
			entries.forEach((entry) => {
				if (!entry.date) {
					entry.date = new Date(entry.createdAt).toISOString().split("T")[0];
				}
			});
			return entries;
		},
		queryClient,
		getKey: (item) => item.id,
		onInsert: async ({ transaction }) => {
			const promises = transaction.mutations.map((mutation) => {
				if (mutation.type === "insert") {
					const val = entrySchema.parse(mutation.changes);
					return entryPersister.insert(val);
				}
			});
			await Promise.all(promises);
		},
		onUpdate: async ({ transaction }) => {
			const promises = transaction.mutations.map((mutation) => {
				if (mutation.type === "update") {
					return entryPersister.update({
						id: mutation.key,
						...mutation.changes,
					});
				}
			});
			await Promise.all(promises);
		},
	}),
);
