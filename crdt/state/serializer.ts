import { flatten, unflatten } from "flat";
import type {
	Entity,
	EntityId,
	Eventstamp,
	JSONValue,
	Operation,
} from "../types";

export const serialize = <T extends Entity>(
	eventstamp: Eventstamp,
	entityId: EntityId,
	data: Partial<T>,
): Operation[] => {
	const operations: Operation[] = [];
	const flattened: Record<string, JSONValue> = flatten(data);
	for (const [path, value] of Object.entries(flattened)) {
		operations.push([eventstamp, entityId, path, value]);
	}
	return operations;
};

export const deserialize = <T extends Entity>(data: Operation[]): T[] => {
	const map = new Map<EntityId, Partial<T>>();
	for (const [, entityId, path, value] of data) {
		if (!map.has(entityId)) {
			map.set(entityId, {});
		}
		// biome-ignore lint/style/noNonNullAssertion: <checked above>
		(map.get(entityId)! as Record<string, JSONValue>)[path] = value;
	}

	const entities: T[] = [];
	for (const [entityId, props] of map) {
		entities.push({ ...unflatten(props), $id: entityId } as T);
	}
	return entities;
};
