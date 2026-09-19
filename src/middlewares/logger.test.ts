import { describe, it, expect } from "vitest";
import { sanitizeBody } from "./logger.js";

describe("sanitizeBody", () => {
	it("returns undefined for falsy body values", () => {
		expect(sanitizeBody(undefined)).toBeUndefined();
		expect(sanitizeBody(null)).toBeUndefined();
		expect(sanitizeBody("")).toBeUndefined();
	});

	it("masks shallow sensitive keys", () => {
		const input = {
			username: "john_doe",
			password: "secretpassword",
			token: "xyz-token",
			accessToken: "access-123",
			secret: "my-secret",
		};

		const result = sanitizeBody(input);

		expect(result).toEqual({
			username: "john_doe",
			password: "MASKED",
			token: "MASKED",
			accessToken: "MASKED",
			secret: "MASKED",
		});
	});

	it("masks sensitive keys case-insensitively", () => {
		const input = {
			PASSWORD: "secretpassword",
			Token: "xyz-token",
			ACCESSTOKEN: "access-123",
			Secret: "my-secret",
		};

		const result = sanitizeBody(input);

		expect(result).toEqual({
			PASSWORD: "MASKED",
			Token: "MASKED",
			ACCESSTOKEN: "MASKED",
			Secret: "MASKED",
		});
	});

	it("masks deeply nested sensitive keys", () => {
		const input = {
			user: {
				profile: {
					name: "Alice",
					password: "nested_password",
				},
				auth: {
					tokens: {
						accessToken: "nested_access_token",
					},
				},
			},
		};

		const result = sanitizeBody(input);

		expect(result).toEqual({
			user: {
				profile: {
					name: "Alice",
					password: "MASKED",
				},
				auth: {
					tokens: {
						accessToken: "MASKED",
					},
				},
			},
		});
	});

	it("masks sensitive keys within arrays", () => {
		const input = {
			sessions: [
				{ id: 1, token: "token_1" },
				{ id: 2, token: "token_2" },
			],
		};

		const result = sanitizeBody(input);

		expect(result).toEqual({
			sessions: [
				{ id: 1, token: "MASKED" },
				{ id: 2, token: "MASKED" },
			],
		});
	});

	it("handles objects with Date instances without converting them to empty objects", () => {
		const date = new Date("2026-01-01T00:00:00.000Z");
		const input = {
			createdAt: date,
			token: "token_123",
		};

		const result = sanitizeBody(input);

		expect(result).toEqual({
			createdAt: "2026-01-01T00:00:00.000Z",
			token: "MASKED",
		});
	});

	it("handles circular references gracefully by falling back to the original body", () => {
		const circular: Record<string, any> = { name: "test" };
		circular.self = circular;

		expect(() => {
			const result = sanitizeBody(circular);
			expect(result).toBe(circular);
		}).not.toThrow();
	});

	it("supports custom sensitive keys", () => {
		const input = {
			apiKey: "key_12345",
			pin: "9999",
			username: "admin",
		};

		const result = sanitizeBody(input, ["apiKey", "pin"]);

		expect(result).toEqual({
			apiKey: "MASKED",
			pin: "MASKED",
			username: "admin",
		});
	});
});
