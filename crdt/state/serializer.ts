import { flatten, unflatten } from "flat";
import type { Entity, Operation } from "./types";

export const serialize = <T extends Entity>(
	eventstamp: string,
	entityId: string,
	data: Partial<T>,
): Operation[] => {
	const operations: Operation[] = [];
	const flattened: Record<string, JSONValue> = flatten(data);
	for (const [path, value] of Object.entries(flattened)) {
		operations.push({ eventstamp, entityId, path, value });
	}
	return operations;
};

export const deserialize = <T extends Entity>(data: Operation[]): T[] => {
	const entitiesById = data.reduce(
		(entities, { entityId, path, value }) => {
			const existingProps = entities[entityId] || {};
			return {
				...entities,
				[entityId]: {
					...existingProps,
					[path]: value,
				},
			};
		},
		{} as Record<string, Record<string, JSONValue>>,
	);

	return Object.entries(entitiesById).map(([entityId, props]) => ({
		...unflatten(props),
		$id: entityId,
	})) as T[];
};
