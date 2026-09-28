
import { db } from "../../db/db_config.js";

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
            sponsorship,
        } = req.query;

        // Pagination
        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const limitNumber = Math.min(
            100,
            Math.max(1, parseInt(limit, 10) || 10)
        );

        // Allowed sorting fields
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

        const where = {
            ...(search && {
                OR: [
                    {
                        projectTitle: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        supervisor: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        coSupervisor: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }),

            ...(university && {
                university: {
                    contains: university,
                    mode: "insensitive",
                },
            }),

            ...(projectField && {
                domains: {
                    array_contains: [projectField],
                },
            }),

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