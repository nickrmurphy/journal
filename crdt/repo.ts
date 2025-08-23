import * as mutator from "./mutator";
import type { Persister } from "./persister";
import { deserialize, serialize } from "./serializer";
import type { CRDTState, Entity, EntityId } from "./types";

export const createRepo = <T extends Entity>(persister: Persister) => {
	let init = false;
	let state: CRDTState = [];
	const listeners = new Set<(entityId: EntityId) => void>();

	const persist = () => {
		return persister.set(state);
	};

	const initialize = async () => {
		if (init) return;
		const persisted = await persister.get();
		state = persisted || [];
		init = true;
	};

	const materialize = async (): Promise<T[]> => {
		if (!init) await initialize();
		return state ? deserialize(state) : [];
	};

	const mutate = async <T extends Entity>(data: T): Promise<void> => {
		if (!init) await initialize();
		const operations = serialize(new Date().toISOString(), data.$id, data);
		const [newstate, changed] = mutator.set(state, operations);
		if (changed) {
			state = newstate;
			persist().then(() => {
				for (const listener of listeners) {
					listener(data.$id);
				}
			});
		}
	};

	const listen = (fn: (id?: EntityId) => void) => {
		listeners.add(fn);

		return () => {
			listeners.delete(fn);
		};
	};

	return { materialize, mutate, listen };
};
