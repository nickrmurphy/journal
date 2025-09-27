export type MaterializedObject = Record<string, unknown> & { id: string };

export type DematerializedValue = {
	__value: unknown;
	__timestamp: string;
};

export type DematerializedObject = {
	__id: string;
	[key: string]: string | DematerializedValue;
};

export function dematerialize(obj: MaterializedObject): DematerializedObject {
	const result: DematerializedObject = { __id: obj.id };
	const timestamp = new Date().toISOString();

	for (const [key, value] of Object.entries(obj)) {
		if (key === "id") continue;

		result[key] = {
			__value: value,
			__timestamp: timestamp,
		};
	}

	return result;
}

export function materialize(obj: DematerializedObject): MaterializedObject {
	const result: MaterializedObject = { id: obj.__id };

	for (const [key, value] of Object.entries(obj)) {
		if (key === "__id") continue;

		if (typeof value === "object" && value !== null && "__value" in value) {
			result[key] = (value as DematerializedValue).__value;
		}
	}

	return result;
}

export function merge(
	obj1: DematerializedObject,
	obj2: DematerializedObject,
): DematerializedObject {
	const result: DematerializedObject = { __id: obj1.__id };

	// Collect all property keys from both objects (excluding __id)
	const allKeys = new Set([
		...Object.keys(obj1).filter((key) => key !== "__id"),
		...Object.keys(obj2).filter((key) => key !== "__id"),
	]);

	for (const key of allKeys) {
		const value1 = obj1[key];
		const value2 = obj2[key];

		// If only one object has this property, use it
		if (value1 && !value2) {
			result[key] = value1 as DematerializedValue;
		} else if (!value1 && value2) {
			result[key] = value2 as DematerializedValue;
		} else if (value1 && value2) {
			// Both objects have this property, compare timestamps
			const val1 = value1 as DematerializedValue;
			const val2 = value2 as DematerializedValue;

			const timestamp1 = new Date(val1.__timestamp);
			const timestamp2 = new Date(val2.__timestamp);

			// Keep the value with the more recent timestamp
			result[key] = timestamp1 >= timestamp2 ? val1 : val2;
		}
	}

	return result;
}
