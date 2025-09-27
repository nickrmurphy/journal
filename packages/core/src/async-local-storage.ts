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

/**
 * Async storage API interface for IndexedDB operations
 */
export type AsyncStorageApi = {
	getItem: (key: string) => Promise<string | null>;
	setItem: (key: string, value: string) => Promise<void>;
	removeItem: (key: string) => Promise<void>;
	clear: () => Promise<void>;
};

/**
 * Internal storage format that includes version tracking
 */
interface StoredItem<T> {
	versionKey: string;
	data: T;
}

/**
 * Configuration interface for IndexedDB collection options
 * @template T - The type of items in the collection
 * @template TSchema - The schema type for validation
 * @template TKey - The type of the key returned by `getKey`
 */
export interface AsyncLocalStorageCollectionConfig<
	T extends object = object,
	TSchema extends StandardSchemaV1 = never,
	TKey extends string | number = string | number,
> extends BaseCollectionConfig<T, TKey, TSchema> {
	/**
	 * The key to use for storing the collection data in IndexedDB
	 */
	storageKey: string;

	/**
	 * Async storage API to use
	 * Can be any object that implements the AsyncStorageApi interface
	 */
	storage: AsyncStorageApi;
}

/**
 * Type for the clear utility function
 */
export type ClearStorageFn = () => Promise<void>;

/**
 * Type for the getStorageSize utility function
 */
export type GetStorageSizeFn = () => Promise<number>;

/**
 * IndexedDB collection utilities type
 */
export interface IndexedDbCollectionUtils extends UtilsRecord {
	clearStorage: ClearStorageFn;
	getStorageSize: GetStorageSizeFn;
}

/**
 * Validates that a value can be JSON serialized
 * @param value - The value to validate for JSON serialization
 * @param operation - The operation type being performed (for error messages)
 * @throws Error if the value cannot be JSON serialized
 */
