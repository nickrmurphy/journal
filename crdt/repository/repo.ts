import type { ClockProvider, State } from "@crdt/core/types";
import type { PersistenceProvider } from "@crdt/persistence/types";
import { createStore } from "../store";

type EventListener = () => void;

type ProviderOptions = {
	clockProvider: ClockProvider;
	persistenceProvider: PersistenceProvider;
};

type Repository<T> = {
	get: () => Promise<T | null>;
	set: (data: Partial<T>) => Promise<boolean>;
	on: (event: "mutate", listener: EventListener) => () => void;
};

export const createRepository = <T extends JSONValue>(
	key: string,
	{ clockProvider, persistenceProvider }: ProviderOptions,
): Repository<T> => {
	const listeners = new Set<EventListener>();
	const storePromise = (async () => {
		const defaultState = await persistenceProvider.get<State>(key);
		const store = createStore<T>({
			defaultState: defaultState || [],
			clockProvider,
		});
		return store;
	})();

	const maybeMutate = async (data: Partial<T>) => {
		const store = await storePromise;
		const mutated = store.set(data);
		if (mutated) {
			const persist = persistenceProvider.set(key, store.getState());
			for (const listener of listeners) {
				listener();
			}
			await persist;
		}
		return mutated;
	};

	return {
		get: async () => {
			const store = await storePromise;
			return store.get();
		},
		set: async (data: Partial<T>) => {
			return maybeMutate(data);
		},
		on: (event: "mutate", listener: EventListener) => {
			if (event === "mutate") {
				listeners.add(listener);
			}

			return () => {
				listeners.delete(listener);
			};
		},
	};
};
