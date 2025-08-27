import * as mutator from "./mutator";
import type { Networker } from "./network";
import type { Persister } from "./persistence";
import { deserialize, serialize } from "./serializer";
import type { CRDTState, Entity, EntityId } from "./types";

export const createRepo = <T extends Entity>({
	collectionName,
	persister,
	networker,
}: {
	collectionName: string;
	persister: Persister;
	networker: Networker;
}) => {
	let state: CRDTState = [];

	const listeners = new Set<() => void>();

	const persist = () => {
		return persister.set(collectionName, state);
	};

	const setState = (newState: CRDTState, broadcast = true) => {
		state = newState;
		if (broadcast) {
			networker.sendState(state);
		}
		persist().then(() => {
			for (const listener of listeners) {
				listener();
			}
		});
	};

	const initialize = async () => {
		const persisted = await persister.get<CRDTState>(collectionName);
		state = persisted || [];
		networker.sendState(state);
		networker.onPushMessage((newState) => {
			const [mergedState, changed] = mutator.set(state, newState);
			if (changed) {
				setState(mergedState, false);
			}
		});
		networker.onPullMessage(() => state);
	};

	const materialize = async (): Promise<T[]> => {
		return deserialize(state);
	};

	const mutate = async (
		data: Partial<T> & { $id: EntityId },
	): Promise<void> => {
		const operations = serialize(new Date().toISOString(), data.$id, data);
		const [newstate, changed] = mutator.set(state, operations);

		if (changed) {
			setState(newstate, true);
		}
	};

	const listen = (fn: (id?: EntityId) => void) => {
		listeners.add(fn);
		return () => {
			listeners.delete(fn);
		};
	};

	return { materialize, mutate, listen, initialize };
};
