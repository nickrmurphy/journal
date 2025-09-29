import { mergableCollectionOptions } from "@journal/utils/collection-options";
import type { AsyncStorageApi } from "@journal/utils/storage-adapters";
import { createCollection } from "@tanstack/react-db";
import { CommentSchema } from "../schemas";

export const createCommentsCollection = (storageAdapter: AsyncStorageApi) =>
	createCollection(
		mergableCollectionOptions({
			storageKey: "comments",
			storage: storageAdapter,
			getKey: (comment) => comment.id,
			schema: CommentSchema,
		}),
	);