function validateJsonSerializable(value: any, operation: string): void {
	try {
		JSON.stringify(value);
	} catch (error) {
		throw new Error(
			`SerializationError during ${operation}: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * Generate a UUID for version tracking
 * @returns A unique identifier string for tracking data versions
 */
function generateUuid(): string {
	return crypto.randomUUID();
}

/**
 * Creates IndexedDB collection options for use with a standard Collection
 *
 * This function creates a collection that persists data to IndexedDB
 * using the idb-keyval library for async operations.
 *
 * @template TExplicit - The explicit type of items in the collection (highest priority)
 * @template TSchema - The schema type for validation and type inference (second priority)
 * @template TFallback - The fallback type if no explicit or schema type is provided
 * @param config - Configuration options for the IndexedDB collection
 * @returns Collection options with utilities including clearStorage and getStorageSize
 *
 * @example
 * // Basic IndexedDB collection
 * const collection = createCollection(
 *   asyncLocalStorageCollectionOptions({
 *     storageKey: 'todos',
 *     getKey: (item) => item.id,
 *   })
 * )
 *
 * @example
 * // IndexedDB collection with custom storage
 * const collection = createCollection(
 *   asyncLocalStorageCollectionOptions({
 *     storageKey: 'todos',
 *     storage: customAsyncStorage,
 *     getKey: (item) => item.id,
 *   })
 * )
 *
 * @example
 * // IndexedDB collection with mutation handlers
 * const collection = createCollection(
 *   asyncLocalStorageCollectionOptions({
 *     storageKey: 'todos',
 *     getKey: (item) => item.id,
 *     onInsert: async ({ transaction }) => {
 *       console.log('Item inserted:', transaction.mutations[0].modified)
 *     },
 *   })
 * )
 */

// Overload for when schema is provided
export function asyncLocalStorageCollectionOptions<
	T extends StandardSchemaV1,
	TKey extends string | number = string | number,
>(
	config: AsyncLocalStorageCollectionConfig<InferSchemaOutput<T>, T, TKey> & {
		schema: T;
	},
): CollectionConfig<InferSchemaOutput<T>, TKey, T> & {
	id: string;
	utils: IndexedDbCollectionUtils;
	schema: T;
};

// Overload for when no schema is provided
export function asyncLocalStorageCollectionOptions<
	T extends object,
	TKey extends string | number = string | number,
>(
	config: AsyncLocalStorageCollectionConfig<T, never, TKey> & {
		schema?: never;
	},
): CollectionConfig<T, TKey> & {
	id: string;
	utils: IndexedDbCollectionUtils;
	schema?: never;
};

export function asyncLocalStorageCollectionOptions(
	config: AsyncLocalStorageCollectionConfig<any, any, string | number>,
): Omit<CollectionConfig<any, string | number, any>, `id`> & {
	id: string;
	utils: IndexedDbCollectionUtils;
	schema?: StandardSchemaV1;
} {
	// Validate required parameters
	if (!config.storageKey) {
		throw new Error("StorageKeyRequiredError: storageKey is required");
	}

	// Use provided storage
	const storage = config.storage;

	// Items cache to track current state (like filesystem version)
	const itemsCache = new Map<string | number, any>();

	// Create the sync configuration
	const sync = createIndexedDbSync<any>(
		config.storageKey,
		storage,
		config.getKey,
		itemsCache,
	);

	/**
	 * Save data to storage
	 * @param dataMap - Map of items with version tracking to save to storage
	 */
	const saveToStorage = async (
		dataMap: Map<string | number, StoredItem<any>>,
	): Promise<void> => {
		try {
			// Convert Map to object format for storage
			const objectData: Record<string, StoredItem<any>> = {};
			dataMap.forEach((storedItem, key) => {
				objectData[String(key)] = storedItem;
			});
			const serialized = JSON.stringify(objectData);
			await storage.setItem(config.storageKey, serialized);
		} catch (error) {
			console.error(
				`[IndexedDbCollection] Error saving data to storage key "${config.storageKey}":`,
				error,
			);
			throw error;
		}
	};

	/**
	 * Removes all collection data from the configured storage
	 */
	const clearStorage: ClearStorageFn = async (): Promise<void> => {
		await storage.removeItem(config.storageKey);
	};

	/**
	 * Get the size of the stored data in bytes (approximate)
	 * @returns The approximate size in bytes of the stored collection data
	 */
	const getStorageSize: GetStorageSizeFn = async (): Promise<number> => {
		const data = await storage.getItem(config.storageKey);
		return data ? new Blob([data]).size : 0;
	};

	/*
	 * Create wrapper handlers for direct persistence operations that perform actual storage operations
	 * Wraps the user's onInsert handler to also save changes to IndexedDB
	 */
	const wrappedOnInsert = async (params: InsertMutationFnParams<any>) => {
		// Validate that all values in the transaction can be JSON serialized
		const insertedItems: any[] = [];

		for (const mutation of params.transaction.mutations) {
			validateJsonSerializable(mutation.modified, `insert`);
			const key = config.getKey(mutation.modified);
			itemsCache.set(key, mutation.modified);
			insertedItems.push(mutation.modified);
		}

		// Call the user handler BEFORE persisting changes (if provided)
		let handlerResult: any = {};
		if (config.onInsert) {
			handlerResult = (await config.onInsert(params)) ?? {};
		}

		// 1. Persist to storage
		const currentData = new Map<string | number, StoredItem<any>>();
		itemsCache.forEach((item, key) => {
			currentData.set(key, {
				versionKey: generateUuid(),
				data: item,
			});
		});
		await saveToStorage(currentData);

		// 2. Write back through sync mechanism to update UI immediately
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
		// Validate that all values in the transaction can be JSON serialized
		const updatedItems: any[] = [];

		for (const mutation of params.transaction.mutations) {
			validateJsonSerializable(mutation.modified, `update`);
			const key = config.getKey(mutation.modified);
			itemsCache.set(key, mutation.modified);
			updatedItems.push(mutation.modified);
		}

		// Call the user handler BEFORE persisting changes (if provided)
		let handlerResult: any = {};
		if (config.onUpdate) {
			handlerResult = (await config.onUpdate(params)) ?? {};
		}

		// 1. Persist to storage
		const currentData = new Map<string | number, StoredItem<any>>();
		itemsCache.forEach((item, key) => {
			currentData.set(key, {
				versionKey: generateUuid(),
				data: item,
			});
		});
		await saveToStorage(currentData);

		// 2. Write back through sync mechanism to update UI immediately
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
		const deletedKeys: (string | number)[] = [];

		for (const mutation of params.transaction.mutations) {
			itemsCache.delete(mutation.key);
			deletedKeys.push(mutation.key);
		}

		// Call the user handler BEFORE persisting changes (if provided)
		let handlerResult: any = {};
		if (config.onDelete) {
			handlerResult = (await config.onDelete(params)) ?? {};
		}

		// 1. Persist to storage
		const currentData = new Map<string | number, StoredItem<any>>();
		itemsCache.forEach((item, key) => {
			currentData.set(key, {
				versionKey: generateUuid(),
				data: item,
			});
		});
		await saveToStorage(currentData);

		// 2. Write back through sync mechanism
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
	const collectionId = id ?? `indexeddb-collection:${config.storageKey}`;

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
 * Load data from storage and return as a Map
 * @param storageKey - The key used to store data in the storage API
 * @param storage - The async storage API to load from
 * @returns Map of stored items with version tracking, or empty Map if loading fails
 */
async function loadFromStorage<T extends object>(
	storageKey: string,
	storage: AsyncStorageApi,
): Promise<Map<string | number, StoredItem<T>>> {
	try {
		const rawData = await storage.getItem(storageKey);
		if (!rawData) {
			return new Map();
		}

		const parsed = JSON.parse(rawData);
		const dataMap = new Map<string | number, StoredItem<T>>();

		// Handle object format where keys map to StoredItem values
		if (
			typeof parsed === `object` &&
			parsed !== null &&
			!Array.isArray(parsed)
		) {
			Object.entries(parsed).forEach(([key, value]) => {
				// Runtime check to ensure the value has the expected StoredItem structure
				if (
					value &&
					typeof value === `object` &&
					`versionKey` in value &&
					`data` in value
				) {
					const storedItem = value as StoredItem<T>;
					dataMap.set(key, storedItem);
				} else {
					throw new Error(
						`InvalidStorageDataFormatError for key "${key}" in storage key "${storageKey}"`,
					);
				}
			});
		} else {
			throw new Error(
				`InvalidStorageObjectFormatError for storage key "${storageKey}"`,
			);
		}

		return dataMap;
	} catch (error) {
		console.warn(
			`[IndexedDbCollection] Error loading data from storage key "${storageKey}":`,
			error,
		);
		return new Map();
	}
}

/**
 * Internal function to create IndexedDB sync configuration
 * Creates a sync configuration that handles IndexedDB persistence
 * @param storageKey - The key used for storing data in IndexedDB
 * @param storage - The async storage API to use
 * @param getKey - Function to extract the key from an item
 * @param lastKnownData - Map tracking the last known state for change detection
 * @returns Sync configuration
 */
function createIndexedDbSync<T extends object>(
	storageKey: string,
	storage: AsyncStorageApi,
	getKey: (item: T) => string | number,
	itemsCache: Map<string | number, T>,
): SyncConfig<T> & {
	syncWrite?: (message: {
		type: "insert" | "update" | "delete";
		value: T;
	}) => void;
	syncBegin?: () => void;
	syncCommit?: () => void;
} {
	// CRITICAL: Capture sync functions to use in mutations (like filesystem version)
	let syncWrite:
		| ((message: { type: "insert" | "update" | "delete"; value: T }) => void)
		| undefined;
	let syncBegin: (() => void) | undefined;
	let syncCommit: (() => void) | undefined;

	const syncConfig: SyncConfig<T> & {
		syncWrite?: (message: {
			type: "insert" | "update" | "delete";
			value: T;
		}) => void;
		syncBegin?: () => void;
		syncCommit?: () => void;
	} = {
		sync: async (params: Parameters<SyncConfig<T>[`sync`]>[0]) => {
			const { begin, write, commit, markReady } = params;

			// Store sync functions for use in mutation handlers (like filesystem version)
			syncWrite = write;
			syncBegin = begin;
			syncCommit = commit;

			// Initial load
			const initialData = await loadFromStorage<T>(storageKey, storage);

			// Update items cache
			itemsCache.clear();

			if (initialData.size > 0) {
				begin();
				initialData.forEach((storedItem) => {
					validateJsonSerializable(storedItem.data, `load`);
					const key = getKey(storedItem.data);
					itemsCache.set(key, storedItem.data);
					write({ type: `insert`, value: storedItem.data });
				});
				commit();
			}

			// Mark collection as ready after initial load
			markReady();

			// Return cleanup function
			return () => {
				itemsCache.clear();
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
			storageType: `indexeddb`,
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
