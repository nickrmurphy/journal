// Types for JSON data handling
export type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonObject
	| JsonArray;

export interface JsonObject {
	[key: string]: JsonValue;
}

export interface JsonArray extends Array<JsonValue> {}

// Result types for file operations
export interface FileReadSuccess {
	success: true;
	data: JsonValue;
	fileName: string;
	fileSize: number;
}

export interface FileReadError {
	success: false;
	error: string;
	code: "FILE_READ_ERROR" | "PARSE_ERROR" | "VALIDATION_ERROR" | "CANCELLED";
}

export type FileReadResult = FileReadSuccess | FileReadError;

// Type guards
export function isJsonObject(value: unknown): value is JsonObject {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isJsonArray(value: unknown): value is JsonArray {
	return Array.isArray(value);
}

export function isValidJsonValue(value: unknown): value is JsonValue {
	if (
		value === null ||
		typeof value === "string" ||
		typeof value === "number" ||
		typeof value === "boolean"
	) {
		return true;
	}
	if (isJsonArray(value)) {
		return value.every(isValidJsonValue);
	}
	if (isJsonObject(value)) {
		return Object.values(value).every(isValidJsonValue);
	}
	return false;
}

// File validation
function validateJsonFile(file: File): FileReadError | null {
	// Check file type
	if (
		!file.type.includes("json") &&
		!file.name.toLowerCase().endsWith(".json")
	) {
		return {
			success: false,
			error: "File must be a JSON file (.json extension)",
			code: "VALIDATION_ERROR",
		};
	}

	// Check file size (10MB limit)
	const maxSize = 10 * 1024 * 1024; // 10MB
	if (file.size > maxSize) {
		return {
			success: false,
			error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds 10MB limit`,
			code: "VALIDATION_ERROR",
		};
	}

	return null;
}

// Core file reading function
export async function readJsonFile(file: File): Promise<FileReadResult> {
	// Validate file first
	const validationError = validateJsonFile(file);
	if (validationError) {
		return validationError;
	}

	return new Promise((resolve) => {
		const reader = new FileReader();

		reader.onload = (event: ProgressEvent<FileReader>) => {
			try {
				const result = event.target?.result;

				if (typeof result !== "string") {
					resolve({
						success: false,
						error: "Failed to read file content as text",
						code: "FILE_READ_ERROR",
					});
					return;
				}

				// Parse JSON
				const parsedData: unknown = JSON.parse(result);

				// Validate parsed data
				if (!isValidJsonValue(parsedData)) {
					resolve({
						success: false,
						error: "File contains invalid JSON data types",
						code: "VALIDATION_ERROR",
					});
					return;
				}

				resolve({
					success: true,
					data: parsedData,
					fileName: file.name,
					fileSize: file.size,
				});
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Unknown parsing error";
				resolve({
					success: false,
					error: `Invalid JSON format: ${errorMessage}`,
					code: "PARSE_ERROR",
				});
			}
		};

		reader.onerror = () => {
			resolve({
				success: false,
				error: "Failed to read the selected file",
				code: "FILE_READ_ERROR",
			});
		};

		reader.readAsText(file);
	});
}

// Modern File System Access API approach (for supported browsers)
export async function selectAndReadJsonFile(): Promise<FileReadResult> {
	try {
		// Check if the File System Access API is supported
		if (!("showOpenFilePicker" in window)) {
			return {
				success: false,
				error: "File System Access API not supported in this browser",
				code: "VALIDATION_ERROR",
			};
		}

		const [fileHandle] = await (
			window as unknown as {
				showOpenFilePicker: (options?: {
					types?: Array<{
						description: string;
						accept: Record<string, string[]>;
					}>;
				}) => Promise<FileSystemFileHandle[]>;
			}
		).showOpenFilePicker({
			types: [
				{
					description: "JSON files",
					accept: {
						"application/json": [".json"],
					},
				},
			],
		});

		const file = await fileHandle?.getFile();
		return await readJsonFile(file!);
	} catch (error) {
		if (error instanceof Error && error.name === "AbortError") {
			return {
				success: false,
				error: "File selection was cancelled by user",
				code: "CANCELLED",
			};
		}

		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";
		return {
			success: false,
			error: `Failed to select file: ${errorMessage}`,
			code: "FILE_READ_ERROR",
		};
	}
}

// Helper function to create a file input element programmatically
export function createJsonFileInput(
	onSuccess: (result: FileReadSuccess) => void,
	onError: (error: FileReadError) => void,
): HTMLInputElement {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = ".json,application/json";
	input.style.display = "none";

	input.addEventListener("change", async (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) {
			onError({
				success: false,
				error: "No file was selected",
				code: "CANCELLED",
			});
			return;
		}

		const result = await readJsonFile(file);

		if (result.success) {
			onSuccess(result);
		} else {
			onError(result);
		}

		// Clear the input for future use
		input.value = "";
	});

	return input;
}

// Utility function to trigger file selection with traditional input
export async function triggerJsonFileSelection(): Promise<FileReadResult> {
	return new Promise((resolve) => {
		const input = createJsonFileInput(
			(success) => resolve(success),
			(error) => resolve(error),
		);

		document.body.appendChild(input);
		input.click();
		document.body.removeChild(input);
	});
}
