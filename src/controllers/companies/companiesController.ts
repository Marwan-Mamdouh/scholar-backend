import { db } from "../../db/db_config.js";

export const getCompaniesController = async (req, res) => {
    try {
        const {
            page = "1",
            limit = "10",
            sortBy = "id",
            sortOrder = "asc",
            search,
            name,
            industry,
            size,
            headquartersCountry,
        } = req.query;

        const pageNumber = Math.max(1, parseInt(page as string, 10) || 1);
        const limitNumber = Math.min(
            100,
            Math.max(1, parseInt(limit as string, 10) || 10)
        );

        const allowedSortFields = [
            "id",
            "name",
            "industry",
            "size",
            "headquartersCountry",
            "createdAt",
        ];

        const sortField = allowedSortFields.includes(sortBy as string)
            ? (sortBy as string)
            : "id";

        const sortDirection = sortOrder === "desc" ? "desc" : "asc";

        const where: any = {
            ...(search && {
                OR: [
                    {
                        name: {
                            contains: search as string,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        industry: {
                            contains: search as string,
                            mode: "insensitive" as const,
                        },
                    },
                ],
            }),

            ...(name && {
                name: {
                    contains: name as string,
                    mode: "insensitive" as const,
                },
            }),

            ...(industry && {
                industry: {
                    contains: industry as string,
                    mode: "insensitive" as const,
                },
            }),

            ...(size && {
                size: {
                    equals: size as string,
                    mode: "insensitive" as const,
                },
            }),

            ...(headquartersCountry && {
                headquartersCountry: {
                    contains: headquartersCountry as string,
                    mode: "insensitive" as const,
                },
            }),
        };

        const [companies, total] = await Promise.all([
            db.company.findMany({
                where,
                take: limitNumber,
                skip: (pageNumber - 1) * limitNumber,
                orderBy: {
                    [sortField]: sortDirection,
                },
            }),

            db.company.count({ where }),
        ]);

        return res.status(200).json({
            success: true,
            data: companies,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(total / limitNumber),
            },
            message: "Companies fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching companies:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const getCompanyByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = parseInt(id, 10);

        if (isNaN(companyId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid company ID provided",
            });
        }

        const company = await db.company.findUnique({
            where: { id: companyId },
            include: {
                branches: true,
                jobs: true,
                graduationProjects: true,
            },
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: company,
            message: "Company fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching company by ID:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const createCompanyController = async (req, res) => {
    try {
        const {
            name,
            industry,
            size,
            website,
            linkedin,
            glassdoor,
            headquartersCountry,
        } = req.body;

        if (!name || typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Company name is required",
            });
        }

        const existingCompany = await db.company.findUnique({
            where: { name: name.trim() },
        });

        if (existingCompany) {
            return res.status(409).json({
                success: false,
                message: "A company with this name already exists",
            });
        }

        const newCompany = await db.company.create({
            data: {
                name: name.trim(),
                industry: industry ? String(industry).trim() : null,
                size: size ? String(size).trim() : null,
                website: website ? String(website).trim() : null,
                linkedin: linkedin ? String(linkedin).trim() : null,
                glassdoor: glassdoor ? String(glassdoor).trim() : null,
                headquartersCountry: headquartersCountry
                    ? String(headquartersCountry).trim()
                    : null,
            },
        });

        return res.status(201).json({
            success: true,
            data: newCompany,
            message: "Company created successfully",
        });
    } catch (error) {
        console.error("Error creating company:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};




export const updateCompanyController = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = parseInt(id, 10);

        if (isNaN(companyId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid company ID provided",
            });
        }

        const {
            name,
            industry,
            size,
            website,
            linkedin,
            glassdoor,
            headquartersCountry,
        } = req.body;

        const existingCompany = await db.company.findUnique({
            where: { id: companyId },
        });

        if (!existingCompany) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        if (name && name.trim() !== existingCompany.name) {
            const duplicateNameCompany = await db.company.findUnique({
                where: { name: name.trim() },
            });

            if (duplicateNameCompany) {
                return res.status(409).json({
                    success: false,
                    message: "A company with this name already exists",
                });
            }
        }

        const updatedCompany = await db.company.update({
            where: { id: companyId },
            data: {
                ...(name !== undefined && { name: name.trim() }),
                ...(industry !== undefined && {
                    industry: industry ? String(industry).trim() : null,
                }),
                ...(size !== undefined && {
                    size: size ? String(size).trim() : null,
                }),
                ...(website !== undefined && {
                    website: website ? String(website).trim() : null,
                }),
                ...(linkedin !== undefined && {
                    linkedin: linkedin ? String(linkedin).trim() : null,
                }),
                ...(glassdoor !== undefined && {
                    glassdoor: glassdoor ? String(glassdoor).trim() : null,
                }),
                ...(headquartersCountry !== undefined && {
                    headquartersCountry: headquartersCountry
                        ? String(headquartersCountry).trim()
                        : null,
                }),
            },
        });

        return res.status(200).json({
            success: true,
            data: updatedCompany,
            message: "Company updated successfully",
        });
    } catch (error) {
        console.error("Error updating company:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};



export const deleteCompanyController = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = parseInt(id, 10);

        if (isNaN(companyId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid company ID provided",
            });
        }

        const existingCompany = await db.company.findUnique({
            where: { id: companyId },
        });

        if (!existingCompany) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        await db.company.delete({
            where: { id: companyId },
        });

        return res.status(200).json({
            success: true,
            message: "Company deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting company:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};