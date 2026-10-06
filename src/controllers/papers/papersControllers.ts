import { db } from "../../db/db_config.js";


const serializePaper = (paper) => ({
    ...paper,
    putCode: paper.putCode !== null ? paper.putCode.toString() : null,
});


export const getPapersController = async (req, res) => {
    try {
        const {
            search = "",
            year,
            page = 1,
            limit = 10,
            sortBy = "publicationYear",
            order = "desc",
        } = req.query;

        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

        const yearNum = year ? parseInt(year, 10) : undefined;

        if (year && (!Number.isInteger(yearNum) || yearNum < 1)) {
            return res.status(400).json({
                success: false,
                message: "Invalid publication year",
            });
        }

        const where = {
            ...(search.trim() && {
                OR: [
                    {
                        title: {
                            contains: search.trim(),
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        subtitle: {
                            contains: search.trim(),
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        journalTitle: {
                            contains: search.trim(),
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        doi: {
                            contains: search.trim(),
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        sourceName: {
                            contains: search.trim(),
                            mode: "insensitive" as const,
                        },
                    },
                ],
            }),
            ...(yearNum && { publicationYear: yearNum }),
        };

        const validSortFields = [
            "publicationYear",
            "createdAt",
            "title",
            "journalTitle",
        ];

        const orderBy = validSortFields.includes(sortBy)
            ? { [sortBy]: order === "asc" ? "asc" : "desc" }
            : { publicationYear: "desc" as const };

        const [papers, total] = await Promise.all([
            db.researchPaper.findMany({
                where,
                orderBy,
                skip: (pageNum - 1) * limitNum,
                take: limitNum,
                include: {
                    staff: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            }),

            db.researchPaper.count({ where }),
        ]);

        const serialized = papers.map((paper) => ({
            ...paper,
            putCode:
                paper.putCode !== null
                    ? paper.putCode.toString()
                    : null,
        }));

        return res.status(200).json({
            success: true,
            data: serialized,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        console.error("getPapersController error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch research papers",
            error: error.message,
        });
    }
};


export const getPapersByIdController = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid paper ID",
            });
        }

        const paper = await db.researchPaper.findUnique({
            where: { id },
            include: {
                staff: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!paper) {
            return res.status(404).json({
                success: false,
                message: "Research paper not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: serializePaper(paper),
        });
    } catch (error) {
        console.error("getPapersByIdController error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch research paper",
        });
    }
};



export const createPaperController = async (req, res) => {
    try {
        const {
            putCode,
            orcidPath,
            title,
            subtitle,
            type,
            journalTitle,
            doi,
            url,
            publicationYear,
            publicationMonth,
            publicationDay,
            sourceName,
            visibility,
            staffId,
        } = req.body;

        if (!title || typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }

        if (staffId === undefined || staffId === null) {
            return res.status(400).json({
                success: false,
                message: "staffId is required",
            });
        }

        const parsedStaffId = Number(staffId);

        if (!Number.isInteger(parsedStaffId) || parsedStaffId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid staffId",
            });
        }

        const staff = await db.universityStaff.findUnique({
            where: { id: parsedStaffId },
        });

        if (!staff) {
            return res.status(400).json({
                success: false,
                message: "University staff member not found",
            });
        }

        const paper = await db.researchPaper.create({
            data: {
                putCode:
                    putCode !== undefined && putCode !== null
                        ? BigInt(putCode)
                        : null,

                orcidPath: orcidPath || null,
                title: title.trim(),
                subtitle: subtitle || null,
                type: type || null,
                journalTitle: journalTitle || null,
                doi: doi || null,
                url: url || null,

                publicationYear:
                    publicationYear !== undefined &&
                        publicationYear !== null
                        ? Number(publicationYear)
                        : null,

                publicationMonth:
                    publicationMonth !== undefined &&
                        publicationMonth !== null
                        ? Number(publicationMonth)
                        : null,

                publicationDay:
                    publicationDay !== undefined &&
                        publicationDay !== null
                        ? Number(publicationDay)
                        : null,

                sourceName: sourceName || null,
                visibility: visibility || "public",
                staffId: parsedStaffId,
            },
            include: {
                staff: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return res.status(201).json({
            success: true,
            message: "Research paper created successfully",
            data: serializePaper(paper),
        });
    } catch (error) {
        console.error("createPaperController error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create research paper",
        });
    }
};



export const updatePaperController = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid paper ID",
            });
        }

        const existingPaper = await db.researchPaper.findUnique({
            where: { id },
        });

        if (!existingPaper) {
            return res.status(404).json({
                success: false,
                message: "Research paper not found",
            });
        }

        const {
            putCode,
            orcidPath,
            title,
            subtitle,
            type,
            journalTitle,
            doi,
            url,
            publicationYear,
            publicationMonth,
            publicationDay,
            sourceName,
            visibility,
            staffId,
        } = req.body;

        if (
            title !== undefined &&
            (typeof title !== "string" || !title.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Title cannot be empty",
            });
        }

        if (staffId !== undefined && staffId !== null) {
            const parsedStaffId = Number(staffId);

            if (!Number.isInteger(parsedStaffId) || parsedStaffId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid staffId",
                });
            }

            const staff = await db.universityStaff.findUnique({
                where: { id: parsedStaffId },
            });

            if (!staff) {
                return res.status(400).json({
                    success: false,
                    message: "University staff member not found",
                });
            }
        }

        const paper = await db.researchPaper.update({
            where: { id },
            data: {
                ...(putCode !== undefined && {
                    putCode:
                        putCode === null ? null : BigInt(putCode),
                }),

                ...(orcidPath !== undefined && { orcidPath }),
                ...(title !== undefined && { title: title.trim() }),
                ...(subtitle !== undefined && { subtitle }),
                ...(type !== undefined && { type }),
                ...(journalTitle !== undefined && { journalTitle }),
                ...(doi !== undefined && { doi }),
                ...(url !== undefined && { url }),

                ...(publicationYear !== undefined && {
                    publicationYear:
                        publicationYear === null
                            ? null
                            : Number(publicationYear),
                }),

                ...(publicationMonth !== undefined && {
                    publicationMonth:
                        publicationMonth === null
                            ? null
                            : Number(publicationMonth),
                }),

                ...(publicationDay !== undefined && {
                    publicationDay:
                        publicationDay === null
                            ? null
                            : Number(publicationDay),
                }),

                ...(sourceName !== undefined && { sourceName }),
                ...(visibility !== undefined && { visibility }),

                ...(staffId !== undefined && {
                    staffId:
                        staffId === null ? existingPaper.staffId : Number(staffId),
                }),
            },
            include: {
                staff: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return res.status(200).json({
            success: true,
            message: "Research paper updated successfully",
            data: serializePaper(paper),
        });
    } catch (error) {
        console.error("updatePaperController error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update research paper",
        });
    }
};



export const deletePaperController = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid paper ID",
            });
        }

        const existingPaper = await db.researchPaper.findUnique({
            where: { id },
        });

        if (!existingPaper) {
            return res.status(404).json({
                success: false,
                message: "Research paper not found",
            });
        }

        await db.researchPaper.delete({
            where: { id },
        });

        return res.status(200).json({
            success: true,
            message: "Research paper deleted successfully",
        });
    } catch (error) {
        console.error("deletePaperController error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete research paper",
        });
    }
};