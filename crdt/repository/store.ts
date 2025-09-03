import { mergeState, objectFromState, objectToState } from "@crdt/core";
import type { ClockProvider, State } from "@crdt/core/types";

type Materializer<T> = () => T | null;
type StateAccessor = () => State;
type Mutator<T> = (data: Partial<T>) => boolean;
type EventListener = () => void;

export type Store<T> = {
	get: Materializer<T>;
	set: Mutator<T>;
	getState: StateAccessor;
	on: (event: "mutate", listener: EventListener) => () => void;
};

export const createStore = <T extends JSONValue>(
	defaultState: State = [],
	clockProvider: ClockProvider,
): Store<T> => {
	let state = defaultState;
	const listeners = new Set<EventListener>();

	return {
		get: () => objectFromState<T>(state),
		set: (data: Partial<T>) => {
			const t = objectToState(data, clockProvider);
			const [next, changed] = mergeState(state, t);
			if (changed) {
				state = next;
			}
			return changed;
		},
		getState: () => state,
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
