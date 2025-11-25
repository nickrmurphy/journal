import { useEffect, useState } from "react";
import { db } from "../database/db";
import type { Comment } from "../schemas/comment";

export const useEntryComments = (entryId: string) => {
	const [comments, setComments] = useState<Comment[]>([]);

	useEffect(() => {
		const loadComments = () => {
			const filtered = db.comments.find(
				(comment) => comment.entryId === entryId,
			);
			filtered.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			);
			setComments(filtered);
		};

		loadComments();

		const unsubscribe = db.on("mutation", (mutation) => {
			if (mutation.collection === "comments") {
				loadComments();
			}
		});

		return () => unsubscribe();
	}, [entryId]);

	return comments;
};
