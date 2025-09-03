import { objectFromState, objectToState, mergeState } from "@crdt/core";
import type { State } from "@crdt/core/types";

type Materializer<T> = () => T;
type StateAccessor = () => State;
type Mutator<T> = (data: Partial<T>) => boolean;

export type Store<T> = [Materializer<T>, Mutator<T>, StateAccessor];

export const createStore = <T extends Record<string, JSONValue>>(
	defaultState: State = [],
	eventstampProvider: () => string,
): Store<T> => {
	let state = defaultState;

	return [
		() => objectFromState<T>(state),
		(data: Partial<T>) => {
			const t = objectToState(data, eventstampProvider);
			const [next, changed] = mergeState(state, t);
			if (changed) {
				state = next;
			}
			return changed;
		},
		() => state,
	];
};
