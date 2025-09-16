import { expect, test } from "bun:test";
import type { CreateJournalEntry } from "../../types/index.js";
import { Entry } from "./entry.js";

test("Entry.make creates a valid journal entry", () => {
	const createData: CreateJournalEntry = {
		content: "Test entry content",
	};

	const entry = Entry.make(createData);

	expect(entry.content).toBe("Test entry content");
	expect(entry.id).toBeDefined();
	expect(entry.createdAt).toBeDefined();
	expect(entry.comments).toEqual([]);
});

test("Entry.makeComment creates a valid comment", () => {
	const comment = Entry.makeComment("Test comment");

	expect(comment.content).toBe("Test comment");
	expect(comment.id).toBeDefined();
	expect(comment.createdAt).toBeDefined();
});

test("Entry.addComment adds a comment to an entry", () => {
	const createData: CreateJournalEntry = {
		content: "Test entry content",
	};

	const entry = Entry.make(createData);
	const comment = Entry.makeComment("Test comment");
	const entryWithComment = Entry.addComment(entry, comment);

	expect(entryWithComment.comments).toHaveLength(1);
	expect(entryWithComment.comments[0]).toBe(comment);
});
