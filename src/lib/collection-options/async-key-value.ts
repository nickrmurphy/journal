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
	type BaseCollectionConfigWithoutHandlers,
	deserialize,
	type SyncFunctions,
	serialize,
	writeSyncDeletion,
	writeSyncUpdates,
} from "./shared";

export interface AsyncKeyValueCollectionConfig<
	T extends object,
	TSchema extends StandardSchemaV1,
	TKey extends string | number = string | number,
> extends BaseCollectionConfigWithoutHandlers<T, TKey, TSchema> {}

/**
 * Creates async key-value collection options with required schema validation.
 */
export function asyncKeyValueCollectionOptions<
	TSchema extends StandardSchemaV1,
	TKey extends string | number = string | number,
>(
	config: AsyncKeyValueCollectionConfig<
		InferSchemaOutput<TSchema>,
		TSchema,
		TKey
	>,
): CollectionConfig<InferSchemaOutput<TSchema>, TKey, TSchema> & {
	id: string;
	utils: { clearStorage: () => Promise<void> };
	schema: TSchema;
} {
	type ItemType = InferSchemaOutput<TSchema>;
	const itemsCache = new Map<TKey, ItemType>();

	// Imperative Shell: Storage operations
	const saveToStorage = async (items: ItemType[]): Promise<void> => {
		// TODO: update this to convert to an Array before persisting, for compactness
		await config.storage.setItem(config.storageKey, serialize(items));
	};

	const loadFromStorage = async (): Promise<ItemType[]> => {
		const data = await config.storage.getItem(config.storageKey);
		return data ? deserialize<ItemType>(data) : [];
	};

	// Utilities
	const clearStorage = () => config.storage.removeItem(config.storageKey);

	// Mutation handlers - imperative shell around functional core
	const handleMutation = async (items: ItemType[]) => {
		for (const item of items) {
			const key = config.getKey(item);
			itemsCache.set(key, item);
		}
		await saveToStorage(Array.from(itemsCache.values()));
	};

	const handleDeletion = async (keys: TKey[]) => {
		for (const key of keys) {
			itemsCache.delete(key);
		}
		await saveToStorage(Array.from(itemsCache.values()));
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

	const sync = createAsyncKeyValueSync(
		loadFromStorage,
		itemsCache,
		config.getKey,
	);

	return {
		...config,
		id: config.id ?? `async-kv-collection:${config.storageKey}`,
		sync,
		onInsert,
		onUpdate,
		onDelete,
		utils: { clearStorage },
	};
}

function createAsyncKeyValueSync<
	T extends object,
	TKey extends string | number,
>(
	loadFromStorage: () => Promise<T[]>,
	itemsCache: Map<TKey, T>,
	getKey: (item: T) => TKey,
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

			const items = await loadFromStorage();
			itemsCache.clear();

			if (items.length > 0) {
				begin();
				items.forEach((item) => {
					const key = getKey(item);
					itemsCache.set(key, item);
					write({ type: "insert", value: item });
				});
				commit();
			}

			markReady();
			return () => {
				itemsCache.clear();
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
