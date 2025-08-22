import { get, set } from "idb-keyval";
import * as mutator from "./mutator";
import { deserialize, serialize } from "./serializer";
import type { CRDTState, Entity, EntityId } from "./types";

export const createIdbPersister = <T extends Entity>(key: string) => {
	let init = false;
	let state: CRDTState = [];

	const loadData = async () => {
		const persisted = await get<CRDTState>(key);
		state = persisted || [];
		init = true;
		return state;
	};

	const persist = async () => {
		if (!init) return;
		await set(key, state);
	};

	const materialize = async (): Promise<Record<EntityId, T>> => {
		if (!init) await loadData();
		return state ? deserialize(state) : {};
	};

	const mutate = async <T extends Entity>(data: T): Promise<void> => {
		if (!init) await loadData();
		const operations = serialize(new Date().toISOString(), data.$id, data);
		const [newstate, changed] = mutator.set(state, operations);
		if (changed) {
			state = newstate;
			await persist();
		}
	};

	return { materialize, mutate };
};
