import { isSameDay, isWithinInterval } from "date-fns";
import { useMemo } from "react";
import { z } from "zod";
import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import { Entry } from "../domains/entry";
import {
	JournalEntryCommentSchema,
	JournalEntrySchema,
} from "../schemas/journal";
import type {
	CreateJournalEntry,
	JournalEntry,
	JournalEntryComment,
} from "../types";
import { createStorage } from "./persist";

type JournalEntriesState = {
	entries: { [key: string]: JournalEntry };
	comments: { [key: string]: JournalEntryComment };
	addEntry: (entry: CreateJournalEntry) => string | undefined;
	addComment: (entryId: string, content: string) => string | undefined;
	getEntryComments: (entryId: string) => JournalEntryComment[];
	getEntriesOnDate: (date: string) => JournalEntry[];
	getEntriesInRange: (start: string, end: string) => JournalEntry[];
};

const createJournalEntryState: StateCreator<JournalEntriesState> = (
	set,
	get,
) => ({
	entries: {},
	comments: {},
	addEntry: (entry: CreateJournalEntry) => {
		try {
			const validatedEntry = Entry.make(entry);
			set((state) => ({
				entries: {
					...state.entries,
					[validatedEntry.id]: validatedEntry,
				},
			}));

			return validatedEntry.id;
		} catch (error) {
			console.error("Failed to add entry:", error);
			return undefined;
		}
	},
	addComment: (entryId: string, content: string) => {
		try {
			const comment = Entry.makeComment(entryId, content);

			set((state) => {
				const entry = state.entries[entryId];
				if (!entry) {
					console.error(`Entry with ID ${entryId} not found`);
					return state;
				}

				return {
					comments: {
						...state.comments,
						[comment.id]: comment,
					},
				};
			});

			return comment.id;
		} catch (error) {
			console.error("Failed to add comment:", error);
			return undefined;
		}
	},
	getEntryComments: (entryId: string) => {
		const { comments } = get();
		return Object.values(comments).filter(
			(comment) => comment.entryId === entryId,
		);
	},
	getEntriesOnDate: (date: string) => {
		const { entries } = get();
		return Object.values(entries)
			.filter((e) => isSameDay(date, e.createdAt))
			.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	},
	getEntriesInRange: (start: string, end: string) => {
		const { entries } = get();
		return Object.values(entries)
			.filter((e) =>
				isWithinInterval(new Date(e.createdAt), {
					start: new Date(start),
					end: new Date(end),
				}),
			)
			.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	},
});

const useJournalEntries = create(
	persist(createJournalEntryState, {
		name: "journal-entries",
		storage: createStorage(),
		partialize: (state) => ({
			entries: state.entries,
			comments: state.comments,
		}),
	}),
);

export const useEntriesOnDate = (date: string) =>
	useJournalEntries(useShallow((state) => state.getEntriesOnDate(date)));

export const useEntryComments = (entryId: string) =>
	useJournalEntries(useShallow((state) => state.getEntryComments(entryId)));

export const useEntriesInRange = (start: string, end: string) => {
	const entries = useJournalEntries(
		useShallow((state) => state.getEntriesInRange(start, end)),
	);

	return useMemo(() => {
		const grouped = Object.groupBy(
			entries,
			// biome-ignore lint/style/noNonNullAssertion: <Always defined>
			(entry) => new Date(entry.createdAt).toISOString().split("T")[0]!,
		);
		return Object.entries(grouped).map(([date, entries]) => ({
			date,
			entries: entries || [],
		}));
	}, [entries]);
};

type ExportData = {
	version: string;
	exportedAt: string;
	appVersion?: string;
	data: {
		entries: { [key: string]: JournalEntry };
		comments: { [key: string]: JournalEntryComment };
	};
};

const ExportDataSchema = z.object({
	version: z.string(),
	exportedAt: z.string(),
	appVersion: z.string().optional(),
	data: z.object({
		entries: z.record(z.string(), JournalEntrySchema),
		comments: z.record(z.string(), JournalEntryCommentSchema),
	}),
});

type ImportResult = {
	success: boolean;
	imported: { entries: number; comments: number };
	skipped: { entries: number; comments: number };
	errors: string[];
};

const exportJournalData = (): string => {
	const { entries, comments } = useJournalEntries.getState();

	const exportData: ExportData = {
		version: "1.0.0",
		exportedAt: new Date().toISOString(),
		appVersion: "0.0.1",
		data: {
			entries,
			comments,
		},
	};

	return JSON.stringify(exportData, null, 2);
};

const downloadJournalData = () => {
	const jsonData = exportJournalData();
	const blob = new Blob([jsonData], { type: "application/json" });
	const url = URL.createObjectURL(blob);

	const link = document.createElement("a");
	link.href = url;
	link.download = `journal-export-${new Date().toISOString().split("T")[0]}.json`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
};

const importJournalData = async (file: File): Promise<ImportResult> => {
	const result: ImportResult = {
		success: false,
		imported: { entries: 0, comments: 0 },
		skipped: { entries: 0, comments: 0 },
		errors: [],
	};

	try {
		// Read and parse file
		const text = await file.text();
		const jsonData = JSON.parse(text);

		// Validate against schema
		const validatedData = ExportDataSchema.parse(jsonData);

		// Get current state
		const currentState = useJournalEntries.getState();
		const mergedEntries = { ...currentState.entries };
		const mergedComments = { ...currentState.comments };

		// Process entries (merge, skip on conflict)
		for (const [id, entry] of Object.entries(validatedData.data.entries)) {
			if (mergedEntries[id]) {
				result.skipped.entries++;
			} else {
				mergedEntries[id] = entry;
				result.imported.entries++;
			}
		}

		// Process comments (skip if referencing non-existent entries or conflicts)
		for (const [id, comment] of Object.entries(validatedData.data.comments)) {
			if (!mergedEntries[comment.entryId]) {
				result.skipped.comments++;
				result.errors.push(
					`Comment ${id} references non-existent entry ${comment.entryId}`,
				);
				continue;
			}

			if (mergedComments[id]) {
				result.skipped.comments++;
			} else {
				mergedComments[id] = comment;
				result.imported.comments++;
			}
		}

		// Update state atomically
		useJournalEntries.setState({
			entries: mergedEntries,
			comments: mergedComments,
		});

		result.success = true;
	} catch (error) {
		result.errors.push(
			error instanceof Error ? error.message : "Unknown error occurred",
		);
	}

	return result;
};

const importFromFile = (): Promise<ImportResult | null> => {
	return new Promise((resolve) => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".json";
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				const result = await importJournalData(file);
				resolve(result);
			} else {
				resolve(null);
			}
		};
		input.click();
	});
};

export {
	useJournalEntries,
	exportJournalData,
	downloadJournalData,
	importJournalData,
	importFromFile,
	type ImportResult,
};
