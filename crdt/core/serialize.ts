import { flatten, unflatten } from "flat";
import type { State } from "./types";

export const objectToState = <T extends Record<string, JSONValue>>(
	object: Partial<T>,
	getEventstamp: () => string,
): State => {
	const flattened: { [key: string]: JSONValue } = flatten(object);
	return Object.entries(flattened).map(([path, value]) => ({
		path,
		value,
		eventstamp: getEventstamp(),
	}));
};

export const objectFromState = <T extends Record<string, JSONValue>>(
	state: State,
): T => {
	const flattened = state.reduce(
		(acc, field) => {
			acc[field.path] = field.value;
			return acc;
		},
		{} as Record<string, JSONValue>,
	);
	return unflatten(flattened) as T;
};
