// import { createPeerJsNetworker } from "@crdt/networking";
import { createIdbPersister } from "@crdt/persistence";
import { createRepository } from "@crdt/repo";

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

export const getDeviceId = () => {
	const current = localStorage.getItem("deviceId");
	if (current) {
		return current;
	}
	const newId = crypto.randomUUID();
	localStorage.setItem("deviceId", newId);
	return newId;
};

const persister = createIdbPersister({
	dbName: "journal",
});

const STORAGE_KEY = "connections";

export const entryRepo = createRepository<Entry>({
	collectionName: "entries",
	persister,
	deviceId: getDeviceId(),
	defaultConnections: JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"),
});
