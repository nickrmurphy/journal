import { createSystemClock } from "@journal/crdt/clock";
import { createBunPersister } from "@journal/crdt/persistence/bun";
import { createStore, withPersistence } from "@journal/crdt/store";
import type { Entry } from "./types";

export const entryStore = withPersistence(
	createStore<Record<string, Entry>>({
		clockProvider: createSystemClock(),
	}),
	{
		key: "entries",
		persistenceProvider: createBunPersister({ dbPath: "sqlite://journal.db" }),
	},
);

export type EntryStore = typeof entryStore;
