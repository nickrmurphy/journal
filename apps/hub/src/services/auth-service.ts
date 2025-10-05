import { createSafe } from "@journal/utils/fn";
import type { UserService } from "./user-service";

const safe = createSafe((error) => {
	console.error("[AuthService Error]", error);
});

export class AuthService {
	private userService: UserService;

	constructor(userService: UserService) {
		this.userService = userService;
	}

	async register(username: string, password: string): Promise<string | null> {
		return safe(async () => {
			const existing = await this.userService.getByUsername(username);
			if (existing) return null;

			const hashedPassword = await Bun.password.hash(password);
			const userId = await this.userService.create(username, hashedPassword);
			return userId;
		}, null);
	}

	async verify(username: string, password: string): Promise<string | null> {
		return safe(async () => {
			const existing = await this.userService.getByUsername(username);
			if (!existing) return null;

			const verified = await Bun.password.verify(password, existing.password);
			return verified ? existing.id : null;
		}, null);
	}
}
