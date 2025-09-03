import { createSystemClock } from "@crdt/clock/system";
import { createIdbPersister } from "@crdt/persistence/idb-persister";
import { createRepository } from "@crdt/repository/repo";

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

export const persister = createIdbPersister({
	dbName: "journal",
});

export const entryRepository = createRepository<Record<string, Entry>>(
	"entries",
	{
		clockProvider: createSystemClock(),
		persistenceProvider: persister,
	},
);
