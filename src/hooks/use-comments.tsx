import { createEffect, createSignal, onCleanup } from "solid-js";
import { sortByCreatedAtDesc } from "@/utils/entries";
import { db } from "../database/db";
import type { Comment } from "../schemas/comment";

export const useEntryComments = (entryId: string) => {
	const [comments, setComments] = createSignal<Comment[]>([]);

	createEffect(() => {
		const query = db.query((tx) =>
			tx.comments.find((comment) => comment.entryId === entryId, {
				sort: sortByCreatedAtDesc,
			}),
		);

		setComments(query.result);

		query.subscribe((results) => {
			setComments(results);
		});

		onCleanup(() => query.dispose());
	});

	return comments;
};
