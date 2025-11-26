import { createEffect, createSignal, onCleanup } from "solid-js";
import { db } from "../database/db";
import type { Comment } from "../schemas/comment";

export const useEntryComments = (entryId: () => string) => {
	const [comments, setComments] = createSignal<Comment[]>([]);

	createEffect(() => {
		const id = entryId();

		const loadComments = () => {
			const filtered = db.comments.find(
				(comment) => comment.entryId === id,
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

		onCleanup(() => unsubscribe());
	});

	return comments;
};
