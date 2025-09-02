import type { Persister } from "@crdt/persistence";

export type Entity = { $id: string } & Record<string, JSONValue>;
export type Operation = {
	eventstamp: string;
	entityId: string;
	path: string;
	value: JSONValue;
};
export type CRDTState = Operation[];

export type StoreOptions = {
	persister: Persister;
	collectionName: string;
};

export type Store<T> = {
	materialize: () => Promise<T[]>;
	mutate: (data: Partial<T> & { $id: string }) => Promise<boolean>;
	merge: (data: CRDTState) => Promise<boolean>;
	getState: () => Promise<CRDTState>;
};
