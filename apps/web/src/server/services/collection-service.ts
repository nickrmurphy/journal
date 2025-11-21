import { createSafe } from "@journal/utils/fn";
import {
	type DematerializedObject,
	mergeValues as mergeStoreValues,
} from "@journal/utils/mergable-store";
import { and, eq } from "drizzle-orm";
import type { DB } from "../db";
import { collections } from "../db/schema";

const safe = createSafe((error) => {
	console.error("[CollectionService Error]", error);
});

export class CollectionService {
	constructor(private db: DB) {}

	async getValues(
		userId: string,
		key: string,
	): Promise<DematerializedObject[] | null> {
		return safe(async () => {
			const rows = await this.db
				.select({ value: collections.value })
				.from(collections)
				.where(and(eq(collections.key, key), eq(collections.userId, userId)));

			if (rows.length === 0) return null;

			const value = rows[0]!.value;
			const parsed: DematerializedObject[] = JSON.parse(value);
			return parsed;
		}, null);
	}

	async mergeValues(
		userId: string,
		key: string,
		values: DematerializedObject[],
	) {
		const current = await this.getValues(userId, key);

		if (!current) {
			this.setValues(userId, key, values);
			return;
		}

		const merged = mergeStoreValues([...current, ...values]);
		this.setValues(userId, key, merged);
	}

	private async setValues(
		userId: string,
		key: string,
		newValues: DematerializedObject[],
	): Promise<boolean> {
		return safe(async () => {
			const serialized = JSON.stringify(newValues);

			await this.db
				.insert(collections)
				.values({
					userId,
					key,
					value: serialized,
				})
				.onConflictDoUpdate({
					target: [collections.userId, collections.key],
					set: { value: serialized },
				});

			return true;
		}, false);
	}
}
