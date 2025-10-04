import { sql } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";

export const users = t.sqliteTable("users", {
	id: t
		.text()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	username: t.text().notNull().unique(),
	password: t.text().notNull(),
	createdAt: t.text().default(sql`CURRENT_TIMESTAMP`),
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
		createdAt: t.text().default(sql`CURRENT_TIMESTAMP`),
	},
	(collections) => [t.unique().on(collections.userId, collections.key)],
);
