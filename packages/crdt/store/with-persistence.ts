import type { State } from "../core/types";
import type { Store } from "../store";

export type PersistentStore<T> = Store<T> & {
	load: () => Promise<void>;
};

export type PersistenceProvider = {
	get: <T>(key: string) => Promise<T | null>;
	set: <T>(key: string, data: T) => Promise<void>;
};

export const withPersistence = <T>(
	store: Store<T>,
	{
		key,
		persistenceProvider,
	}: {
		key: string;
		persistenceProvider: PersistenceProvider;
	},
): PersistentStore<T> => {
	const persist = async () => {
		const state = store.getState();
		await persistenceProvider.set(key, state);
	};

	const load = async () => {
		const state = await persistenceProvider.get<State>(key);
		if (state) {
			store.mergeState(state, true);
		}
	};

	store.on("mutate", () => {
		persist();
	});

	return { ...store, load };
};
