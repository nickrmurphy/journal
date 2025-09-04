import { createSystemClock } from "@journal/crdt/clock";
import { createBunPersister } from "@journal/crdt/persistence/bun";
import { createStore, withPersistence } from "@journal/crdt/store";
import type { Entry } from "@journal/schema";
import { createEntryService } from "@journal/services";
import { Command } from "commander";

const clockProvider = createSystemClock();
const persistenceProvider = createBunPersister({
	dbPath: "sqlite://journal.db",
});
const store = createStore<Record<string, Entry>>({
	clockProvider,
});
const entryStore = withPersistence(store, {
	key: "entries",
	persistenceProvider,
});

const program = new Command();
const entryService = createEntryService(entryStore);

program
	.name("journal")
	.description("A simple journaling CLI application")
	.version("0.1.0");

program
	.command("list")
	.description("List all journal entries")
	.action(async () => {
		const entries = await entryService.getEntries();
		if (entries) {
			console.log("Entries:");
			Object.values(entries).forEach((entry) => console.log(entry));
		} else {
			console.log("No entries found.");
		}
	});

program
	.command("create")
	.description("Create a new journal entry")
	.argument("<content>", "Content of the journal entry")
	.action((content) => {
		const result = entryService.createEntry(content);
		if (result.ok) {
			console.log("Entry created successfully.");
		} else {
			console.error("Failed to create entry:", result.error);
		}
	});

program.parse();
