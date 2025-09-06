import { createSystemClock } from "@journal/crdt/clock";
import { createWebRTCAdapter } from "@journal/crdt/network";
import { createIdbPersister } from "@journal/crdt/persistence/web";
import {
	createStore,
	withNetworking,
	withPersistence,
} from "@journal/crdt/store";
import { chain } from "@journal/fn";

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

export const networkProvider = createWebRTCAdapter(getDeviceId());

export const entryStore = chain()
	.pipe(() =>
		createStore<Record<string, Entry>>({
			clockProvider: createSystemClock(),
		}),
	)
	.pipe((store) =>
		withNetworking(store, {
			networkProvider,
		}),
	)
	.pipe((store) =>
		withPersistence(store, {
			key: "entries",
			persistenceProvider: persister,
		}),
	)
	.get();
