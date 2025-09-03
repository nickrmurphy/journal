import { flatten, unflatten } from "flat";
import type { ClockProvider, State } from "./types";

export const objectToState = <T extends JSONValue>(
	object: Partial<T>,
	clockProvider: ClockProvider,
): State => {
	const flattened: { [key: string]: JSONValue } = flatten(object);
	return Object.entries(flattened).map(([path, value]) => ({
		path,
		value,
		eventstamp: clockProvider.tick(),
	}));
};

export const objectFromState = <T extends JSONValue>(
	state: State,
): T | null => {
	if (state.length === 0) {
		return null;
	}
	const flattened = state.reduce(
		(acc, field) => {
			acc[field.path] = field.value;
			return acc;
		},
		{} as Record<string, JSONValue>,
	);
	return unflatten(flattened) as T;
};
