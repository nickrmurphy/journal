import { sql } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import type z from "zod/v4";

export const users = t.sqliteTable("users", {
	id: t
		.text()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	email: t.text().notNull().unique(),
	password: t.text().notNull(),
	createdAt: t.text().notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const collections = t.sqliteTable(
	"collections",
	{
		id: t
			.text()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: t
			.text()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		key: t.text().notNull(),
		value: t.text().notNull(),
		createdAt: t.text().notNull().default(sql`CURRENT_TIMESTAMP`),
	},
	(collections) => [t.unique().on(collections.userId, collections.key)],
);

const UserSchema = createSelectSchema(users);
export type User = z.infer<typeof UserSchema>;
