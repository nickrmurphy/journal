/**
 * Downloads a JSON file with the given content and filename
 * @param content - The string content to download
 * @param filename - The name of the file to download
 */
export function downloadFile(content: string, filename: string): void {
	const blob = new Blob([content], { type: "application/json;charset=utf-8" });
	const url = URL.createObjectURL(blob);

	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.style.display = "none";

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	// Clean up the object URL
	URL.revokeObjectURL(url);
}
