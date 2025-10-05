import { t } from "elysia";
import type { App } from "../index";

export const authRoutes = (app: App) =>
	app.group(
		"/auth",
		{
			body: t.Object({
				username: t.String({ minLength: 3, maxLength: 26 }),
				password: t.String({
					minLength: 8,
					maxLength: 64,
				}),
			}),
		},
		(app) =>
			app
				.post("/register", async ({ body, authService, set }) => {
					const userId = await authService.register(
						body.username,
						body.password,
					);
					if (!userId) {
						set.status = 500;
						return;
					}

					set.status = 201;
					return {
						userId,
					};
				})
				.post("/login", async ({ body, authService, set, jwt }) => {
					const userId = await authService.verify(body.username, body.password);
					if (!userId) {
						set.status = 500;
						return;
					}

					set.status = 200;
					return jwt.sign({
						userId,
					});
				}),
	);
