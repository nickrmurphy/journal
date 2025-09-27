import { createCollection } from "@tanstack/react-db";
import { createFileSystemAdapter } from "../filesystem-adapter";
import { mergableCollectionOptions } from "../mergable-storage";
import { CommentSchema } from "../schemas";

export const commentsCollection = createCollection(
	mergableCollectionOptions({
		storageKey: "comments",
		storage: createFileSystemAdapter("collections"),
		getKey: (comment) => comment.id,
		schema: CommentSchema,
	}),
);
