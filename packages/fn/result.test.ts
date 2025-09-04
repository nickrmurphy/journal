import { describe, expect, it } from "bun:test";
import { err, ok } from "./result";

describe("Result utilities", () => {
	describe("ok", () => {
		it("creates Ok object with correct tag and data", () => {
			const result = ok("test data");
			expect(result).toEqual({
				data: "test data",
				tag: "ok",
			});
		});

		it("works with different data types", () => {
			const numberResult = ok(42);
			const objectResult = ok({
				key: "value",
			});

			expect(numberResult.tag).toBe("ok");
			expect(numberResult.data).toBe(42);
			expect(objectResult.tag).toBe("ok");
			expect(objectResult.data).toEqual({
				key: "value",
			});
		});
	});

	describe("err", () => {
		it("creates Err object with correct tag and error", () => {
			const result = err("error message");
			expect(result).toEqual({
				error: "error message",
				tag: "err",
			});
		});

		it("works with different error types", () => {
			const stringError = err("string error");
			const objectError = err({
				code: 500,
				message: "Server error",
			});

			expect(stringError.tag).toBe("err");
			expect(stringError.error).toBe("string error");
			expect(objectError.tag).toBe("err");
			expect(objectError.error).toEqual({
				code: 500,
				message: "Server error",
			});
		});
	});

	describe("type discrimination", () => {
		it("can discriminate between ok and err using tag", () => {
			const okResult = ok("success");
			const errResult = err("failure");

			if (okResult.tag === "ok") {
				expect(okResult.data).toBe("success");
			}

			if (errResult.tag === "err") {
				expect(errResult.error).toBe("failure");
			}
		});
	});

	describe("edge cases", () => {
		it("handles null and undefined values in ok", () => {
			const nullResult = ok(null);
			const undefinedResult = ok(undefined);

			expect(nullResult.tag).toBe("ok");
			expect(nullResult.data).toBe(null);
			expect(undefinedResult.tag).toBe("ok");
			expect(undefinedResult.data).toBe(undefined);
		});

		it("handles null and undefined values in err", () => {
			const nullResult = err(null);
			const undefinedResult = err(undefined);

			expect(nullResult.tag).toBe("err");
			expect(nullResult.error).toBe(null);
			expect(undefinedResult.tag).toBe("err");
			expect(undefinedResult.error).toBe(undefined);
		});

		it("handles empty values", () => {
			const emptyString = ok("");
			const emptyArray = ok([]);
			const emptyObject = ok({});

			expect(emptyString.data).toBe("");
			expect(emptyArray.data).toEqual([]);
			expect(emptyObject.data).toEqual({});
		});
	});
});
