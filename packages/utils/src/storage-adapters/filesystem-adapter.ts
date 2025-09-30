import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import type { AsyncStorageApi } from "./types";

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
			} catch (error) {
				console.error(`[FilesystemAdapter] Failed to read ${key}:`, error);
				return null;
			}
		},
		setItem: async (key: string, value: string) => {
			try {
				await Filesystem.requestPermissions();
				await Filesystem.writeFile({
					path: getPath(key),
					data: value,
					directory: Directory.Documents,
					encoding: Encoding.UTF8,
					recursive: true,
				});
			} catch (error) {
				console.error(`[FilesystemAdapter] Failed to write ${key}:`, error);
				throw error;
			}
		},
		removeItem: async (key: string) => {
			try {
				await Filesystem.deleteFile({
					path: getPath(key),
					directory: Directory.Documents,
				});
			} catch (error) {
				console.error(`[FilesystemAdapter] Failed to delete ${key}:`, error);
			}
		},
		clear: async () => {
			try {
				// Read files in the specific subdirectory
				const result = await Filesystem.readdir({
					path: subdirectory,
					directory: Directory.Documents,
				});

				// Delete all .json files in this subdirectory only
				const deletePromises = result.files
					.filter((file) => file.name.endsWith(".json"))
					.map((file) =>
						Filesystem.deleteFile({
							path: `${subdirectory}/${file.name}`,
							directory: Directory.Documents,
						}).catch((error) => {
							console.error(
								`[FilesystemAdapter] Failed to delete ${file.name}:`,
								error,
							);
						}),
					);

				await Promise.all(deletePromises);
			} catch (error) {
				console.error(
					`[FilesystemAdapter] Failed to clear ${subdirectory}:`,
					error,
				);
			}
		},
	};
}
