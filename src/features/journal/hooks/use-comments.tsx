import { createEffect, createSignal, onCleanup } from "solid-js";
import type { Comment } from "@/lib/db";
import { db } from "@/lib/db";
import { sortByCreatedAtDesc } from "@/lib/utils/entries";

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
