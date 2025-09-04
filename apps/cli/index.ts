import { Command } from "commander";
import { createEntryService } from "./app/app";

const program = new Command();
const entryService = createEntryService();

program
	.name("journal")
	.description("A simple journaling CLI application")
	.version("0.1.0");

program
	.command("list")
	.description("List all journal entries")
	.action(entryService.listEntries);

program
	.command("create")
	.description("Create a new journal entry")
	.argument("<content>", "Content of the journal entry")
	.action((content) => {
		if (typeof content !== "string" || content.trim() === "") {
			console.error("Content must be a non-empty string.");
			process.exit(1);
		}
		entryService.createEntry(content);
	});

program.parse();
