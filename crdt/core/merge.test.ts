import { expect, test } from "bun:test";
import { mergeField, mergeState } from "./merge";
import type { Field, State } from "./types";

test("mergeField - adds new field when not present", () => {
	const state: State = [];
	const newField: Field = {
		entityId: "entity1",
		eventstamp: "2023-01-01T00:00:00Z",
		path: "name",
		value: "test",
	};

	const [result, modified] = mergeField(state, newField);

	expect(modified).toBe(true);
	expect(result).toEqual([newField]);
});

test("mergeField - ignores older field", () => {
	const existingField: Field = {
		entityId: "entity1",
		eventstamp: "2023-01-02T00:00:00Z",
		path: "name",
		value: "current",
	};
	const state: State = [existingField];
	const olderField: Field = {
		entityId: "entity1",
		eventstamp: "2023-01-01T00:00:00Z",
		path: "name",
		value: "old",
	};

	const [result, modified] = mergeField(state, olderField);

	expect(modified).toBe(false);
	expect(result).toEqual(state);
});

test("mergeField - replaces with newer field", () => {
	const existingField: Field = {
		entityId: "entity1",
		eventstamp: "2023-01-01T00:00:00Z",
		path: "name",
		value: "old",
	};
	const state: State = [existingField];
	const newerField: Field = {
		entityId: "entity1",
		eventstamp: "2023-01-02T00:00:00Z",
		path: "name",
		value: "new",
	};

	const [result, modified] = mergeField(state, newerField);

	expect(modified).toBe(true);
	expect(result).toEqual([newerField]);
});

test("mergeField - handles different entity IDs", () => {
	const existingField: Field = {
		entityId: "entity1",
		eventstamp: "2023-01-01T00:00:00Z",
		path: "name",
		value: "entity1-name",
	};
	const state: State = [existingField];
	const differentEntityField: Field = {
		entityId: "entity2",
		eventstamp: "2023-01-01T00:00:00Z",
		path: "name",
		value: "entity2-name",
	};

	const [result, modified] = mergeField(state, differentEntityField);

	expect(modified).toBe(true);
	expect(result).toHaveLength(2);
	expect(result).toContain(existingField);
	expect(result).toContain(differentEntityField);
});

test("mergeField - handles different paths", () => {
	const existingField: Field = {
		entityId: "entity1",
		eventstamp: "2023-01-01T00:00:00Z",
		path: "name",
		value: "test-name",
	};
	const state: State = [existingField];
	const differentPathField: Field = {
		entityId: "entity1",
		eventstamp: "2023-01-01T00:00:00Z",
		path: "age",
		value: 25,
	};

	const [result, modified] = mergeField(state, differentPathField);

	expect(modified).toBe(true);
	expect(result).toHaveLength(2);
	expect(result).toContain(existingField);
	expect(result).toContain(differentPathField);
});

test("mergeState - merges empty states", () => {
	const state: State = [];
	const nextState: State = [];

	const [result, modified] = mergeState(state, nextState);

	expect(modified).toBe(false);
	expect(result).toEqual([]);
});

test("mergeState - merges multiple fields", () => {
	const state: State = [];
	const nextState: State = [
		{
			entityId: "entity1",
			eventstamp: "2023-01-01T00:00:00Z",
			path: "name",
			value: "test",
		},
		{
			entityId: "entity1",
			eventstamp: "2023-01-01T00:00:00Z",
			path: "age",
			value: 25,
		},
	];

	const [result, modified] = mergeState(state, nextState);

	expect(modified).toBe(true);
	expect(result).toEqual(nextState);
});

test("mergeState - handles mixed old and new fields", () => {
	const existingField: Field = {
		entityId: "entity1",
		eventstamp: "2023-01-02T00:00:00Z",
		path: "name",
		value: "current",
	};
	const state: State = [existingField];

	const nextState: State = [
		{
			entityId: "entity1",
			eventstamp: "2023-01-01T00:00:00Z", // older
			path: "name",
			value: "old",
		},
		{
			entityId: "entity1",
			eventstamp: "2023-01-03T00:00:00Z", // newer
			path: "age",
			value: 30,
		},
	];

	const [result, modified] = mergeState(state, nextState);

	expect(modified).toBe(true);
	expect(result).toHaveLength(2);
	expect(result.find((f) => f.path === "name")?.value).toBe("current");
	expect(result.find((f) => f.path === "age")?.value).toBe(30);
});
