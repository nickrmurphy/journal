import { flatten, unflatten } from "flat";
import { makeEntity, makeField } from "./shared";
import type { Entity, State } from "./types";

export const entityToState = <T extends Entity>(
	entity: Partial<T> & { $id: string },
	getEventstamp: () => string,
): State => {
	const { $id, ...data } = entity;
	const flattened: { [key: string]: JSONValue } = flatten(data);
	return Object.entries(flattened).map((entry) =>
		makeField($id, entry, getEventstamp),
	);
};

export const entitiesFromState = <T extends Entity>(state: State): T[] => {
	const byEntityId = state.reduce(
		(acc, field) => {
			if (!acc[field.entityId]) {
				acc[field.entityId] = [];
			}
			acc[field.entityId].push(field);
			return acc;
		},
		{} as Record<string, State>,
	);
	return Object.entries(byEntityId).map(([entityId, props]) =>
		makeEntity(entityId, unflatten(props)),
	) as T[];
};
