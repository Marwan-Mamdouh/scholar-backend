import { db } from "../../db/db_config.js";

export const getJobsController = async (req, res) => {
    try {
        const {
            page = "1",
            limit = "10",
            sortBy = "id",
            sortOrder = "asc",
            search,
            country,
            discipline,
            company,
            type,
            seniority,
        } = req.query;

        const pageNumber = Math.max(1, parseInt(page as string, 10) || 1);
        const limitNumber = Math.min(
            100,
            Math.max(1, parseInt(limit as string, 10) || 10)
        );

        const allowedSortFields = [
            "id",
            "title",
            "industry",
            "type",
            "seniority",
            "postedAt",
            "createdAt",
        ];

        const sortField = allowedSortFields.includes(sortBy as string)
            ? (sortBy as string)
            : "postedAt";

        const sortDirection = sortOrder === "asc" ? "asc" : "desc";

        const where: any = {
            ...(search && {
                OR: [
                    {
                        title: {
                            contains: search as string,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        description: {
                            contains: search as string,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        requirements: {
                            contains: search as string,
                            mode: "insensitive" as const,
                        },
                    },
                ],
            }),

            ...(discipline && {
                industry: {
                    contains: discipline as string,
                    mode: "insensitive" as const,
                },
            }),

            ...(type && {
                type: type as any,
            }),

            ...(seniority && {
                seniority: seniority as any,
            }),

            ...(company && {
                OR: [
                    ...(isNaN(parseInt(company as string, 10))
                        ? []
                        : [{ companyId: parseInt(company as string, 10) }]),
                    {
                        company: {
                            name: {
                                contains: company as string,
                                mode: "insensitive" as const,
                            },
                        },
                    },
                ],
            }),

            ...(country && {
                branch: {
                    country: {
                        contains: country as string,
                        mode: "insensitive" as const,
                    },
                },
            }),
        };

        const [jobs, total] = await Promise.all([
            db.job.findMany({
                where,
                take: limitNumber,
                skip: (pageNumber - 1) * limitNumber,
                orderBy: {
                    [sortField]: sortDirection,
                },
                include: {
                    company: {
                        select: {
                            id: true,
                            name: true,
                            website: true,
                            headquartersCountry: true,
                        },
                    },
                    branch: {
                        select: {
                            id: true,
                            city: true,
                            country: true,
                        },
                    },
                },
            }),

            db.job.count({ where }),
        ]);

        return res.status(200).json({
            success: true,
            data: jobs,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(total / limitNumber),
            },
            message: "Jobs fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getJobByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const jobId = parseInt(id, 10);

        if (isNaN(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job ID provided",
            });
        }

        const job = await db.job.findUnique({
            where: { id: jobId },
            include: {
                company: true,
                branch: true,
                applications: true,
            },
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: job,
            message: "Job fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching job by ID:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const createJobController = async (req, res) => {
    try {
        const {
            companyId,
            branchId,
            title,
            industry,
            domains,
            type,
            seniority,
            description,
            requirements,
            salary,
            applyLink,
        } = req.body;

        if (!title || typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Job title is required",
            });
        }

        const parsedCompanyId = parseInt(companyId, 10);
        const parsedBranchId = parseInt(branchId, 10);

        if (isNaN(parsedCompanyId) || isNaN(parsedBranchId)) {
            return res.status(400).json({
                success: false,
                message: "Valid companyId and branchId are required",
            });
        }

        const [companyExists, branchExists] = await Promise.all([
            db.company.findUnique({ where: { id: parsedCompanyId } }),
            db.companyBranch.findUnique({ where: { id: parsedBranchId } }),
        ]);

        if (!companyExists) {
            return res.status(404).json({
                success: false,
                message: "Associated company not found",
            });
        }

        if (!branchExists) {
            return res.status(404).json({
                success: false,
                message: "Associated branch not found",
            });
        }

        const newJob = await db.job.create({
            data: {
                companyId: parsedCompanyId,
                branchId: parsedBranchId,
                title: title.trim(),
                industry: industry ? String(industry).trim() : null,
                domains: domains ?? null,
                type: type ?? null,
                seniority: seniority ?? null,
                description: description ? String(description).trim() : null,
                requirements: requirements ? String(requirements).trim() : null,
                salary: salary ? String(salary).trim() : null,
                applyLink: applyLink ? String(applyLink).trim() : null,
            },
        });

        return res.status(201).json({
            success: true,
            data: newJob,
            message: "Job created successfully",
        });
    } catch (error) {
        console.error("Error creating job:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const updateJobController = async (req, res) => {
    try {
        const { id } = req.params;
        const jobId = parseInt(id, 10);

        if (isNaN(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job ID provided",
            });
        }

        const existingJob = await db.job.findUnique({
            where: { id: jobId },
        });

        if (!existingJob) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        const {
            companyId,
            branchId,
            title,
            industry,
            domains,
            type,
            seniority,
            description,
            requirements,
            salary,
            applyLink,
        } = req.body;

        const updatedJob = await db.job.update({
            where: { id: jobId },
            data: {
                ...(companyId !== undefined && {
                    companyId: parseInt(companyId, 10),
                }),
                ...(branchId !== undefined && {
                    branchId: parseInt(branchId, 10),
                }),
                ...(title !== undefined && { title: title.trim() }),
                ...(industry !== undefined && {
                    industry: industry ? String(industry).trim() : null,
                }),
                ...(domains !== undefined && { domains: domains ?? null }),
                ...(type !== undefined && { type: type ?? null }),
                ...(seniority !== undefined && { seniority: seniority ?? null }),
                ...(description !== undefined && {
                    description: description ? String(description).trim() : null,
                }),
                ...(requirements !== undefined && {
                    requirements: requirements ? String(requirements).trim() : null,
                }),
                ...(salary !== undefined && {
                    salary: salary ? String(salary).trim() : null,
                }),
                ...(applyLink !== undefined && {
                    applyLink: applyLink ? String(applyLink).trim() : null,
                }),
            },
        });

        return res.status(200).json({
            success: true,
            data: updatedJob,
            message: "Job updated successfully",
        });
    } catch (error) {
        console.error("Error updating job:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const deleteJobController = async (req, res) => {
    try {
        const { id } = req.params;
        const jobId = parseInt(id, 10);

        if (isNaN(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job ID provided",
            });
        }

        const existingJob = await db.job.findUnique({
            where: { id: jobId },
        });

        if (!existingJob) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        await db.job.delete({
            where: { id: jobId },
        });

        return res.status(200).json({
            success: true,
            message: "Job deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting job:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};