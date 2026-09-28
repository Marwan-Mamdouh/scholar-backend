import { db } from "../../db/db_config.js";


export const getResearchersController = async (req, res) => {
    try {
        const {
            page = "1",
            limit = "10",
            sortBy = "id",
            sortOrder = "asc",
            id,
            firstName,
            lastName,
            mainTopic,
            institutionName,
            researcher,
            scholarId,
            department,
        } = req.query;

        const pageNumber = Math.max(1, parseInt(page as string, 10) || 1);
        const limitNumber = Math.min(
            100,
            Math.max(1, parseInt(limit as string, 10) || 10)
        );

        const allowedSortFields = [
            "id",
            "firstName",
            "lastName",
            "mainTopic",
            "institutionName",
            "department",
        ];

        const sortField = allowedSortFields.includes(sortBy as string)
            ? (sortBy as string)
            : "id";

        const sortDirection = sortOrder === "desc" ? "desc" : "asc";

        const where = {
            ...(id && {
                id: parseInt(id as string, 10),
            }),
            ...(firstName && {
                firstName: {
                    contains: firstName as string,
                    mode: "insensitive" as const,
                },
            }),
            ...(lastName && {
                lastName: {
                    contains: lastName as string,
                    mode: "insensitive" as const,
                },
            }),
            ...(mainTopic && {
                mainTopic: {
                    contains: mainTopic as string,
                    mode: "insensitive" as const,
                },
            }),

            ...(institutionName && {
                institutionName: {
                    contains: institutionName as string,
                    mode: "insensitive" as const,
                },
            }),

            ...(researcher && {
                OR: [
                    {
                        firstName: {
                            contains: researcher as string,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        lastName: {
                            contains: researcher as string,
                            mode: "insensitive" as const,
                        },
                    },
                ],
            }),

            ...(scholarId && {
                scholarId: {
                    contains: scholarId as string,
                    mode: "insensitive" as const,
                },
            }),

            ...(department && {
                department: {
                    contains: department as string,
                    mode: "insensitive" as const,
                },
            }),
        };

        const [researchers, total] = await Promise.all([
            db.academicResearcher.findMany({
                where,
                take: limitNumber,
                skip: (pageNumber - 1) * limitNumber,
                orderBy: {
                    [sortField]: sortDirection,
                },
            }),

            db.academicResearcher.count({ where }),
        ]);

        res.json({
            success: true,
            data: researchers,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(total / limitNumber),
            },
        });
    } catch (error) {
        console.error("Error fetching researchers:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch researchers",
        });
    }
};