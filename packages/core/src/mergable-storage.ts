/** biome-ignore-all lint/suspicious/noExplicitAny: <any used for generics and inference> */
import type { StandardSchemaV1 } from "@standard-schema/spec";
import type {
	BaseCollectionConfig,
	CollectionConfig,
	DeleteMutationFnParams,
	InferSchemaOutput,
	InsertMutationFnParams,
	SyncConfig,
	UpdateMutationFnParams,
	UtilsRecord,
} from "@tanstack/react-db";
import { DataStore } from "../../utils/src/data-store/data-store";
import type {
	DematerializedObject,
	MaterializedObject,
} from "../../utils/src/data-store/operations";
import type { AsyncStorageApi } from "./async-local-storage";

/**
 * Configuration interface for mergable collection options
 * @template T - The type of items in the collection
 * @template TSchema - The schema type for validation
 * @template TKey - The type of the key returned by `getKey`
 */
export interface MergableCollectionConfig<
	T extends object = object,
	TSchema extends StandardSchemaV1 = never,
	TKey extends string | number = string | number,
> extends BaseCollectionConfig<T, TKey, TSchema> {
	/**
	 * The key to use for storing the collection data in the storage adapter
	 */
	storageKey: string;

	/**
	 * Storage adapter for persistence
	 * Data is cached in memory using DataStore with timestamp-based merging
	 */
	storage: AsyncStorageApi;
}

/**
 * Type for the clear utility function
 */
export type ClearMergableStorageFn = () => Promise<void>;

/**
 * Type for the getStorageSize utility function
 */
export type GetMergableStorageSizeFn = () => Promise<number>;

/**
 * Mergable collection utilities type
 */
export interface MergableCollectionUtils extends UtilsRecord {
	clearStorage: ClearMergableStorageFn;
	getStorageSize: GetMergableStorageSizeFn;
}

/**
 * Validates that a value can be JSON serialized
 * @param value - The value to validate for JSON serialization
 * @param operation - The operation type being performed (for error messages)
 * @throws Error if the value cannot be JSON serialized
 */
