import { useEffect, useState } from "react";
import { sortByCreatedAtDesc } from "@/utils/entries";
import { db } from "../database/db";
import type { Comment } from "../schemas/comment";

export const useEntryComments = (entryId: string) => {
	const [comments, setComments] = useState<Comment[]>([]);

	useEffect(() => {
		const query = db.query((tx) =>
			tx.comments.find((comment) => comment.entryId === entryId, {
				sort: sortByCreatedAtDesc,
			}),
		);

		setComments(query.result);

		query.subscribe((results) => {
			setComments(results);
		});

		return () => query.dispose();
	}, [entryId]);

	return comments;
};
