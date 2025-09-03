import type { Entity, Field } from "./types";

export const makeEntity = (
	id: string,
	data: { [key: string]: JSONValue },
): Entity => ({
	...data,
	$id: id,
});

export const makeField = (
	entityId: string,
	keyVal: [path: string, value: JSONValue],
	getEventstamp: () => string,
): Field => ({
	entityId,
	eventstamp: getEventstamp(),
	path: keyVal[0],
	value: keyVal[1],
});
