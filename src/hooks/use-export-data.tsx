import { db } from "@/database";

/**
 * Hook for exporting journal data to JSON file
 * Creates a downloadable JSON file with all entries and comments
 *
 * @returns Function to trigger export workflow
 *
 * @example
 * const handleExport = useExportData();
 *
 * // Later, when user clicks export button:
 * <button onClick={handleExport}>Export data</button>
 */
export function useExportData(): () => void {
	return () => {
		const docs = db.toDocuments();
		const dataStr =
			"data:text/json;charset=utf-8," +
			encodeURIComponent(JSON.stringify(docs, null, 2));
		const downloadAnchorNode = document.createElement("a");
		downloadAnchorNode.setAttribute("href", dataStr);
		downloadAnchorNode.setAttribute("download", "journal-data.json");
		document.body.appendChild(downloadAnchorNode); // required for firefox
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	};
}
