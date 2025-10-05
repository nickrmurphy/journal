import { t } from "elysia";
import type { App } from "../index";

export const collectionRoutes = (app: App) =>
	app.group("/collection/:key", (app) =>
		app
			.post(
				"/",
				async ({ body, params, collectionService, set }) => {
					return collectionService.mergeValues("", params.key, body.data);
				},
				{
					body: t.Object({
						data: t.Array(
							t.Intersect([
								t.Object({
									__id: t.String(),
								}),
								t.Record(
									t.String(),
									t.Union([
										t.String(),
										t.Object({
											__value: t.Unknown(),
											__timestamp: t.String(),
										}),
									]),
								),
							]),
						),
					}),
				},
			)
			.get("/", async ({ collectionService, set, params }) => {
				return collectionService.getValues("", params.key);
			}),
	);
