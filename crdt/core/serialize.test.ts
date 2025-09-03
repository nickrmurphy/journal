import { expect, test } from "bun:test";
import { entitiesFromState, entityToState } from "./serialize";
import type { Entity, State } from "./types";

test("entityToState - converts simple entity to state", () => {
	const entity = { $id: "entity1", name: "test", age: 25 };
	const getEventstamp = () => "2023-01-01T00:00:00Z";

	const result = entityToState(entity, getEventstamp);

	expect(result).toHaveLength(2);
	expect(result).toContainEqual({
		entityId: "entity1",
		eventstamp: "2023-01-01T00:00:00Z",
		path: "name",
		value: "test",
	});
	expect(result).toContainEqual({
		entityId: "entity1",
		eventstamp: "2023-01-01T00:00:00Z",
		path: "age",
		value: 25,
	});
});

test("entityToState - handles nested objects", () => {
	const entity = {
		$id: "entity1",
		profile: {
			name: "test",
			settings: { theme: "dark" },
		},
	};
	const getEventstamp = () => "2023-01-01T00:00:00Z";

	const result = entityToState(entity, getEventstamp);

	expect(result).toHaveLength(2);
	expect(result).toContainEqual({
		entityId: "entity1",
		eventstamp: "2023-01-01T00:00:00Z",
		path: "profile.name",
		value: "test",
	});
	expect(result).toContainEqual({
		entityId: "entity1",
		eventstamp: "2023-01-01T00:00:00Z",
		path: "profile.settings.theme",
		value: "dark",
	});
});

test("entityToState - handles arrays", () => {
	const entity = { $id: "entity1", tags: ["tag1", "tag2"] };
	const getEventstamp = () => "2023-01-01T00:00:00Z";

	const result = entityToState(entity, getEventstamp);

	expect(result).toHaveLength(2);
	expect(result).toContainEqual({
		entityId: "entity1",
		eventstamp: "2023-01-01T00:00:00Z",
		path: "tags.0",
		value: "tag1",
	});
	expect(result).toContainEqual({
		entityId: "entity1",
		eventstamp: "2023-01-01T00:00:00Z",
		path: "tags.1",
		value: "tag2",
	});
});

test("entityToState - handles partial entity", () => {
	const entity = { $id: "entity1", name: "test" };
	const getEventstamp = () => "2023-01-01T00:00:00Z";

	const result = entityToState(entity, getEventstamp);

	expect(result).toHaveLength(1);
	expect(result[0]).toEqual({
		entityId: "entity1",
		eventstamp: "2023-01-01T00:00:00Z",
		path: "name",
		value: "test",
	});
});

test("entityToState - handles empty data", () => {
	const entity = { $id: "entity1" };
	const getEventstamp = () => "2023-01-01T00:00:00Z";

	const result = entityToState(entity, getEventstamp);

	expect(result).toEqual([]);
});

test("entitiesFromState - converts state to entities", () => {
	const state: State = [
		{
			entityId: "entity1",
			eventstamp: "2023-01-01T00:00:00Z",
			path: "name",
			value: "test1",
		},
		{
			entityId: "entity1",
			eventstamp: "2023-01-01T00:00:00Z",
			path: "age",
			value: 25,
		},
		{
			entityId: "entity2",
			eventstamp: "2023-01-01T00:00:00Z",
			path: "name",
			value: "test2",
		},
	];

	const result = entitiesFromState<Entity>(state);

	expect(result).toHaveLength(2);

	const entity1 = result.find((e) => e.$id === "entity1");
	expect(entity1).toEqual({
		$id: "entity1",
		name: "test1",
		age: 25,
	});

	const entity2 = result.find((e) => e.$id === "entity2");
	expect(entity2).toEqual({
		$id: "entity2",
		name: "test2",
	});
});

test("entitiesFromState - handles nested objects reconstruction", () => {
	const state: State = [
		{
			entityId: "entity1",
			eventstamp: "2023-01-01T00:00:00Z",
			path: "profile.name",
			value: "test",
		},
		{
			entityId: "entity1",
			eventstamp: "2023-01-01T00:00:00Z",
			path: "profile.settings.theme",
			value: "dark",
		},
	];

	const result = entitiesFromState<Entity>(state);

	expect(result).toHaveLength(1);
	expect(result[0]).toEqual({
		$id: "entity1",
		profile: {
			name: "test",
			settings: {
				theme: "dark",
			},
		},
	});
});

test("entitiesFromState - handles arrays reconstruction", () => {
	const state: State = [
		{
			entityId: "entity1",
			eventstamp: "2023-01-01T00:00:00Z",
			path: "tags.0",
			value: "tag1",
		},
		{
			entityId: "entity1",
			eventstamp: "2023-01-01T00:00:00Z",
			path: "tags.1",
			value: "tag2",
		},
	];

	const result = entitiesFromState<Entity>(state);

	expect(result).toHaveLength(1);
	expect(result[0]).toEqual({
		$id: "entity1",
		tags: ["tag1", "tag2"],
	});
});

test("entitiesFromState - handles empty state", () => {
	const state: State = [];

	const result = entitiesFromState<Entity>(state);

	expect(result).toEqual([]);
});

test("round trip - entity to state and back", () => {
	const originalEntity = {
		$id: "entity1",
		name: "test",
		age: 25,
		profile: {
			settings: { theme: "dark" },
		},
		tags: ["tag1", "tag2"],
	};
	const getEventstamp = () => "2023-01-01T00:00:00Z";

	const state = entityToState(originalEntity, getEventstamp);
	const [reconstructed] = entitiesFromState<typeof originalEntity>(state);

	expect(reconstructed).toEqual(originalEntity);
});
