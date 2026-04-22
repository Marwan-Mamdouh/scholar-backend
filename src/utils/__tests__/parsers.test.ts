import { describe, it, expect } from "vitest";
import { parseCSVRow } from "../parsers.js";

describe("parseCSVRow", () => {
	describe("basic CSV parsing", () => {
		it("should parse simple comma-separated values", () => {
			const result = parseCSVRow("name,age,city");
			expect(result).toEqual(["name", "age", "city"]);
		});

		it("should handle single value", () => {
			const result = parseCSVRow("single");
			expect(result).toEqual(["single"]);
		});

		it("should parse multiple fields with various data types", () => {
			const result = parseCSVRow("John,30,New York,true");
			expect(result).toEqual(["John", "30", "New York", "true"]);
		});
	});

	describe("quoted field handling", () => {
		it("should handle quoted fields with embedded commas", () => {
			const result = parseCSVRow('"Smith, Jr.",John,30');
			expect(result).toEqual(["Smith, Jr.", "John", "30"]);
		});

		it("should handle multiple quoted fields", () => {
			const result = parseCSVRow('"Last, First","City, State","Country"');
			expect(result).toEqual(["Last, First", "City, State", "Country"]);
		});

		it("should preserve quotes content exactly", () => {
			const result = parseCSVRow('"John, Jr.","Dr. Jane, PhD"');
			expect(result).toEqual(["John, Jr.", "Dr. Jane, PhD"]);
		});

		it("should handle mixed quoted and unquoted fields", () => {
			const result = parseCSVRow('name,"Smith, Jr.",30,city');
			expect(result).toEqual(["name", "Smith, Jr.", "30", "city"]);
		});
	});

	describe("whitespace handling", () => {
		it("should trim leading and trailing whitespace from fields", () => {
			const result = parseCSVRow("  name  ,  age  ,  city  ");
			expect(result).toEqual(["name", "age", "city"]);
		});

		it("should trim whitespace from quoted fields", () => {
			const result = parseCSVRow('"  quoted value  ", "  another  "');
			expect(result).toEqual(["quoted value", "another"]);
		});

		it("should preserve internal spaces", () => {
			const result = parseCSVRow("First Name, Last Name, Middle Name");
			expect(result).toEqual(["First Name", "Last Name", "Middle Name"]);
		});

		it("should handle spaces around quotes", () => {
			const result = parseCSVRow('  "quoted" , unquoted ,  "another quoted"  ');
			expect(result).toEqual(["quoted", "unquoted", "another quoted"]);
		});
	});

	describe("empty fields", () => {
		it("should handle empty fields", () => {
			const result = parseCSVRow("name,,city");
			expect(result).toEqual(["name", "", "city"]);
		});

		it("should handle multiple consecutive empty fields", () => {
			const result = parseCSVRow("a,,,d");
			expect(result).toEqual(["a", "", "", "d"]);
		});

		it("should handle empty string", () => {
			const result = parseCSVRow("");
			expect(result).toEqual([""]);
		});

		it("should handle only commas", () => {
			const result = parseCSVRow(",,,");
			expect(result).toEqual(["", "", "", ""]);
		});
	});

	describe("complex edge cases", () => {
		it("should handle quoted empty fields", () => {
			const result = parseCSVRow('"",name,""');
			expect(result).toEqual(["", "name", ""]);
		});

		it("should handle unclosed quotes gracefully", () => {
			// Note: The implementation treats unclosed quotes by toggling state
			// This tests the actual behavior
			const result = parseCSVRow('name,"unclosed');
			expect(result).toEqual(["name", "unclosed"]);
		});

		it("should toggle quote state in middle of field", () => {
			// Quote toggles state but is not included in output
			const result = parseCSVRow('test"quote,value');
			expect(result).toEqual(["testquote,value"]);
		});

		it("should handle real-world CSV example", () => {
			const csv = 'John Doe,"New York, NY",john@example.com,30';
			const result = parseCSVRow(csv);
			expect(result).toEqual([
				"John Doe",
				"New York, NY",
				"john@example.com",
				"30",
			]);
		});

		it("should handle fields with numbers and special characters", () => {
			const result = parseCSVRow('123,"456, 789",abc-def,@special');
			expect(result).toEqual(["123", "456, 789", "abc-def", "@special"]);
		});

		it("should handle long CSV row with many fields", () => {
			const longRow = Array(100).fill("field").join(",");
			const result = parseCSVRow(longRow);
			expect(result).toHaveLength(100);
			expect(result.every((f) => f === "field")).toBe(true);
		});

		it("should handle trailing comma", () => {
			const result = parseCSVRow("name,age,city,");
			expect(result).toEqual(["name", "age", "city", ""]);
		});

		it("should handle leading comma", () => {
			const result = parseCSVRow(",name,age,city");
			expect(result).toEqual(["", "name", "age", "city"]);
		});

		it("should trim tabs as whitespace", () => {
			const result = parseCSVRow("name\t,\tage\t,\tcity");
			expect(result).toEqual(["name", "age", "city"]);
		});

		it("should handle quoted fields with quotes inside", () => {
			// This tests how the function handles quotes within quotes
			// The behavior depends on quote toggle logic
			const result = parseCSVRow('"field"with"quotes"');
			// First quote toggles on, second toggles off, third toggles on, etc.
			expect(result).toHaveLength(1);
		});
	});

	describe("real-world scenarios", () => {
		it("should parse Excel export with proper quoting", () => {
			const result = parseCSVRow(
				'"Smith, John","123 Main St, Apt 4","New York",NY',
			);
			expect(result).toEqual([
				"Smith, John",
				"123 Main St, Apt 4",
				"New York",
				"NY",
			]);
		});

		it("should handle names with titles", () => {
			const result = parseCSVRow(
				'"Dr. Jane Smith",Professor,"45 Oak Rd, Suite 200"',
			);
			expect(result).toEqual([
				"Dr. Jane Smith",
				"Professor",
				"45 Oak Rd, Suite 200",
			]);
		});

		it("should parse company data row", () => {
			const result = parseCSVRow('Acme Corp,"San Francisco, CA",tech,500-1000');
			expect(result).toEqual([
				"Acme Corp",
				"San Francisco, CA",
				"tech",
				"500-1000",
			]);
		});

		it("should handle URLs in fields", () => {
			const result = parseCSVRow(
				'company,"https://example.com",john@example.com',
			);
			expect(result).toEqual([
				"company",
				"https://example.com",
				"john@example.com",
			]);
		});

		it("should handle dates and formatted numbers", () => {
			const result = parseCSVRow('2024-01-15,"1,234,567.89","1/1/2024"');
			expect(result).toEqual(["2024-01-15", "1,234,567.89", "1/1/2024"]);
		});
	});
});
