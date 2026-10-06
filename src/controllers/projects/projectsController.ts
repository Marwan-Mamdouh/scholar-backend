
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

            ...(university && {
                university: {
                    contains: university,
                    mode: "insensitive" as const,
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




export const getProjectsByIdController = async (req, res) => {
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
                applications: true,
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