import { Query, useLiveQuery } from "@tanstack/react-db";
import { commentsCollection } from "../collections/comments";

export const commentsQuery = new Query().from({
	comments: commentsCollection,
});

export function useEntryComments(entryId: string) {
	return useLiveQuery(
		(q) =>
			q
				.from({
					comments: commentsCollection,
				})
				.fn.where(({ comments }) => comments.entryId === entryId)
				.orderBy(({ comments }) => comments.createdAt, "desc"),
		[entryId],
	);
}
