import {
	type DematerializedObject,
	dematerialize,
	type MaterializedObject,
	materialize,
	merge,
} from "./operations";

type MergableStore<T extends MaterializedObject> = {
	set: (data: T) => void;
	remove: (id: string) => boolean;
	getDematierialized: () => Map<string, DematerializedObject>;
	getMaterialized: () => T[];
	mergeState: (data: DematerializedObject[]) => void;
};

export const MergableStore = <
	T extends MaterializedObject,
>(): MergableStore<T> => {
	const state = new Map<string, DematerializedObject>();

	const setOrMerge = (data: DematerializedObject) => {
		const existing = state.get(data.__id);
		if (existing) {
			const merged = merge(existing, data);
			state.set(data.__id, merged);
		} else {
			state.set(data.__id, data);
		}
	};

	const set = (data: T) => {
		const dematerialized = dematerialize(data);
		setOrMerge(dematerialized);
	};

	const remove = (id: string) => {
		if (!state.has(id)) return false;
		state.delete(id);
		return true;
	};

	const getDematierialized = () => {
		return state;
	};

	const getMaterialized = () => {
		return Array.from(state.values()).map((data) => materialize(data) as T);
	};

	const mergeState = (data: Array<DematerializedObject>) => {
		for (const item of data) {
			setOrMerge(item);
		}
	};

	return {
		set,
		remove,
		getDematierialized,
		getMaterialized,
		mergeState,
	};
};
