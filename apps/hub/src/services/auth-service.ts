import { createSafe } from "@journal/utils/fn";
import { eq } from "drizzle-orm";
import type { DB } from "../db";
import { type User, users } from "../db/schema";

const safe = createSafe((error) => {
	console.error("[AuthService Error]", error);
});

export class AuthService {
	constructor(private db: DB) {}

	private async getExistingUser(username: string): Promise<User | null> {
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

	private async createUser(
		username: string,
		password: string,
	): Promise<string | null> {
		return safe(async () => {
			const hashedPassword = await Bun.password.hash(password);
			const id = crypto.randomUUID();

			await this.db.insert(users).values({
				id,
				username,
				password: hashedPassword,
			});
			return id;
		}, null);
	}

	async register(username: string, password: string): Promise<string | null> {
		return safe(async () => {
			const existing = await this.getExistingUser(username);
			if (existing) return null;

			const userId = await this.createUser(username, password);
			return userId;
		}, null);
	}

	async verify(username: string, password: string): Promise<string | null> {
		return safe(async () => {
			const existing = await this.getExistingUser(username);
			if (!existing) return null;

			const verified = await Bun.password.verify(password, existing.password);
			return verified ? existing.id : null;
		}, null);
	}
}
