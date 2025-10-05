import { jwt } from "@elysiajs/jwt";
import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { db } from "./db";
import { authRoutes } from "./routes/auth";
import { AuthService } from "./services/auth-service";
import { UserService } from "./services/user-service";

const app = new Elysia()
	.use(openapi())
	.use(
		jwt({
			name: "jwt",
			secret: "Fischl von Luftschloss Narfidort",
		}),
	)
	.decorate("userService", new UserService(db))
	.derive(({ userService }) => ({
		authService: new AuthService(userService),
	}))
	.get("/status", "ok");

authRoutes(app);

app.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
