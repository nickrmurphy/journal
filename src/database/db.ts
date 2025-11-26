import { createDatabase } from "@byearlybird/starling";
import { idbPlugin } from "@byearlybird/starling/plugin-idb";
import { CommentSchema } from "../schemas/comment";
import { EntrySchema } from "../schemas/entry";

export const db = createDatabase({
	name: "journal",
	version: 1,
	schema: {
		entries: {
			schema: EntrySchema,
			getId: (entry) => entry.id,
		},
		comments: {
			schema: CommentSchema,
			getId: (comment) => comment.id,
		},
	},
}).use(idbPlugin({ version: 1, useBroadcastChannel: true }));

// Initialize with IndexedDB plugin
export const initDatabase = async () => {
	await db.init();
	return db;
};
