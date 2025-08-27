import { set } from "./mutator";
import { deserialize, serialize } from "./serializer";
import type { CRDTState, Entity, Store, StoreOptions } from "./types";

export const createStore = <T extends Entity>({
	collectionName,
	persister,
}: StoreOptions): Store<T> => {
	const load = async () => {
		const loadedState = await persister.get<CRDTState>(collectionName);
		return loadedState || [];
	};

	const persist = async (state: CRDTState) => {
		return persister.set(collectionName, state);
	};

	return {
		materialize: async () => {
			const state = await load();
			return state ? deserialize(state) : [];
		},
		mutate: async (data) => {
			const state = await load();
			const operations = serialize(new Date().toISOString(), data.$id, data);
			const [newstate, changed] = set(state, operations);
			if (changed) {
				await persist(newstate);
			}
			return changed;
		},
		merge: async (data) => {
			const state = await load();
			const [mergedState, changed] = set(state, data);
			if (changed) {
				await persist(mergedState);
			}
			return changed;
		},
		getState: () => load(),
	};
};
