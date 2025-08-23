import { createIdbPersister } from "@crdt/persister";
import { createRepo } from "@crdt/repo";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import z from "zod";
import { queryClient } from "./shared";

const entryCommentSchema = z.object({
	$id: z
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

const entryCommentRepo = createRepo<EntryComment>(
	createIdbPersister("entryComments"),
);

export const entryCommentCollection = createCollection(
	queryCollectionOptions({
		queryKey: ["entryComments"],
		schema: entryCommentSchema,
		queryFn: async () => {
			const data = await entryCommentRepo.materialize();
			return data;
		},
		queryClient,
		getKey: (item) => item.$id,
		onInsert: async ({ transaction }) => {
			const promises = transaction.mutations.map((mutation) => {
				if (mutation.type === "insert") {
					const val = entryCommentSchema.parse(mutation.changes);
					return entryCommentRepo.mutate(val);
				}
			});
			await Promise.all(promises);
		},
		onUpdate: async ({ transaction }) => {
			const promises = transaction.mutations.map((mutation) => {
				if (mutation.type === "update") {
					return entryCommentRepo.mutate({
						$id: mutation.key,
						...mutation.changes,
					});
				}
			});
			await Promise.all(promises);
		},
	}),
);
