import { createNetworker } from "@crdt/network";
import { createIdbPersister } from "@crdt/persister";
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

export const networker = createNetworker(createIdbPersister("nodeId"));

export const entryRepo = createRepo<Entry>({
	persister: createIdbPersister("entries"),
	networker,
});
