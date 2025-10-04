import { expect, test } from "bun:test";
import { createSafe, safe } from "./safe";

test("returns function result when no error is thrown", () => {
	const result = safe(() => 42, 0);
	expect(result).toBe(42);
});

test("returns default value when function throws", () => {
	const result = safe(() => {
		throw new Error("Something went wrong");
	}, false);
	expect(result).toBe(false);
});

test("preserves return type from function", () => {
	const result = safe(() => "hello", null);
	expect(result).toBe("hello");
});

test("handles complex return types", () => {
	const user = { id: 1, name: "John" };
	const result = safe(() => user, null);
	expect(result).toEqual(user);
});

test("returns null default when object throws", () => {
	const result = safe(() => {
		throw new Error("User not found");
	}, null);
	expect(result).toBe(null);
});

test("works with different return and default types", () => {
	const result = safe(() => 123, "error");
	expect(result).toBe(123);

	const errorResult = safe(() => {
		throw new Error("Failed");
	}, "error");
	expect(errorResult).toBe("error");
});

test("createSafe returns a safe function", () => {
	const customSafe = createSafe();
	const result = customSafe(() => 42, 0);
	expect(result).toBe(42);
});

test("createSafe middleware is called on error", () => {
	let capturedError: unknown = null;
	const customSafe = createSafe((error) => {
		capturedError = error;
	});

	const error = new Error("Test error");
	const result = customSafe(() => {
		throw error;
	}, "default");

	expect(result).toBe("default");
	expect(capturedError).toBe(error);
});

test("createSafe middleware is NOT called on success", () => {
	let middlewareCalled = false;
	const customSafe = createSafe(() => {
		middlewareCalled = true;
	});

	const result = customSafe(() => "success", "default");

	expect(result).toBe("success");
	expect(middlewareCalled).toBe(false);
});

test("createSafe middleware receives the actual error", () => {
	let capturedMessage = "";
	const customSafe = createSafe((error) => {
		if (error instanceof Error) {
			capturedMessage = error.message;
		}
	});

	customSafe(() => {
		throw new Error("Custom error message");
	}, null);

	expect(capturedMessage).toBe("Custom error message");
});

test("createSafe without middleware works like default safe", () => {
	const customSafe = createSafe();

	const successResult = customSafe(() => 42, 0);
	expect(successResult).toBe(42);

	const errorResult = customSafe(() => {
		throw new Error("Error");
	}, "default");
	expect(errorResult).toBe("default");
});
