import { useLiveQuery } from "@tanstack/react-db";
import { useCollections } from "../collections";

export function useEntryComments(entryId: string) {
	const { commentsCollection } = useCollections();
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
