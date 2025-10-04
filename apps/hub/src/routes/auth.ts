import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { z } from "zod";
import { authService } from "../services";

const auth = new Hono();

const authValidator = zValidator(
	"json",
	z.object({
		email: z.email().min(3).max(26),
		password: z.string().min(8).max(64),
	}),
);

auth.post("/register", authValidator, async (c) => {
	const body = c.req.valid("json");

	const userId = await authService.register(body.email, body.password);

	if (!userId) {
		return c.json({ error: "Registration failed" }, 500);
	}

	return c.json({ userId }, 201);
});

auth.post("/login", authValidator, async (c) => {
	const body = c.req.valid("json");

	const userId = await authService.verifyPassword(body.email, body.password);

	if (!userId) {
		return c.json({ error: "Invalid credentials" }, 401);
	}

	const token = await sign(
		{
			sub: userId,
		},
		process.env.JWT_SECRET,
	);

	return c.json({ token }, 200);
});

export default auth;
