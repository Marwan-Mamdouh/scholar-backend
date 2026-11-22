import type { RequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { catalogFacetValues, readFacetValues } from "../../utils/catalogFacets.js";
import { yearCountsHandler } from "../../utils/yearCounts.js";
import { parseYearBounds } from "../../utils/parseYearBounds.js";
import asyncHandler from "../../lib/async.handler.js";

import { db } from "../../db/db_config.js";


// Decode both legacy text and arrays in the same way as the project cards.
const projectFieldsQuery = Prisma.sql`
    SELECT project.id, btrim(parts.value) AS field
    FROM "graduationProjects" AS project
    CROSS JOIN LATERAL jsonb_array_elements(
        CASE jsonb_typeof(project.domains)
            WHEN 'array' THEN project.domains
            WHEN 'string' THEN jsonb_build_array(project.domains)
            ELSE '[]'::jsonb
        END
    ) AS entry(item)
    CROSS JOIN LATERAL jsonb_array_elements(
        CASE jsonb_typeof(entry.item)
            WHEN 'array' THEN entry.item
            WHEN 'string' THEN jsonb_build_array(entry.item)
            ELSE '[]'::jsonb
        END
    ) AS token(item)
    CROSS JOIN LATERAL regexp_split_to_table(token.item #>> '{}', '[,;|]') AS parts(value)
    WHERE jsonb_typeof(token.item) = 'string'
`;

export const getProjectFacets: RequestHandler = asyncHandler(async (_req, res) => {
    const [universities, fields] = await Promise.all([
        db.graduationProject.groupBy({ by: ["university"] }),
        db.$queryRaw<{ field: string }[]>`
            SELECT DISTINCT field FROM (${projectFieldsQuery}) AS fields
        `,
    ]);

    res.json({ success: true, data: {
        universities: catalogFacetValues(universities.map(row => row.university)),
        fields: catalogFacetValues(fields.map(row => row.field)),
    } });
});

export const getProjectYears = yearCountsHandler(async () => {
    const rows = await db.$queryRaw<{ year: number; count: bigint }[]>`
        SELECT EXTRACT(YEAR FROM "postedAt")::int AS year, count(*) AS count
        FROM "graduationProjects"
        WHERE "postedAt" >= TIMESTAMP '0001-01-01' AND "postedAt" < TIMESTAMP '10000-01-01'
        GROUP BY year
        ORDER BY year
    `;
    return rows.map(({ year, count }) => ({ year, count: Number(count) }));
});

function startOfYear(year: number) {
    const start = new Date(0);
    start.setUTCFullYear(year, 0, 1);
    return start;
}

export const getProjectsController = async (req, res) => {
    try {
        const {
            page = "1",
            limit = "10",
            sortBy = "postedAt",
            sortOrder = "desc",
            search,
            university,
            projectField,
            year,
            fromYear,
            toYear,
            sponsorship,
        } = req.query;

        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const limitNumber = Math.min(
            100,
            Math.max(1, parseInt(limit, 10) || 10)
        );

        const allowedSortFields = [
            "id",
            "projectTitle",
            "university",
            "postedAt",
            "isSponsored",
            "noOfStudents",
        ];

        const sortField = allowedSortFields.includes(sortBy)
            ? sortBy
            : "postedAt";

        const sortDirection = sortOrder === "asc" ? "asc" : "desc";

        const yearBounds = parseYearBounds(fromYear, toYear);
        if (yearBounds === null || (yearBounds && year)) {
            return res.status(400).json({ success: false, message: "Invalid year range" });
        }

        const postedAt = yearBounds
            ? {
                gte: yearBounds.gte === undefined ? undefined : startOfYear(yearBounds.gte),
                lt: yearBounds.lte === undefined ? undefined : startOfYear(yearBounds.lte + 1),
            }
            : undefined;

        const universities = readFacetValues(req.query.universities);
        const projectFields = readFacetValues(req.query.projectFields);
        const matchingProjects = projectFields.length
            ? await db.$queryRaw<{ id: number }[]>`
                SELECT DISTINCT id FROM (${projectFieldsQuery}) AS fields
                WHERE lower(field) IN (${Prisma.join(projectFields.map(field => field.toLowerCase()))})
            `
            : undefined;

        const where = {
            ...(search && {
                OR: [
                    {
                        projectTitle: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        supervisor: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        coSupervisor: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                ],
            }),

            ...(universities.length
                ? { university: { in: universities, mode: "insensitive" as const } }
                : university && {
                university: {
                    contains: university,
                    mode: "insensitive" as const,
                },
            }),

            ...(matchingProjects ? { id: { in: matchingProjects.map(project => project.id) } } : projectField && {
                domains: {
                    array_contains: [projectField],
                },
            }),

            ...(postedAt && { postedAt }),
            ...(year && {
                postedAt: {
                    gte: new Date(`${year}-01-01T00:00:00.000Z`),
                    lt: new Date(`${parseInt(year, 10) + 1}-01-01T00:00:00.000Z`),
                },
            }),

            ...(sponsorship === "sponsored" && {
                isSponsored: true,
            }),

            ...(sponsorship === "unsponsored" && {
                isSponsored: false,
            }),
        };

        const [projects, total] = await Promise.all([
            db.graduationProject.findMany({
                where,
                take: limitNumber,
                skip: (pageNumber - 1) * limitNumber,
                orderBy: {
                    [sortField]: sortDirection,
                },
                include: {
                    sponsorCompany: true,
                },
            }),

            db.graduationProject.count({ where }),
        ]);

        res.status(200).json({
            success: true,
            data: projects,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(total / limitNumber),
            },
        });
    } catch (error) {
        console.error("Error fetching projects:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch projects",
        });
    }
};




