import { expect, test } from "bun:test";
import {
	type DematerializedObject,
	type DematerializedValue,
	dematerialize,
	materialize,
	merge,
	mergeValues,
} from "./operations";

test("dematerialize converts materialized object to dematerialized format", () => {
	const materialized = {
		id: "123",
		name: "John",
		age: 30,
		tags: ["developer", "javascript"],
	};

	const result = dematerialize(materialized);

	expect(result.__id).toBe("123");
	expect(result.name).toHaveProperty("__value", "John");
	expect(result.name).toHaveProperty("__timestamp");
	expect(result.age).toHaveProperty("__value", 30);
	expect(result.tags).toHaveProperty("__value", ["developer", "javascript"]);
	expect(typeof (result.name as DematerializedValue).__timestamp).toBe(
		"string",
	);
});

test("materialize converts dematerialized object back to materialized format", () => {
	const dematerialized: DematerializedObject = {
		__id: "456",
		name: {
			__value: "Jane",
			__timestamp: "2025-01-01T12:00:00.000Z",
		},
		age: {
			__value: 25,
			__timestamp: "2025-01-01T12:00:00.000Z",
		},
	};

	const result = materialize(dematerialized);

	expect(result.id).toBe("456");
	expect(result.name).toBe("Jane");
	expect(result.age).toBe(25);
});

test("dematerialize and materialize are inverse operations", () => {
	const original = {
		id: "789",
		title: "Test Document",
		content: "Some content here",
		version: 1,
	};

	const dematerialized = dematerialize(original);
	const rematerialized = materialize(dematerialized);

	expect(rematerialized).toEqual(original);
});

test("merge keeps properties with more recent timestamps", () => {
	const obj1: DematerializedObject = {
		__id: "test",
		name: {
			__value: "Old Name",
			__timestamp: "2025-01-01T12:00:00.000Z",
		},
		age: {
			__value: 30,
			__timestamp: "2025-01-02T12:00:00.000Z",
		},
	};

	const obj2: DematerializedObject = {
		__id: "test",
		name: {
			__value: "New Name",
			__timestamp: "2025-01-03T12:00:00.000Z",
		},
		city: {
			__value: "New York",
			__timestamp: "2025-01-01T12:00:00.000Z",
		},
	};

	const result = merge(obj1, obj2);

	expect(result.__id).toBe("test");
	expect((result.name as DematerializedValue).__value).toBe("New Name");
	expect((result.age as DematerializedValue).__value).toBe(30);
	expect((result.city as DematerializedValue).__value).toBe("New York");
});

test("merge includes properties that exist in only one object", () => {
	const obj1: DematerializedObject = {
		__id: "test",
		uniqueToObj1: {
			__value: "value1",
			__timestamp: "2025-01-01T12:00:00.000Z",
		},
	};

	const obj2: DematerializedObject = {
		__id: "test",
		uniqueToObj2: {
			__value: "value2",
			__timestamp: "2025-01-01T12:00:00.000Z",
		},
	};

	const result = merge(obj1, obj2);

	expect((result.uniqueToObj1 as DematerializedValue).__value).toBe("value1");
	expect((result.uniqueToObj2 as DematerializedValue).__value).toBe("value2");
});

test("mergeValues merges objects with same ID", () => {
	const values: DematerializedObject[] = [
		{
			__id: "user1",
			name: {
				__value: "Alice",
				__timestamp: "2025-01-01T12:00:00.000Z",
			},
		},
		{
			__id: "user1",
			name: {
				__value: "Alice Updated",
				__timestamp: "2025-01-02T12:00:00.000Z",
			},
			email: {
				__value: "alice@example.com",
				__timestamp: "2025-01-01T12:00:00.000Z",
			},
		},
	];

	const result = mergeValues(values);

	expect(result).toHaveLength(1);
	expect(result[0]?.__id).toBe("user1");
	expect((result[0]?.name as DematerializedValue).__value).toBe(
		"Alice Updated",
	);
	expect((result[0]?.email as DematerializedValue).__value).toBe(
		"alice@example.com",
	);
});

test("mergeValues keeps objects with different IDs separate", () => {
	const values: DematerializedObject[] = [
		{
			__id: "user1",
			name: {
				__value: "Alice",
				__timestamp: "2025-01-01T12:00:00.000Z",
			},
		},
		{
			__id: "user2",
			name: {
				__value: "Bob",
				__timestamp: "2025-01-01T12:00:00.000Z",
			},
		},
	];

	const result = mergeValues(values);

	expect(result).toHaveLength(2);
	expect(result.find((obj) => obj.__id === "user1")).toBeDefined();
	expect(result.find((obj) => obj.__id === "user2")).toBeDefined();
});

test("mergeValues handles multiple merges for same ID", () => {
	const values: DematerializedObject[] = [
		{
			__id: "doc1",
			title: {
				__value: "Version 1",
				__timestamp: "2025-01-01T12:00:00.000Z",
			},
		},
		{
			__id: "doc1",
			title: {
				__value: "Version 2",
				__timestamp: "2025-01-02T12:00:00.000Z",
			},
		},
		{
			__id: "doc1",
			title: {
				__value: "Version 3",
				__timestamp: "2025-01-03T12:00:00.000Z",
			},
			status: {
				__value: "published",
				__timestamp: "2025-01-03T12:00:00.000Z",
			},
		},
	];

	const result = mergeValues(values);

	expect(result).toHaveLength(1);
	expect((result[0]?.title as DematerializedValue).__value).toBe("Version 3");
	expect((result[0]?.status as DematerializedValue).__value).toBe("published");
});

test("mergeValues returns empty array for empty input", () => {
	const result = mergeValues([]);

	expect(result).toHaveLength(0);
});

test("merge does not replace newer lefthand value with older righthand value", () => {
	const obj1: DematerializedObject = {
		__id: "test",
		name: {
			__value: "Newer Name",
			__timestamp: "2025-01-05T12:00:00.000Z",
		},
		age: {
			__value: 35,
			__timestamp: "2025-01-04T12:00:00.000Z",
		},
	};

	const obj2: DematerializedObject = {
		__id: "test",
		name: {
			__value: "Older Name",
			__timestamp: "2025-01-01T12:00:00.000Z",
		},
	};

	const result = merge(obj1, obj2);

	expect(result.__id).toBe("test");
	expect((result.name as DematerializedValue).__value).toBe("Newer Name");
	expect((result.name as DematerializedValue).__timestamp).toBe(
		"2025-01-05T12:00:00.000Z",
	);
	expect((result.age as DematerializedValue).__value).toBe(35);
});
