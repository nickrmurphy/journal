import type { Accessor } from "solid-js";
import { createQuery } from "@/lib/primitives/query";
import { sortByCreatedAtDesc } from "@/lib/utils/entries";

export const createCommentQuery = (entryId: Accessor<string>) => {
	const comments = createQuery(
		(tx) =>
			tx.comments.find((comment) => comment.entryId === entryId(), {
				sort: sortByCreatedAtDesc,
			}),
		[],
	);

	return comments;
};
