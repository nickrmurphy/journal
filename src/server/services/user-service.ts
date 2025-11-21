import { createSafe } from "@/lib/fn";
import { eq } from "drizzle-orm";
import type { DB } from "../db";
import { type User, users } from "../db/schema";

const safe = createSafe((error) => {
	console.error("[UserService Error]", error);
});

export class UserService {
	constructor(private db: DB) {}

	async getByEmail(email: string): Promise<User | null> {
		return safe(async () => {
			const rows = await this.db
				.select()
				.from(users)
				.where(eq(users.email, email));

			if (rows.length === 0) return null;

			return rows[0]!;
		}, null);
	}

	async create(email: string, password: string): Promise<string | null> {
		return safe(async () => {
			const id = crypto.randomUUID();

			await this.db.insert(users).values({
				id,
				email,
				password,
			});
			return id;
		}, null);
	}
}
