import { mergableCollectionOptions } from "@journal/utils/collection-options";
import type { AsyncStorageApi } from "@journal/utils/storage-adapters";
import { createCollection } from "@tanstack/react-db";
import { EntrySchema } from "../schemas";

export const createEntriesCollection = (storageAdapter: AsyncStorageApi) =>
	createCollection(
		mergableCollectionOptions({
			storageKey: "entries",
			storage: storageAdapter,
			getKey: (entry) => entry.id,
			schema: EntrySchema,
		}),
	);
