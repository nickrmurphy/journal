import type { Networker } from "../networking";
import type { Persister } from "../persistence";
import type { Entity, EntityId } from "../state";
import { createStore } from "../state";

export const createRepo = <T extends Entity>({
	collectionName,
	persister,
	networker,
}: {
	collectionName: string;
	persister: Persister;
	networker: Networker;
}) => {
	const store = createStore<T>({ collectionName, persister });
	const listeners = new Set<() => void>();

	const notify = async () => {
		const state = await store.getState();
		networker.sendState(state);
		for (const listener of listeners) {
			listener();
		}
	};

	const initialize = async () => {
		const state = await store.getState();
		networker.sendState(state);
		networker.onPushMessage(async (newState) => {
			await store.merge(newState);
		});
		networker.onPullMessage(() => state);
	};

	const mutate = async (
		data: Partial<T> & { $id: EntityId },
	): Promise<void> => {
		const changed = await store.mutate(data);
		if (changed) {
			notify();
		}
	};

	const listen = (fn: (id?: EntityId) => void) => {
		listeners.add(fn);
		return () => {
			listeners.delete(fn);
		};
	};

	return { materialize: store.materialize, mutate, listen, initialize };
};
