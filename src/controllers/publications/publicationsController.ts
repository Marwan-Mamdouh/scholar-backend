import { Prisma } from "@prisma/client";
import { db } from "../../db/db_config.js";

const ALLOWED_SORT_FIELDS = [
    "id",
    "title",
    "acronym",
    "yearLunched",
    "createdAt",
    "updatedAt",
] as const;

type SortField = (typeof ALLOWED_SORT_FIELDS)[number];


export const getPublicationsController = async (req, res) => {
    try {
        const {
            search = "",
            page = "1",
            limit = "10",
            sortBy = "id",
            sortOrder = "asc",
        } = req.query;

        const pageNumber = Math.max(
            1,
            parseInt(String(page), 10) || 1
        );

        const limitNumber = Math.min(
            100,
            Math.max(1, parseInt(String(limit), 10) || 10)
        );

        const searchTerm = String(search).trim();

        const where = {
            ...(searchTerm && {
                OR: [
                    {
                        title: {
                            contains: searchTerm,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        acronym: {
                            contains: searchTerm,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        URL: {
                            contains: searchTerm,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        imprint: {
                            contains: searchTerm,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        specificFocusScope: {
                            contains: searchTerm,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        journalScope: {
                            contains: searchTerm,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        issn: {
                            contains: searchTerm,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        eissn: {
                            contains: searchTerm,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        issnCdrom: {
                            contains: searchTerm,
                            mode: "insensitive" as const,
                        },
                    },
                ],
            }),
        };

        const sortField: SortField = ALLOWED_SORT_FIELDS.includes(
            sortBy as SortField
        )
            ? (sortBy as SortField)
            : "id";

        const order: "asc" | "desc" =
            String(sortOrder).toLowerCase() === "desc"
                ? "desc"
                : "asc";

        const [publications, total] = await Promise.all([
            db.academicPublication.findMany({
                where,
                take: limitNumber,
                skip: (pageNumber - 1) * limitNumber,
                orderBy: {
                    [sortField]: order,
                },
                include: {
                    subCategory: true,
                },
            }),

            db.academicPublication.count({
                where,
            }),
        ]);

        return res.status(200).json({
            success: true,
            data: publications,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(total / limitNumber),
            },
        });
    } catch (error) {
        console.error("Error fetching publications:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getPublicationByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const publicationId = parseInt(String(id), 10);

        if (isNaN(publicationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid publication ID provided",
            });
        }

        const publication = await db.academicPublication.findUnique({
            where: { id: publicationId },
            include: {
                subCategory: true,
            },
        });

        if (!publication) {
            return res.status(404).json({
                success: false,
                message: "Publication not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: publication,
            message: "Publication retrieved successfully",
        });
    } catch (error) {
        console.error("Error fetching publication by ID:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const createPublicationController = async (req, res) => {
    try {
        const {
            subCategoryId,
            title,
            publisher,
            publicationType,
            openAccessType,
            workflow,
            acronym,
            issn,
            eissn,
            issnCdrom,
            URL,
            yearLunched,
            specificFocusScope,
            licenseType,
            journalScope,
            imprint,
            subBucket,
        } = req.body;

        if (!title || typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Publication title is required",
            });
        }

        const parsedSubCategoryId = parseInt(String(subCategoryId), 10);
        if (isNaN(parsedSubCategoryId)) {
            return res.status(400).json({
                success: false,
                message: "Valid subCategoryId is required",
            });
        }

        if (!publisher || !publicationType || !openAccessType || !workflow) {
            return res.status(400).json({
                success: false,
                message: "publisher, publicationType, openAccessType, and workflow are required fields",
            });
        }

        const subCategoryExists = await db.publicationSubCategory.findUnique({
            where: { id: parsedSubCategoryId },
        });

        if (!subCategoryExists) {
            return res.status(404).json({
                success: false,
                message: "Associated publication sub-category not found",
            });
        }

        const newPublication = await db.academicPublication.create({
            data: {
                subCategoryId: parsedSubCategoryId,
                title: title.trim(),
                publisher,
                publicationType,
                openAccessType,
                workflow,
                acronym: acronym ? String(acronym).trim() : null,
                issn: issn ? String(issn).trim() : null,
                eissn: eissn ? String(eissn).trim() : null,
                issnCdrom: issnCdrom ? String(issnCdrom).trim() : null,
                URL: URL ? String(URL).trim() : null,
                yearLunched: yearLunched ? parseInt(String(yearLunched), 10) : null,
                specificFocusScope: specificFocusScope ? String(specificFocusScope).trim() : null,
                licenseType: licenseType ?? null,
                journalScope: journalScope ? String(journalScope).trim() : null,
                imprint: imprint ? String(imprint).trim() : null,
                subBucket: subBucket ?? null,
            },
            include: {
                subCategory: true,
            },
        });

        return res.status(201).json({
            success: true,
            data: newPublication,
            message: "Publication created successfully",
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                const target = (error.meta?.target as string[]) || [];
                return res.status(409).json({
                    success: false,
                    message: `A publication with this ${target.join(", ") || "field"} already exists.`,
                });
            }
        }

        if (error instanceof Prisma.PrismaClientValidationError) {
            return res.status(400).json({
                success: false,
                message: "Invalid field format or enum value provided.",
            });
        }

        console.error("Error creating publication:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const updatePublicationController = async (req, res) => {
    try {
        const { id } = req.params;
        const publicationId = parseInt(String(id), 10);

        if (isNaN(publicationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid publication ID provided",
            });
        }

        const existingPublication = await db.academicPublication.findUnique({
            where: { id: publicationId },
        });

        if (!existingPublication) {
            return res.status(404).json({
                success: false,
                message: "Publication not found",
            });
        }

        const {
            subCategoryId,
            title,
            publisher,
            publicationType,
            openAccessType,
            workflow,
            acronym,
            issn,
            eissn,
            issnCdrom,
            URL,
            yearLunched,
            specificFocusScope,
            licenseType,
            journalScope,
            imprint,
            subBucket,
        } = req.body;

        // Parse and validate subCategoryId
        let parsedSubCategoryId: number | undefined = undefined;
        if (subCategoryId !== undefined) {
            parsedSubCategoryId = parseInt(String(subCategoryId), 10);
            if (isNaN(parsedSubCategoryId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid subCategoryId provided",
                });
            }

            const subCategoryExists = await db.publicationSubCategory.findUnique({
                where: { id: parsedSubCategoryId },
            });

            if (!subCategoryExists) {
                return res.status(404).json({
                    success: false,
                    message: "Associated subCategory not found",
                });
            }
        }

        let parsedYearLunched: number | null | undefined = undefined;
        if (yearLunched !== undefined) {
            if (yearLunched === null) {
                parsedYearLunched = null;
            } else {
                parsedYearLunched = parseInt(String(yearLunched), 10);
                if (isNaN(parsedYearLunched)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid yearLunched provided",
                    });
                }
            }
        }

        const updatedPublication = await db.academicPublication.update({
            where: { id: publicationId },
            data: {
                ...(parsedSubCategoryId !== undefined && { subCategoryId: parsedSubCategoryId }),
                ...(title !== undefined && { title: title.trim() }),
                ...(publisher !== undefined && { publisher }),
                ...(publicationType !== undefined && { publicationType }),
                ...(openAccessType !== undefined && { openAccessType }),
                ...(workflow !== undefined && { workflow }),
                ...(acronym !== undefined && { acronym: acronym ? String(acronym).trim() : null }),
                ...(issn !== undefined && { issn: issn ? String(issn).trim() : null }),
                ...(eissn !== undefined && { eissn: eissn ? String(eissn).trim() : null }),
                ...(issnCdrom !== undefined && { issnCdrom: issnCdrom ? String(issnCdrom).trim() : null }),
                ...(URL !== undefined && { URL: URL ? String(URL).trim() : null }),
                ...(parsedYearLunched !== undefined && { yearLunched: parsedYearLunched }),
                ...(specificFocusScope !== undefined && { specificFocusScope: specificFocusScope ? String(specificFocusScope).trim() : null }),
                ...(licenseType !== undefined && { licenseType: licenseType ?? null }),
                ...(journalScope !== undefined && { journalScope: journalScope ? String(journalScope).trim() : null }),
                ...(imprint !== undefined && { imprint: imprint ? String(imprint).trim() : null }),
                ...(subBucket !== undefined && { subBucket: subBucket ?? null }),
            },
            include: {
                subCategory: true,
            },
        });

        return res.status(200).json({
            success: true,
            data: updatedPublication,
            message: "Publication updated successfully",
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                const target = (error.meta?.target as string[])?.join(", ") || "field";
                return res.status(409).json({
                    success: false,
                    message: `Update failed: A publication with this ${target} already exists.`,
                    duplicateFields: error.meta?.target,
                });
            }
        }

        if (error instanceof Prisma.PrismaClientValidationError) {
            return res.status(400).json({
                success: false,
                message: "Invalid field format or enum value provided.",
            });
        }

        console.error("Error updating publication:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const deletePublicationController = async (req, res) => {
    try {
        const { id } = req.params;
        const publicationId = parseInt(String(id), 10);

        if (isNaN(publicationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid publication ID provided",
            });
        }

        const existingPublication = await db.academicPublication.findUnique({
            where: { id: publicationId },
        });

        if (!existingPublication) {
            return res.status(404).json({
                success: false,
                message: "Publication not found",
            });
        }

        await db.academicPublication.delete({
            where: { id: publicationId },
        });

        return res.status(200).json({
            success: true,
            message: "Publication deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting publication:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};