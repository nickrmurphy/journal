import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import z from "zod";
import { createIdbPersister, queryClient } from "./shared";

const entryCommentSchema = z.object({
	id: z
		.uuid()
		.optional()
		.default(() => crypto.randomUUID()),
	content: z.string().min(1),
	entryId: z.uuid(),
	createdAt: z.iso
		.datetime()
		.optional()
		.default(() => new Date().toISOString()),
});

export type EntryComment = z.infer<typeof entryCommentSchema>;

const entryCommentPersister = createIdbPersister<EntryComment>("entryComments");

export const entryCommentCollection = createCollection(
	queryCollectionOptions({
		queryKey: ["entryComments"],
		schema: entryCommentSchema,
		queryFn: async () => {
			const comments = await entryCommentPersister.getAll();
			return comments;
		},
		queryClient,
		getKey: (item) => item.id,
		onInsert: async ({ transaction }) => {
			const promises = transaction.mutations.map((mutation) => {
				if (mutation.type === "insert") {
					const val = entryCommentSchema.parse(mutation.changes);
					return entryCommentPersister.insert(val);
				}
			});
			await Promise.all(promises);
		},
		onUpdate: async ({ transaction }) => {
			const promises = transaction.mutations.map((mutation) => {
				if (mutation.type === "update") {
					return entryCommentPersister.update({
						id: mutation.key,
						...mutation.changes,
					});
				}
			});
			await Promise.all(promises);
		},
	}),
);
