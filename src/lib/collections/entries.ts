import { mergableCollectionOptions } from "@/lib/collection-options";
import type { AsyncStorageApi } from "@/lib/storage-adapters";
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
