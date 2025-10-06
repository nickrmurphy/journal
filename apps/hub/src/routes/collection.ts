import { zValidator } from "@hono/zod-validator";
import type { DematerializedObject } from "@journal/utils/mergable-store";
import { Hono } from "hono";
import { type JwtVariables, jwt } from "hono/jwt";
import { z } from "zod";
import { collectionService } from "../services";

const dematerializedObjectSchema: z.ZodType<DematerializedObject> =
	z.intersection(
		z.object({
			__id: z.string(),
		}),
		z.record(
			z.string(),
			z.union([
				z.string(),
				z.object({
					__value: z.unknown(),
					__timestamp: z.string(),
				}),
			]),
		),
	);

const collection = new Hono<{ Variables: JwtVariables }>();

collection.use(
	"*",
	jwt({
		secret: process.env.JWT_SECRET,
	}),
);

collection.post(
	"/:key",
	zValidator(
		"json",
		z.object({
			data: z.array(dematerializedObjectSchema),
		}),
	),
	async (c) => {
		const body = c.req.valid("json");
		const { key } = c.req.param();
		const jwt = c.get("jwtPayload");

		await collectionService.mergeValues(jwt.sub, key, body.data);

		return c.json({ success: true });
	},
);

collection.get("/:key", async (c) => {
	const { key } = c.req.param();
	const jwt = c.get("jwtPayload");

	const data = await collectionService.getValues(jwt.sub, key);

	if (!data) {
		return c.json({ data: [] }, 200);
	}

	return c.json({ data }, 200);
});

export default collection;
