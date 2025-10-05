import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";

const sqlite = new Database("local.db");
export const db = drizzle(sqlite, { schema, casing: "snake_case" });
export type DB = typeof db;
