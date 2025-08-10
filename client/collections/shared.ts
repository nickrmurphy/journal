import { QueryClient } from "@tanstack/query-core";
import { get as getVal, set as setVal } from "idb-keyval";

export const queryClient = new QueryClient();

// biome-ignore lint/suspicious/noExplicitAny: <need flexible types here>
type Entity = { id: string; [key: string]: any };
type EntityMap<T extends Entity> = Record<string, T>;

export const createIdbPersister = <T extends Entity>(key: string) => {
	const getAll = async () => {
		const allValues = await getVal<EntityMap<T>>(key);
		return allValues ? Object.values(allValues) : [];
	};

	const get = async (id: string) => {
		const allValues = await getVal<EntityMap<T>>(key);
		return allValues ? allValues[id] : undefined;
	};

	const insert = async (value: T) => {
		const allValues = await getVal<EntityMap<T>>(key);
		if (!allValues) {
			await setVal(key, { [value.id]: value });
			return;
		} else {
			await setVal(key, { ...allValues, [value.id]: value });
			return;
		}
	};

	const update = async (value: Partial<T> & Pick<T, "id">) => {
		const allValues = await getVal<EntityMap<T>>(key);

		if (!allValues) throw new Error("Not found");

		const current = allValues[value.id];
		await setVal(key, { ...allValues, [value.id]: { ...current, ...value } });
	};

	return { getAll, get, insert, update };
};
