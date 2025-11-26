import type { Comment, Entry } from "@/schemas";
import { CommentSchema, EntrySchema } from "@/schemas";
import type { ImportData } from "./parse";
import { validateItem } from "./validate";

/**
 * Extracts attributes array from Starling document format
 * @param document - The Starling document with JSON:API format
 * @returns Array of attributes, or empty array if document is undefined
 */
export function extractAttributes<T>(
	document: { data: Array<{ attributes: T }> } | undefined,
): T[] {
	if (!document?.data) {
		return [];
	}

	return document.data.map((item) => item.attributes);
}

/**
 * Extracts and validates entries from import data
 * @param data - The import data containing entries
 * @returns Object with valid entries array and error count
 */
export function extractEntries(data: ImportData): {
	valid: Entry[];
	errors: number;
} {
	const attributes = extractAttributes(data.entries);
	const valid: Entry[] = [];
	let errors = 0;

	for (const item of attributes) {
		const result = validateItem(item, EntrySchema);
		if (result.success) {
			valid.push(result.data);
		} else {
			console.error("Failed to validate entry:", result.error);
			errors++;
		}
	}

	return { valid, errors };
}

/**
 * Extracts and validates comments from import data
 * @param data - The import data containing comments
 * @returns Object with valid comments array and error count
 */
export function extractComments(data: ImportData): {
	valid: Comment[];
	errors: number;
} {
	const attributes = extractAttributes(data.comments);
	const valid: Comment[] = [];
	let errors = 0;

	for (const item of attributes) {
		const result = validateItem(item, CommentSchema);
		if (result.success) {
			valid.push(result.data);
		} else {
			console.error("Failed to validate comment:", result.error);
			errors++;
		}
	}

	return { valid, errors };
}
