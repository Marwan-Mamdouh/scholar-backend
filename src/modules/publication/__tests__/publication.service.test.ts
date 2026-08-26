import { describe, it, expect, vi, beforeEach } from "vitest";
import publicationService from "../publication.service.js";

const { mockCount, mockFindMany, mockQueryRaw } = vi.hoisted(() => ({
	mockCount: vi.fn(),
	mockFindMany: vi.fn(),
	mockQueryRaw: vi.fn(),
}));

vi.mock("../../../db/db_config.js", () => ({
	db: {
		academicPublication: {
			count: (...args: any[]) => mockCount(...args),
			findMany: (...args: any[]) => mockFindMany(...args),
		},
		$queryRaw: (...args: any[]) => mockQueryRaw(...args),
	},
}));

const basePagination = {
	page: 1,
	limit: 20,
	offset: 0,
	sortBy: "createdAt",
	sortOrder: "desc" as const,
};

describe("publicationService.searchPublications", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockCount.mockResolvedValue(0);
		mockFindMany.mockResolvedValue([]);
		mockQueryRaw.mockResolvedValue([]);
	});

	it("returns a paginated envelope with no filters", async () => {
		mockCount.mockResolvedValue(2);
		mockFindMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);

		const result = await publicationService.searchPublications({}, basePagination);

		expect(result.data).toHaveLength(2);
		expect(result.meta).toMatchObject({
			page: 1,
			limit: 20,
			totalItems: 2,
			totalPages: 1,
			hasNextPage: false,
			hasPrevPage: false,
		});
		expect(mockFindMany).toHaveBeenCalledWith(
			expect.objectContaining({ where: {}, skip: 0, take: 20 })
		);
	});

	it("combines full-text q with the filter where clause", async () => {
		mockQueryRaw.mockResolvedValue([{ id: 5 }, { id: 7 }]);
		mockCount.mockResolvedValue(2);
		mockFindMany.mockResolvedValue([{ id: 5 }, { id: 7 }]);

		await publicationService.searchPublications({ q: "ieee" }, basePagination);

		expect(mockQueryRaw).toHaveBeenCalledTimes(1);
		expect(mockFindMany).toHaveBeenCalledWith(
			expect.objectContaining({
				where: expect.objectContaining({ id: { in: [5, 7] } }),
			})
		);
	});

	it("maps flattened query params to the Prisma where clause", async () => {
		mockCount.mockResolvedValue(0);

		await publicationService.searchPublications(
			{
				categoryIds: [1, 2],
				quartiles: ["Q1", "Q2"],
				publishingModel: ["Full_Open_Access"],
				licensing: ["CC_BY"],
				currency: "USD",
				maxCost: 3000,
				impactFactorMin: 2,
				impactFactorMax: 10,
				sjrMin: 1,
				citeScoreMax: 5,
				firstDecisionWeeksMax: 4,
				submissionToAcceptanceWeeksMin: 2,
			},
			basePagination
		);

		const where = mockFindMany.mock.calls[0][0].where;
		expect(where.subCategoryId).toEqual({ in: [1, 2] });
		expect(where.openAccessType).toEqual({ in: ["Full_Open_Access"] });
		expect(where.licenseType).toEqual({ in: ["CC_BY"] });
		expect(where.pricings).toEqual({
			some: { currency: "USD", cost: { lte: 3000 } },
		});
		expect(where.yearlyMetrics.some.quartile).toEqual({ in: ["Q1", "Q2"] });
		expect(where.yearlyMetrics.some.impactFactor).toEqual({ gte: 2, lte: 10 });
		expect(where.yearlyMetrics.some.sjr).toEqual({ gte: 1 });
		expect(where.yearlyMetrics.some.citescore).toEqual({ lte: 5 });
		// weeks -> days conversion (* 7)
		expect(where.editorialStats.some.submissionToFirstDecision).toEqual({ lte: 28 });
		expect(where.editorialStats.some.submissionToAcceptance).toEqual({ gte: 14 });
	});

	it("returns empty result when q matches nothing", async () => {
		mockQueryRaw.mockResolvedValue([]);
		mockCount.mockResolvedValue(0);

		const result = await publicationService.searchPublications({ q: "zzz" }, basePagination);

		expect(result.data).toHaveLength(0);
		expect(mockFindMany).toHaveBeenCalledWith(
			expect.objectContaining({ where: { id: { in: [] } } })
		);
	});

	it("falls back to defaults when q is empty or whitespace", async () => {
		mockCount.mockResolvedValue(3);
		mockFindMany.mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }]);

		const empty = await publicationService.searchPublications({ q: "" }, basePagination);
		const whitespace = await publicationService.searchPublications({ q: "   " }, basePagination);

		expect(empty.data).toHaveLength(3);
		expect(whitespace.data).toHaveLength(3);
		// full-text query must NOT run for empty/whitespace q
		expect(mockQueryRaw).not.toHaveBeenCalled();
		// filter where must be empty (defaults)
		expect(mockFindMany).toHaveBeenCalledWith(
			expect.objectContaining({ where: {} })
		);
	});
});
