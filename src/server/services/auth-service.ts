import { createSafe } from "@/lib/fn";
import type { UserService } from "./user-service";

const safe = createSafe((error) => {
	console.error("[AuthService Error]", error);
});

export class AuthService {
	private userService: UserService;

	constructor(userService: UserService) {
		this.userService = userService;
	}

	async register(email: string, password: string): Promise<string | null> {
		return safe(async () => {
			const existing = await this.userService.getByEmail(email);
			if (existing) return null;

			const hashedPassword = await Bun.password.hash(password);
			const userId = await this.userService.create(email, hashedPassword);
			return userId;
		}, null);
	}

	async verifyPassword(
		email: string,
		password: string,
	): Promise<string | null> {
		return safe(async () => {
			const existing = await this.userService.getByEmail(email);
			if (!existing) return null;

			const verified = await Bun.password.verify(password, existing.password);
			return verified ? existing.id : null;
		}, null);
	}
}
