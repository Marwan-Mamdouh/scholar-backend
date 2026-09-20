import { Prisma, type GraduationProject } from "@prisma/client";
import { db } from "../../db/db_config.js";
import {
	buildPaginatedResponse,
	type PaginatedResponse,
	type PaginationMeta,
} from "../../utils/pagination.util.js";
import type { GradProjectFilter } from "./grad-projects.schema.js";

const SORTABLE_COLUMNS = ["postedAt", "graduationYear", "projectTitle"] as const;

export interface GradProjectFacets {
	universities: string[];
	years: number[];
	domains: string[];
}

function buildWhere(filters: GradProjectFilter): Prisma.GraduationProjectWhereInput {
	const where: Prisma.GraduationProjectWhereInput = {};

	if (filters.q) {
		const contains = { contains: filters.q, mode: "insensitive" as const };
		where.OR = [
			{ projectTitle: contains },
			{ projectSummary: contains },
			{ supervisor: contains },
			{ coSupervisor: contains },
			{ university: contains },
			{ companyName: contains },
		];
	}

	if (filters.university) where.university = filters.university;
	if (filters.graduationYear !== undefined) {
		where.graduationYear = filters.graduationYear;
	}
	if (filters.domain) where.domains = { array_contains: filters.domain };
	if (filters.isSponsored !== undefined) where.isSponsored = filters.isSponsored;

	return where;
}

const gradProjectsService = {
	async search(
		filters: GradProjectFilter,
		pagination: PaginationMeta,
	): Promise<PaginatedResponse<GraduationProject>> {
		const where = buildWhere(filters);
		const sortBy = SORTABLE_COLUMNS.includes(
			pagination.sortBy as (typeof SORTABLE_COLUMNS)[number],
		)
			? pagination.sortBy
			: "postedAt";

		const [projects, totalItems] = await db.$transaction([
			db.graduationProject.findMany({
				where,
				orderBy: { [sortBy]: pagination.sortOrder },
				skip: pagination.offset,
				take: pagination.limit,
			}),
			db.graduationProject.count({ where }),
		]);

		return buildPaginatedResponse(
			projects,
			totalItems,
			pagination.page,
			pagination.limit,
		);
	},

	async facets(): Promise<GradProjectFacets> {
		const [universityRows, yearRows, domainRows] = await Promise.all([
			db.graduationProject.findMany({
				where: { university: { not: null } },
				select: { university: true },
				distinct: ["university"],
				orderBy: { university: "asc" },
			}),
			db.graduationProject.findMany({
				where: { graduationYear: { not: null } },
				select: { graduationYear: true },
				distinct: ["graduationYear"],
				orderBy: { graduationYear: "desc" },
			}),
			db.graduationProject.findMany({
				select: { domains: true },
			}),
		]);

		const domains = new Set<string>();
		for (const row of domainRows) {
			if (Array.isArray(row.domains)) {
				for (const entry of row.domains) {
					if (typeof entry === "string" && entry.trim()) domains.add(entry.trim());
				}
			}
		}

		return {
			universities: universityRows
				.map((row) => row.university)
				.filter((name): name is string => name !== null),
			years: yearRows
				.map((row) => row.graduationYear)
				.filter((year): year is number => year !== null),
			domains: [...domains].sort((a, b) => a.localeCompare(b)),
		};
	},
};

export default gradProjectsService;
