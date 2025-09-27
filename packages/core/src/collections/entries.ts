import { createCollection, Query } from "@tanstack/react-db";
import { isSameDay } from "date-fns";
import { createFileSystemAdapter } from "../filesystem-adapter";
import { mergableCollectionOptions } from "../mergable-storage";
import { EntrySchema } from "../schemas";

export const entriesCollection = createCollection(
	mergableCollectionOptions({
		storageKey: "entries",
		storage: createFileSystemAdapter("collections"),
		getKey: (entry) => entry.id,
		schema: EntrySchema,
	}),
);

export const entriesQuery = new Query().from({
	entries: entriesCollection,
});

export const entriesOnDateQuery = (date: string) =>
	entriesQuery.fn
		.where((row) => isSameDay(row.entries.createdAt, date))
		.orderBy(({ entries }) => entries.createdAt, "desc");
