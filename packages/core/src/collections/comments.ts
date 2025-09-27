import { createCollection } from "@tanstack/react-db";
import { asyncLocalStorageCollectionOptions } from "../async-local-storage";
import { createFileSystemAdapter } from "../filesystem-adapter";
import { CommentSchema } from "../schemas";

export const commentsCollection = createCollection(
	asyncLocalStorageCollectionOptions({
		storageKey: "comments",
		storage: createFileSystemAdapter("collections"),
		getKey: (comment) => comment.id,
		schema: CommentSchema,
	}),
);