const getProjectById = (includeApplications: boolean) => async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID",
            });
        }

        const project = await db.graduationProject.findUnique({
            where: {
                id,
            },
            include: {
                sponsorCompany: true,
                applications: includeApplications,
            },
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        res.status(200).json({
            success: true,
            data: project,
        });
    } catch (error) {
        console.error("Error fetching project:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch project",
        });
    }
};



export const getProjectsByIdController = getProjectById(true);
export const getCatalogProjectController = getProjectById(false);

export const createProjectController = async (req, res) => {
    try {
        const {
            isSponsored,
            sponsorCompanyId,
            university,
            faculty,
            industry,
            domains,
            supervisor,
            coSupervisor,
            projectTitle,
            noOfStudents,
            documentationLink,
        } = req.body;

        if (!projectTitle || typeof projectTitle !== "string") {
            return res.status(400).json({
                success: false,
                message: "projectTitle is required",
            });
        }

        if (sponsorCompanyId !== undefined && sponsorCompanyId !== null) {
            const company = await db.company.findUnique({
                where: {
                    id: Number(sponsorCompanyId),
                },
            });

            if (!company) {
                return res.status(400).json({
                    success: false,
                    message: "Sponsor company not found",
                });
            }
        }

        const project = await db.graduationProject.create({
            data: {
                isSponsored: Boolean(isSponsored),
                sponsorCompanyId:
                    sponsorCompanyId !== undefined &&
                        sponsorCompanyId !== null
                        ? Number(sponsorCompanyId)
                        : null,

                university: university || null,
                faculty: faculty || null,
                industry: industry || null,
                domains: domains || null,
                supervisor: supervisor || null,
                coSupervisor: coSupervisor || null,
                projectTitle: projectTitle.trim(),
                noOfStudents:
                    noOfStudents !== undefined &&
                        noOfStudents !== null
                        ? Number(noOfStudents)
                        : null,
                documentationLink: documentationLink || null,
            },

            include: {
                sponsorCompany: true,
            },
        });

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: project,
        });
    } catch (error) {
        console.error("Error creating project:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create project",
        });
    }
};



export const updateProjectController = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID",
            });
        }

        const existingProject = await db.graduationProject.findUnique({
            where: {
                id,
            },
        });

        if (!existingProject) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        const {
            isSponsored,
            sponsorCompanyId,
            university,
            faculty,
            industry,
            domains,
            supervisor,
            coSupervisor,
            projectTitle,
            noOfStudents,
            documentationLink,
        } = req.body;

        if (sponsorCompanyId !== undefined && sponsorCompanyId !== null) {
            const company = await db.company.findUnique({
                where: {
                    id: Number(sponsorCompanyId),
                },
            });

            if (!company) {
                return res.status(400).json({
                    success: false,
                    message: "Sponsor company not found",
                });
            }
        }

        const project = await db.graduationProject.update({
            where: {
                id,
            },

            data: {
                ...(isSponsored !== undefined && {
                    isSponsored: Boolean(isSponsored),
                }),

                ...(sponsorCompanyId !== undefined && {
                    sponsorCompanyId:
                        sponsorCompanyId === null
                            ? null
                            : Number(sponsorCompanyId),
                }),

                ...(university !== undefined && {
                    university,
                }),

                ...(faculty !== undefined && {
                    faculty,
                }),

                ...(industry !== undefined && {
                    industry,
                }),

                ...(domains !== undefined && {
                    domains,
                }),

                ...(supervisor !== undefined && {
                    supervisor,
                }),

                ...(coSupervisor !== undefined && {
                    coSupervisor,
                }),

                ...(projectTitle !== undefined && {
                    projectTitle: projectTitle.trim(),
                }),

                ...(noOfStudents !== undefined && {
                    noOfStudents:
                        noOfStudents === null
                            ? null
                            : Number(noOfStudents),
                }),

                ...(documentationLink !== undefined && {
                    documentationLink,
                }),
            },

            include: {
                sponsorCompany: true,
            },
        });

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: project,
        });
    } catch (error) {
        console.error("Error updating project:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update project",
        });
    }
};



export const deleteProjectController = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID",
            });
        }

        // Check project exists
        const existingProject = await db.graduationProject.findUnique({
            where: {
                id,
            },
        });

        if (!existingProject) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        await db.graduationProject.delete({
            where: {
                id,
            },
        });

        res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting project:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete project",
        });
    }
};