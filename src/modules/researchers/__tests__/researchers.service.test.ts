import { describe, it, expect, vi, beforeEach } from "vitest";
import researchersService from "../researchers.service.js";
import supabase from "../../../lib/db.js";
import axios from "axios";

vi.mock("../../../lib/db.js", () => ({
	default: {
		from: vi.fn(() => ({
			select: vi.fn(() => ({
				eq: vi.fn(() => ({
					single: vi.fn(() => Promise.resolve({ data: null, error: null })),
				})),
			})),
			delete: vi.fn(() => ({
				neq: vi.fn(() => Promise.resolve({ error: null })),
			})),
			insert: vi.fn(() => Promise.resolve({ error: null })),
		})),
		rpc: vi.fn(() => Promise.resolve({ data: [], error: null })),
	},
}));

vi.mock("axios");

describe("researchersService", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("getMainTopics", () => {
		it("should fetch unique main topics", async () => {
			const mockTopics = [{ main_topic: "Topic 1" }, { main_topic: "Topic 2" }];
			(supabase.from as any).mockReturnValue({
				select: vi.fn().mockResolvedValue({ data: mockTopics, error: null }),
			});

			const topics = await researchersService.getMainTopics();

			expect(topics).toEqual(["Topic 1", "Topic 2"]);
			expect(supabase.from).toHaveBeenCalledWith("unique_main_topics");
		});

		it("should throw error if fetching fails", async () => {
			(supabase.from as any).mockReturnValue({
				select: vi
					.fn()
					.mockResolvedValue({ data: null, error: new Error("DB Error") }),
			});

			await expect(researchersService.getMainTopics()).rejects.toThrow(
				"DB Error",
			);
		});
	});

	describe("getResearchers", () => {
		it("should call get_unique_researchers RPC", async () => {
			const mockData = [{ id: 1, name: "Researcher 1" }];
			(supabase.rpc as any).mockResolvedValue({ data: mockData, error: null });

			const pagination = {
				limit: 10,
				offset: 0,
				page: 1,
				sortBy: "id",
				sortOrder: "asc" as const,
			};
			const filters = { main_topic: "Topic 1" };

			const result = await researchersService.getResearchers(
				pagination,
				filters,
			);

			expect(result).toEqual(mockData);
			expect(supabase.rpc).toHaveBeenCalledWith(
				"get_unique_researchers",
				expect.objectContaining({
					p_main_topic: "Topic 1",
					p_limit: 10,
					p_offset: 0,
				}),
			);
		});
	});

	describe("analyzeResearcher", () => {
		it("should throw error if researcher not found locally", async () => {
			(supabase.from as any).mockReturnValue({
				select: vi.fn().mockReturnThis(),
				eq: vi.fn().mockReturnThis(),
				single: vi
					.fn()
					.mockResolvedValue({ data: null, error: new Error("Not found") }),
			});

			await expect(researchersService.analyzeResearcher(1)).rejects.toThrow(
				"Researcher not found in local DB",
			);
		});

		it("should resolve ID and fetch from S2 API", async () => {
			const mockLocalData = { id: 1, name: "John Doe", scholar_id: "12345" };
			(supabase.from as any).mockReturnValue({
				select: vi.fn().mockReturnThis(),
				eq: vi.fn().mockReturnThis(),
				single: vi.fn().mockResolvedValue({ data: mockLocalData, error: null }),
			});

			const mockS2Data = {
				authorId: "12345",
				name: "John Doe",
				papers: [
					{
						title: "Paper 1",
						authors: [
							{ authorId: "12345", name: "John Doe" },
							{ authorId: "67890", name: "Jane Smith" },
						],
					},
				],
			};
			(axios.get as any).mockResolvedValue({ data: mockS2Data });

			const result = await researchersService.analyzeResearcher(1);

			expect(result.local).toEqual(mockLocalData);
			expect(result.author.authorId).toBe("12345");
			expect(result.collaborators).toHaveLength(1);
			expect(result.collaborators[0].name).toBe("Jane Smith");
		});
	});

	describe("uploadResearchers", () => {
		it("should parse researchers and insert them into database", async () => {
			const ExcelJS = (await import("exceljs")).default;
			const wb = new ExcelJS.Workbook();
			const ws = wb.addWorksheet("Computer Science");

			ws.addRow(["Name", "Affiliation", "Subtopics", "Scholar Link"]);
			ws.addRow([
				"Dr. Alice Smith",
				"MIT",
				"Deep Learning",
				{
					text: "Google Scholar Profile",
					hyperlink: "https://scholar.google.com/citations?user=alice123",
				},
			]);
			ws.addRow([
				"Bob Jones",
				"Stanford",
				"NLP",
				"https://www.semanticscholar.org/author/bob/98765",
			]);

			const buffer = await wb.xlsx.writeBuffer();

			let insertedRows: any[] = [];
			(supabase.from as any).mockReturnValue({
				delete: vi.fn(() => ({
					neq: vi.fn(() => Promise.resolve({ error: null })),
				})),
				insert: vi.fn((data) => {
					insertedRows = data;
					return Promise.resolve({ error: null });
				}),
			});

			const count = await researchersService.uploadResearchers(
				Buffer.from(buffer),
				{
					clear_db: true,
					main_topic: "Fallback Topic",
				},
			);

			expect(count).toBe(2);
			expect(insertedRows).toHaveLength(2);
			expect(insertedRows[0]).toEqual({
				name: "Dr. Alice Smith",
				affiliation: "MIT",
				main_topic: "Computer Science",
				subtopics: "Deep Learning",
				scholar_id: "alice123",
			});
			expect(insertedRows[1]).toEqual({
				name: "Bob Jones",
				affiliation: "Stanford",
				main_topic: "Computer Science",
				subtopics: "NLP",
				scholar_id: "98765",
			});
		});

		it("should fallback to main_topic when sheet name is Sheet1", async () => {
			const ExcelJS = (await import("exceljs")).default;
			const wb = new ExcelJS.Workbook();
			const ws = wb.addWorksheet("Sheet1");

			ws.addRow(["Name", "Affiliation", "Subtopics", "Scholar Link"]);
			ws.addRow(["Carol", "Oxford", "AI", ""]);

			const buffer = await wb.xlsx.writeBuffer();
			let insertedRows: any[] = [];
			(supabase.from as any).mockReturnValue({
				insert: vi.fn((data) => {
					insertedRows = data;
					return Promise.resolve({ error: null });
				}),
			});

			const count = await researchersService.uploadResearchers(
				Buffer.from(buffer),
				{
					clear_db: false,
					main_topic: "Biology",
				},
			);

			expect(count).toBe(1);
			expect(insertedRows[0].main_topic).toBe("Biology");
		});
	});
});

