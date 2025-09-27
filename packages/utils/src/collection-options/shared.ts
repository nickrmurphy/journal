import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { BaseCollectionConfig } from "@tanstack/react-db";
import type { AsyncStorageApi } from "../storage-adapters";

// Shared serialization functions
export const serialize = <T>(items: T[]): string => JSON.stringify(items);

export const deserialize = <T>(data: string): T[] => {
	try {
		const parsed = JSON.parse(data);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

// Shared types
export type SyncFunctions<T> = {
	syncWrite?: (message: {
		type: "insert" | "update" | "delete";
		value: T;
	}) => void;
	syncBegin?: () => void;
	syncCommit?: () => void;
};

export interface BaseCollectionConfigWithoutHandlers<
	T extends object,
	TKey extends string | number,
	TSchema extends StandardSchemaV1,
> extends Omit<
		BaseCollectionConfig<T, TKey, TSchema>,
		"onInsert" | "onUpdate" | "onDelete"
	> {
	storageKey: string;
	storage: AsyncStorageApi;
	schema: TSchema;
}

// Shared sync write-back helpers
export const writeSyncUpdates = <T>(
	sync: SyncFunctions<T>,
	items: T[],
	operation: "insert" | "update",
): void => {
	if (sync.syncBegin && sync.syncWrite && sync.syncCommit) {
		sync.syncBegin();
		for (const item of items) {
			sync.syncWrite({ type: operation, value: item });
		}
		sync.syncCommit();
	}
};

export const writeSyncDeletion = <T>(sync: SyncFunctions<T>): void => {
	if (sync.syncBegin && sync.syncCommit) {
		sync.syncBegin();
		// For deletions, we skip the write-back since we don't have the full item
		// The sync mechanism will handle the deletion properly
		sync.syncCommit();
	}
};
