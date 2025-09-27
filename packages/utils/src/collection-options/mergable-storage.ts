import type { StandardSchemaV1 } from "@standard-schema/spec";
import type {
	CollectionConfig,
	DeleteMutationFnParams,
	InferSchemaOutput,
	InsertMutationFnParams,
	SyncConfig,
	UpdateMutationFnParams,
} from "@tanstack/react-db";
import {
	type DematerializedObject,
	type MaterializedObject,
	MergableStore,
} from "../mergable-store";
import {
	type BaseCollectionConfigWithoutHandlers,
	deserialize,
	type SyncFunctions,
	serialize,
	writeSyncDeletion,
	writeSyncUpdates,
} from "./shared";

export interface MergableCollectionConfig<
	T extends object,
	TSchema extends StandardSchemaV1,
	TKey extends string | number = string | number,
> extends BaseCollectionConfigWithoutHandlers<T, TKey, TSchema> {}

/**
 * Creates mergable collection options with required schema validation and timestamp-based merging.
 */
export function mergableCollectionOptions<
	TSchema extends StandardSchemaV1,
	TKey extends string | number = string | number,
>(
	config: MergableCollectionConfig<InferSchemaOutput<TSchema>, TSchema, TKey>,
): CollectionConfig<InferSchemaOutput<TSchema>, TKey, TSchema> & {
	id: string;
	utils: { clearStorage: () => Promise<void> };
	schema: TSchema;
} {
	type ItemType = InferSchemaOutput<TSchema>;
	const dataStore = MergableStore<MaterializedObject>();

	// Imperative Shell: Storage operations
	const saveToStorage = async (
		dematerializedObjects: DematerializedObject[],
	): Promise<void> => {
		await config.storage.setItem(
			config.storageKey,
			serialize(dematerializedObjects),
		);
	};

	const loadFromStorage = async (): Promise<DematerializedObject[]> => {
		const data = await config.storage.getItem(config.storageKey);
		return data ? deserialize<DematerializedObject>(data) : [];
	};

	// Utilities
	const clearStorage = async () => {
		dataStore.getDematierialized().clear();
		await config.storage.removeItem(config.storageKey);
	};

	// Mutation handlers - imperative shell around functional core
	const handleMutation = async (items: ItemType[]) => {
		for (const item of items) {
			dataStore.set(item as MaterializedObject);
		}
		const dematerialized = Array.from(dataStore.getDematierialized().values());
		await saveToStorage(dematerialized);
	};

	const handleDeletion = async (keys: TKey[]) => {
		for (const key of keys) {
			dataStore.remove(String(key));
		}
		const dematerialized = Array.from(dataStore.getDematierialized().values());
		await saveToStorage(dematerialized);
	};

	const onInsert = async (params: InsertMutationFnParams<ItemType, TKey>) => {
		const items = params.transaction.mutations.map((m) => m.modified);
		await handleMutation(items);
		writeSyncUpdates(sync, items, "insert");
	};

	const onUpdate = async (params: UpdateMutationFnParams<ItemType, TKey>) => {
		const items = params.transaction.mutations.map((m) => m.modified);
		await handleMutation(items);
		writeSyncUpdates(sync, items, "update");
	};

	const onDelete = async (params: DeleteMutationFnParams<ItemType, TKey>) => {
		const keys = params.transaction.mutations.map((m) => m.key);
		await handleDeletion(keys);
		writeSyncDeletion(sync);
	};

	const sync = createMergableSync<ItemType, TKey>(loadFromStorage, dataStore);

	return {
		...config,
		id: config.id ?? `mergable-collection:${config.storageKey}`,
		sync,
		onInsert,
		onUpdate,
		onDelete,
		utils: { clearStorage },
	};
}

function createMergableSync<T extends object, TKey extends string | number>(
	loadFromStorage: () => Promise<DematerializedObject[]>,
	dataStore: ReturnType<typeof MergableStore<MaterializedObject>>,
): SyncConfig<T, TKey> & SyncFunctions<T> {
	// Capture sync functions to use in mutations
	let syncWrite:
		| ((message: { type: "insert" | "update" | "delete"; value: T }) => void)
		| undefined;
	let syncBegin: (() => void) | undefined;
	let syncCommit: (() => void) | undefined;

	const syncConfig = {
		sync: async (params: Parameters<SyncConfig<T, TKey>["sync"]>[0]) => {
			const { begin, write, commit, markReady } = params;
			// Store sync functions for use in mutation handlers
			syncWrite = write;
			syncBegin = begin;
			syncCommit = commit;

			const dematerializedObjects = await loadFromStorage();
			dataStore.getDematierialized().clear();

			if (dematerializedObjects.length > 0) {
				begin();

				dataStore.mergeState(dematerializedObjects);
				const materializedItems = dataStore.getMaterialized();

				for (const item of materializedItems) {
					write({ type: "insert", value: item as T });
				}

				commit();
			}

			markReady();
			return () => {
				dataStore.getDematierialized().clear();
				syncWrite = undefined;
				syncBegin = undefined;
				syncCommit = undefined;
			};
		},

		// Expose sync functions for mutation handlers to use
		get syncWrite() {
			return syncWrite;
		},
		get syncBegin() {
			return syncBegin;
		},
		get syncCommit() {
			return syncCommit;
		},
	};

	return syncConfig;
}
