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



export const getResearcherByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const researcherId = parseInt(id as string, 10);

        if (isNaN(researcherId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid researcher ID provided",
            });
        }

        const researcher = await db.academicResearcher.findUnique({
            where: { id: researcherId },
        });

        if (!researcher) {
            return res.status(404).json({
                success: false,
                message: "Researcher not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: researcher,
            message: "Researcher retrieved successfully",
        });
    } catch (error) {
        console.error("Error fetching researcher by ID:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const createResearcherController = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            mainTopic,
            institutionName,
            scholarId,
            department,
        } = req.body;

        if (!firstName || typeof firstName !== "string" || !firstName.trim()) {
            return res.status(400).json({
                success: false,
                message: "First name is required",
            });
        }

        if (!lastName || typeof lastName !== "string" || !lastName.trim()) {
            return res.status(400).json({
                success: false,
                message: "Last name is required",
            });
        }

        const newResearcher = await db.academicResearcher.create({
            data: {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                mainTopic: mainTopic ? String(mainTopic).trim() : null,
                institutionName: institutionName
                    ? String(institutionName).trim()
                    : null,
                scholarId: scholarId ? String(scholarId).trim() : null,
                department: department ? String(department).trim() : null,
            },
        });

        return res.status(201).json({
            success: true,
            data: newResearcher,
            message: "Researcher created successfully",
        });
    } catch (error) {
        console.error("Error creating researcher:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const updateResearcherController = async (req, res) => {
    try {
        const { id } = req.params;
        const researcherId = parseInt(id as string, 10);

        if (isNaN(researcherId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid researcher ID provided",
            });
        }

        const existingResearcher = await db.academicResearcher.findUnique({
            where: { id: researcherId },
        });

        if (!existingResearcher) {
            return res.status(404).json({
                success: false,
                message: "Researcher not found",
            });
        }

        const {
            firstName,
            lastName,
            mainTopic,
            institutionName,
            scholarId,
            department,
        } = req.body;

        const updatedResearcher = await db.academicResearcher.update({
            where: { id: researcherId },
            data: {
                ...(firstName !== undefined && {
                    firstName: firstName ? String(firstName).trim() : null,
                }),
                ...(lastName !== undefined && {
                    lastName: lastName ? String(lastName).trim() : null,
                }),
                ...(mainTopic !== undefined && {
                    mainTopic: mainTopic ? String(mainTopic).trim() : null,
                }),
                ...(institutionName !== undefined && {
                    institutionName: institutionName
                        ? String(institutionName).trim()
                        : null,
                }),
                ...(scholarId !== undefined && {
                    scholarId: scholarId ? String(scholarId).trim() : null,
                }),
                ...(department !== undefined && {
                    department: department ? String(department).trim() : null,
                }),
            },
        });

        return res.status(200).json({
            success: true,
            data: updatedResearcher,
            message: "Researcher updated successfully",
        });
    } catch (error) {
        console.error("Error updating researcher:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const deleteResearcherController = async (req, res) => {
    try {
        const { id } = req.params;
        const researcherId = parseInt(id as string, 10);

        if (isNaN(researcherId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid researcher ID provided",
            });
        }

        const existingResearcher = await db.academicResearcher.findUnique({
            where: { id: researcherId },
        });

        if (!existingResearcher) {
            return res.status(404).json({
                success: false,
                message: "Researcher not found",
            });
        }

        await db.academicResearcher.delete({
            where: { id: researcherId },
        });

        return res.status(200).json({
            success: true,
            message: "Researcher deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting researcher:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};