function validateJsonSerializable(value: unknown, operation: string): void {
	try {
		JSON.stringify(value);
	} catch (error) {
		throw new Error(
			`SerializationError during ${operation}: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * Creates mergable collection options for use with a standard Collection
 *
 * This function creates a collection that stores data in memory using DataStore
 * for fast access and timestamp-based merging, while persisting data through the
 * provided storage adapter for durability.
 *
 * @template TExplicit - The explicit type of items in the collection (highest priority)
 * @template TSchema - The schema type for validation and type inference (second priority)
 * @template TFallback - The fallback type if no explicit or schema type is provided
 * @param config - Configuration options for the mergable collection
 * @returns Collection options with utilities including clearStorage and getStorageSize
 *
 * @example
 * // Basic mergable collection
 * const collection = createCollection(
 *   mergableCollectionOptions({
 *     storageKey: 'todos',
 *     storage: fileSystemAdapter,
 *     getKey: (item) => item.id,
 *   })
 * )
 *
 * @example
 * // Mergable collection with schema
 * const collection = createCollection(
 *   mergableCollectionOptions({
 *     storageKey: 'todos',
 *     storage: fileSystemAdapter,
 *     getKey: (item) => item.id,
 *     schema: TodoSchema,
 *   })
 * )
 */

// Overload for when schema is provided
export function mergableCollectionOptions<
	T extends StandardSchemaV1,
	TKey extends string | number = string | number,
>(
	config: MergableCollectionConfig<InferSchemaOutput<T>, T, TKey> & {
		schema: T;
	},
): CollectionConfig<InferSchemaOutput<T>, TKey, T> & {
	id: string;
	utils: MergableCollectionUtils;
	schema: T;
};

// Overload for when no schema is provided
export function mergableCollectionOptions<
	T extends object,
	TKey extends string | number = string | number,
>(
	config: MergableCollectionConfig<T, never, TKey> & {
		schema?: never;
	},
): CollectionConfig<T, TKey> & {
	id: string;
	utils: MergableCollectionUtils;
	schema?: never;
};

export function mergableCollectionOptions(
	config: MergableCollectionConfig<any, any, string | number>,
): Omit<CollectionConfig<any, string | number, any>, `id`> & {
	id: string;
	utils: MergableCollectionUtils;
	schema?: StandardSchemaV1;
} {
	// Validate required parameters
	if (!config.storageKey) {
		throw new Error("StorageKeyRequiredError: storageKey is required");
	}

	// Initialize DataStore for memory caching with dematerialized objects
	const dataStore = DataStore<MaterializedObject>();

	// Create the sync configuration
	const sync = createMergableSync<any>(
		config.storageKey,
		config.storage,
		dataStore,
	);

	/**
	 * Save dematerialized data to storage adapter
	 * @param dematerializedMap - Map of dematerialized objects to save
	 */
	const saveToStorage = async (
		dematerializedMap: Map<string, DematerializedObject>,
	): Promise<void> => {
		try {
			// Convert Map to array format for JSON serialization
			// Store as array of dematerialized objects for consistent loading
			const dematerializedArray = Array.from(dematerializedMap.values());
			const serialized = JSON.stringify(dematerializedArray);
			await config.storage.setItem(config.storageKey, serialized);
		} catch (error) {
			console.error(
				`[MergableCollection] Error saving data to storage key "${config.storageKey}":`,
				error,
			);
			throw error;
		}
	};

	/**
	 * Removes all collection data from the configured storage
	 */
	const clearStorage: ClearMergableStorageFn = async (): Promise<void> => {
		// Clear memory cache and persistent storage
		dataStore.getDematierialized().clear();
		await config.storage.removeItem(config.storageKey);
	};

	/**
	 * Get the size of the stored data in bytes (approximate)
	 * @returns The approximate size in bytes of the stored collection data
	 */
	const getStorageSize: GetMergableStorageSizeFn =
		async (): Promise<number> => {
			const data = await config.storage.getItem(config.storageKey);
			return data ? new Blob([data]).size : 0;
		};

	/**
	 * Mutation handlers that update memory cache and persist to storage
	 */
	const wrappedOnInsert = async (params: InsertMutationFnParams<any>) => {
		// Update memory cache for all mutations
		const insertedItems: any[] = [];
		for (const mutation of params.transaction.mutations) {
			validateJsonSerializable(mutation.modified, `insert`);
			dataStore.set(mutation.modified);
			insertedItems.push(mutation.modified);
		}

		// Call the user handler BEFORE persisting changes (if provided)
		let handlerResult: unknown = {};
		if (config.onInsert) {
			handlerResult = (await config.onInsert(params)) ?? {};
		}

		// Persist dematerialized state to storage
		await saveToStorage(dataStore.getDematierialized());

		// Write back through sync mechanism to update UI immediately
		if (sync.syncBegin && sync.syncWrite && sync.syncCommit) {
			sync.syncBegin();
			for (const item of insertedItems) {
				sync.syncWrite({ type: "insert", value: item });
			}
			sync.syncCommit();
		}

		return handlerResult;
	};

	const wrappedOnUpdate = async (params: UpdateMutationFnParams<any>) => {
		// Update memory cache for all mutations
		const updatedItems: any[] = [];
		for (const mutation of params.transaction.mutations) {
			validateJsonSerializable(mutation.modified, `update`);
			dataStore.set(mutation.modified);
			updatedItems.push(mutation.modified);
		}

		// Call the user handler BEFORE persisting changes (if provided)
		let handlerResult: unknown = {};
		if (config.onUpdate) {
			handlerResult = (await config.onUpdate(params)) ?? {};
		}

		// Persist dematerialized state to storage
		await saveToStorage(dataStore.getDematierialized());

		// Write back through sync mechanism to update UI immediately
		if (sync.syncBegin && sync.syncWrite && sync.syncCommit) {
			sync.syncBegin();
			for (const item of updatedItems) {
				sync.syncWrite({ type: "update", value: item });
			}
			sync.syncCommit();
		}

		return handlerResult;
	};

	const wrappedOnDelete = async (params: DeleteMutationFnParams<any>) => {
		// Remove from memory cache for all mutations
		for (const mutation of params.transaction.mutations) {
			dataStore.remove(String(mutation.key));
		}

		// Call the user handler BEFORE persisting changes (if provided)
		let handlerResult: unknown = {};
		if (config.onDelete) {
			handlerResult = (await config.onDelete(params)) ?? {};
		}

		// Persist dematerialized state to storage
		await saveToStorage(dataStore.getDematierialized());

		// Write back through sync mechanism to update UI immediately
		if (sync.syncBegin && sync.syncCommit) {
			sync.syncBegin();
			// For deletions, we'll skip the write-back since we don't have the full item
			// The sync mechanism will handle the deletion properly
			sync.syncCommit();
		}

		return handlerResult;
	};

	// Extract standard Collection config properties
	const {
		storageKey: _storageKey,
		storage: _storage,
		onInsert: _onInsert,
		onUpdate: _onUpdate,
		onDelete: _onDelete,
		id,
		...restConfig
	} = config;

	// Default id to a pattern based on storage key if not provided
	const collectionId = id ?? `mergable-collection:${config.storageKey}`;

	return {
		...restConfig,
		id: collectionId,
		sync,
		onInsert: wrappedOnInsert,
		onUpdate: wrappedOnUpdate,
		onDelete: wrappedOnDelete,
		utils: {
			clearStorage,
			getStorageSize,
		},
	};
}

/**
 * Load dematerialized data from storage adapter
 * @param storageKey - The key used to store data in the storage adapter
 * @param storage - The async storage API to load from
 * @returns Map of dematerialized objects, or empty Map if loading fails
 */
async function loadFromStorage(
	storageKey: string,
	storage: AsyncStorageApi,
): Promise<Map<string, DematerializedObject>> {
	try {
		const rawData = await storage.getItem(storageKey);
		if (!rawData) {
			return new Map();
		}

		const parsed = JSON.parse(rawData);

		// Expect an array of dematerialized objects
		if (Array.isArray(parsed)) {
			const dataMap = new Map<string, DematerializedObject>();
			parsed.forEach((item) => {
				// Validate that the item is a proper DematerializedObject
				if (
					item &&
					typeof item === "object" &&
					"__id" in item &&
					typeof item.__id === "string"
				) {
					const dematerializedObj = item as DematerializedObject;
					dataMap.set(dematerializedObj.__id, dematerializedObj);
				}
			});
			return dataMap;
		}

		// Handle legacy object format for backward compatibility
		if (
			typeof parsed === "object" &&
			parsed !== null &&
			!Array.isArray(parsed)
		) {
			const dataMap = new Map<string, DematerializedObject>();
			Object.entries(parsed).forEach(([key, value]) => {
				// Validate that the value is a proper DematerializedObject
				if (
					value &&
					typeof value === "object" &&
					"__id" in value &&
					typeof value.__id === "string"
				) {
					dataMap.set(key, value as DematerializedObject);
				}
			});
			return dataMap;
		}

		return new Map();
	} catch (error) {
		console.warn(
			`[MergableCollection] Error loading data from storage key "${storageKey}":`,
			error,
		);
		return new Map();
	}
}

/**
 * Internal function to create mergable sync configuration
 * Creates a sync configuration that loads from storage adapter into DataStore cache
 * @param storageKey - The key used for storing data in the storage adapter
 * @param storage - The async storage API to use
 * @param dataStore - DataStore instance for memory caching with timestamp-based merging
 * @returns Sync configuration
 */
function createMergableSync<T extends object>(
	storageKey: string,
	storage: AsyncStorageApi,
	dataStore: ReturnType<typeof DataStore<MaterializedObject>>,
): SyncConfig<T> & {
	syncWrite?: (message: {
		type: "insert" | "update" | "delete";
		value: T;
	}) => void;
	syncBegin?: () => void;
	syncCommit?: () => void;
} {
	// Capture sync functions to use in mutations
	let syncWrite:
		| ((message: { type: "insert" | "update" | "delete"; value: T }) => void)
		| undefined;
	let syncBegin: (() => void) | undefined;
	let syncCommit: (() => void) | undefined;

	const syncConfig = {
		sync: async (params: Parameters<SyncConfig<T>[`sync`]>[0]) => {
			const { begin, write, commit, markReady } = params;

			// Store sync functions for use in mutation handlers
			syncWrite = write;
			syncBegin = begin;
			syncCommit = commit;

			// Initial load from storage adapter
			const dematerializedMap = await loadFromStorage(storageKey, storage);

			// Clear cache
			dataStore.getDematierialized().clear();

			if (dematerializedMap.size > 0) {
				begin();

				// Load into DataStore and materialize for TanStack collection
				const dematerializedArray = Array.from(dematerializedMap.values());
				dataStore.mergeState(dematerializedArray);
				const materializedItems = dataStore.getMaterialized();

				for (const item of materializedItems) {
					validateJsonSerializable(item, `load`);
					write({ type: `insert`, value: item as T });
				}

				commit();
			}

			// Mark collection as ready after initial load
			markReady();

			// Return cleanup function
			return () => {
				dataStore.getDematierialized().clear();
				syncWrite = undefined;
				syncBegin = undefined;
				syncCommit = undefined;
			};
		},

		/**
		 * Get sync metadata - returns storage key information
		 * @returns Object containing storage key and storage type metadata
		 */
		getSyncMetadata: () => ({
			storageKey,
			storageType: `mergable-cached`,
		}),

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
