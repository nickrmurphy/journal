import { eq, Query, useLiveQuery } from "@tanstack/react-db";
import { isSameDay } from "date-fns";
import { useMemo } from "react";
import {
	type createCommentsCollection,
	type createEntriesCollection,
	useCollections,
} from "../collections";
import type { Comment, Entry } from "../schemas";

type JoinedRow = {
	entries: Entry;
	comments: Comment | undefined;
};

type EntryWithComments = Entry & {
	comments: Comment[];
};

function groupEntriesWithComments(data: JoinedRow[]): EntryWithComments[] {
	if (!data) return [];

	const entryMap = new Map<string, EntryWithComments>();

	data.forEach((row) => {
		const entryId = row.entries.id;

		if (!entryMap.has(entryId)) {
			entryMap.set(entryId, {
				...row.entries,
				comments: [],
			});
		}

		if (row.comments) {
			const entry = entryMap.get(entryId);
			if (entry) {
				entry.comments.push(row.comments);
			}
		}
	});

	return Array.from(entryMap.values());
}

const dataQuery = ({
	entriesCollection,
	commentsCollection,
}: {
	entriesCollection: ReturnType<typeof createEntriesCollection>;
	commentsCollection: ReturnType<typeof createCommentsCollection>;
}) =>
	new Query()
		.from({
			entries: entriesCollection,
		})
		.join({ comments: commentsCollection }, ({ entries, comments }) =>
			eq(entries.id, comments.entryId),
		)
		.orderBy(({ entries }) => entries.createdAt, "desc");

export function useEntries() {
	const collections = useCollections();
	const { data, ...rest } = useLiveQuery({
		query: dataQuery(collections),
	});

	const groupedData = useMemo(() => {
		return groupEntriesWithComments(data);
	}, [data]);

	return { data: groupedData, ...rest };
}

export function useEntriesOnDate(date: string) {
	const collections = useCollections();
	const { data, ...rest } = useLiveQuery({
		query: dataQuery(collections).fn.where(({ entries }) =>
			isSameDay(entries.createdAt, date),
		),
	});

	const groupedData = useMemo(() => {
		return groupEntriesWithComments(data);
	}, [data]);

	return { data: groupedData, ...rest };
}
