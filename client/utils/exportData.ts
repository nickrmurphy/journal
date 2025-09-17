import type { Entry } from "../collections/entries";
import type { EntryComment } from "../collections/entryComments";

export function exportJournalData(
	entries: Entry[],
	entryComments: EntryComment[],
): void {
	// Group comments by entryId for efficient join
	const commentsByEntryId = new Map<string, EntryComment[]>();
	for (const c of entryComments) {
		const list = commentsByEntryId.get(c.entryId) ?? [];
		list.push(c);
		commentsByEntryId.set(c.entryId, list);
	}

	// Join comments to their respective entries via entryComment.entryId -> entry.id
	const joined = entries.map((entry) => ({
		...entry,
		comments: commentsByEntryId.get(entry.id) ?? [],
	}));

	// Create a JSON blob and trigger a download
	const json = JSON.stringify(joined, null, 2);
	const blob = new Blob([json], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
	a.href = url;
	a.download = `journal-export-${timestamp}.json`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
