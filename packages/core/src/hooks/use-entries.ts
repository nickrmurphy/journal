import { isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import { db } from "../database/db";
import type { Comment } from "../schemas/comment";
import type { Entry } from "../schemas/entry";

export type EntryWithComments = Entry & { comments: Comment[] };

export const useEntries = () => {
	const [entries, setEntries] = useState<EntryWithComments[]>([]);

	useEffect(() => {
		const loadEntries = () => {
			const allEntries = db.entries.getAll();
			const allComments = db.comments.getAll();

			// Group comments by entryId
			const commentsByEntry = new Map<string, Comment[]>();
			for (const comment of allComments) {
				const existing = commentsByEntry.get(comment.entryId) || [];
				commentsByEntry.set(comment.entryId, [...existing, comment]);
			}

			// Combine entries with their comments
			const combined = allEntries.map((entry) => ({
				...entry,
				comments: (commentsByEntry.get(entry.id) || []).sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
				),
			}));

			// Sort entries by createdAt descending
			combined.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			);

			setEntries(combined);
		};

		loadEntries();

		const unsubscribe = db.on("mutation", (mutation) => {
			if (
				mutation.collection === "entries" ||
				mutation.collection === "comments"
			) {
				loadEntries();
			}
		});

		return () => unsubscribe();
	}, []);

	return entries;
};

export const useEntriesOnDate = (date: string) => {
	const [entries, setEntries] = useState<EntryWithComments[]>([]);

	useEffect(() => {
		const loadEntries = () => {
			const allEntries = db.entries.getAll();
			const allComments = db.comments.getAll();

			// Filter entries by date using date-fns
			const targetDate = new Date(date);
			const filtered = allEntries.filter((entry) => {
				return isSameDay(new Date(entry.createdAt), targetDate);
			});

			// Group comments
			const commentsByEntry = new Map<string, Comment[]>();
			for (const comment of allComments) {
				const existing = commentsByEntry.get(comment.entryId) || [];
				commentsByEntry.set(comment.entryId, [...existing, comment]);
			}

			// Combine
			const combined = filtered.map((entry) => ({
				...entry,
				comments: (commentsByEntry.get(entry.id) || []).sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
				),
			}));

			combined.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			);

			setEntries(combined);
		};

		loadEntries();

		const unsubscribe = db.on("mutation", (mutation) => {
			if (
				mutation.collection === "entries" ||
				mutation.collection === "comments"
			) {
				loadEntries();
			}
		});

		return () => unsubscribe();
	}, [date]);

	return entries;
};
