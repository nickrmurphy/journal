import { createSafe } from "@journal/utils/fn";
import { eq } from "drizzle-orm";
import type { DB } from "../db";
import { type User, users } from "../db/schema";

const safe = createSafe((error) => {
	console.error("[UserService Error]", error);
});

export class UserService {
	constructor(private db: DB) {}

	async getByUsername(username: string): Promise<User | null> {
		return safe(async () => {
			const rows = await this.db
				.select()
				.from(users)
				.where(eq(users.username, username));

			if (rows.length === 0) return null;

			// biome-ignore lint/style/noNonNullAssertion: <guard on length above>
			return rows[0]!;
		}, null);
	}

	async create(username: string, password: string): Promise<string | null> {
		return safe(async () => {
			const id = crypto.randomUUID();

			await this.db.insert(users).values({
				id,
				username,
				password,
			});
			return id;
		}, null);
	}
}
