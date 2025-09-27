import { mergableCollectionOptions } from "@journal/utils/collection-options";
import { createFileSystemAdapter } from "@journal/utils/storage-adapters";
import { createCollection } from "@tanstack/react-db";
import { CommentSchema } from "../schemas";

export const commentsCollection = createCollection(
	mergableCollectionOptions({
		storageKey: "comments",
		storage: createFileSystemAdapter("collections"),
		getKey: (comment) => comment.id,
		schema: CommentSchema,
	}),
);
