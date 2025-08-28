import type { Persister } from "@crdt/persistence";

type JSONArray = JSONValue[];
type JSONObject = {
	[key: string]: JSONValue;
};
export type JSONValue =
	| string
	| number
	| boolean
	| null
	| JSONObject
	| JSONArray;
export type EntityId = string;
export type Entity = { $id: EntityId } & Record<string, JSONValue>;
export type Eventstamp = string;
export type Path = string;
export type Operation = [Eventstamp, EntityId, Path, JSONValue];
export type CRDTState = Operation[];

export type StoreOptions = {
	persister: Persister;
	collectionName: string;
};

export type Store<T> = {
	materialize: () => Promise<T[]>;
	mutate: (data: Partial<T> & { $id: EntityId }) => Promise<boolean>;
	merge: (data: CRDTState) => Promise<boolean>;
	getState: () => Promise<CRDTState>;
};
