import { entitiesFromState, entityToState, mergeState } from "@crdt/core";
import type { Entity, State } from "@crdt/core/types";

type Materializer<T> = () => T[];
type StateAccessor = () => State;
type Mutator<T> = (data: Partial<T>) => boolean;

export type Store<T> = [Materializer<T>, Mutator<T>, StateAccessor];

export const createStore = <T extends Entity>(
	defaultState: State = [],
	eventstampProvider: () => string,
): Store<T> => {
	let state = defaultState;

	return [
		() => entitiesFromState<T>(state),
		(data: Partial<T>) => {
			const t = entityToState(data, eventstampProvider);
			const [next, changed] = mergeState(state, t);
			if (changed) {
				state = next;
			}
			return changed;
		},
		() => state,
	];
};
