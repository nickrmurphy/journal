import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import type { AsyncStorageApi } from "./async-local-storage";

/**
 * Creates a filesystem storage adapter using @capacitor/filesystem
 * @param subdirectory - Required subdirectory within Data directory for file isolation (e.g., "journal", "app-data")
 * @returns AsyncStorageApi implementation backed by device filesystem
 */
export function createFileSystemAdapter(subdirectory: string): AsyncStorageApi {
	// Helper function to construct the full path
	const getPath = (key: string) => `${subdirectory}/${key}.json`;

	return {
		getItem: async (key: string) => {
			try {
				const result = await Filesystem.readFile({
					path: getPath(key),
					directory: Directory.Data,
					encoding: Encoding.UTF8,
				});
				return result.data as string;
			} catch {
				// File doesn't exist, return null (consistent with localStorage behavior)
				return null;
			}
		},
		setItem: async (key: string, value: string) => {
			await Filesystem.writeFile({
				path: getPath(key),
				data: value,
				directory: Directory.Data,
				encoding: Encoding.UTF8,
				recursive: true,
			});
		},
		removeItem: async (key: string) => {
			try {
				await Filesystem.deleteFile({
					path: getPath(key),
					directory: Directory.Data,
				});
			} catch {
				// File doesn't exist, silently ignore (consistent with localStorage behavior)
			}
		},
		clear: async () => {
			try {
				// Read files in the specific subdirectory
				const result = await Filesystem.readdir({
					path: subdirectory,
					directory: Directory.Data,
				});

				// Delete all .json files in this subdirectory only
				const deletePromises = result.files
					.filter((file) => file.name.endsWith(".json"))
					.map((file) =>
						Filesystem.deleteFile({
							path: `${subdirectory}/${file.name}`,
							directory: Directory.Data,
						}).catch(() => {
							// Ignore individual file deletion errors
						}),
					);

				await Promise.all(deletePromises);
			} catch {
				// Directory doesn't exist or other error, silently ignore
			}
		},
	};
}
