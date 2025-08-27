import { createNetworker } from "@crdt/networking";
import { createIdbPersister } from "@crdt/persistence";
import { createRepo } from "@crdt/repo";

export type Comment = {
	id: string;
	content: string;
	createdAt: string;
};

export type Entry = {
	$id: string;
	content: string;
	date: string;
	isBookmarked: boolean;
	comments: Comment[];
	createdAt: string;
};

export type CreateEntryInput = {
	content: string;
	date: string;
};

export const entry = (data: CreateEntryInput): Entry => ({
	...data,
	$id: crypto.randomUUID(),
	comments: [],
	createdAt: new Date().toISOString(),
	isBookmarked: false,
});

const persister = createIdbPersister({
	dbName: "journal",
});

export const networker = createNetworker(persister);

export const entryRepo = createRepo<Entry>({
	collectionName: "entries",
	persister,
	networker,
});
