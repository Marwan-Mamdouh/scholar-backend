import { db } from "../../db/db_config.js";
import type { Request, Response } from "express";





export const getAllResearchersController = async (req, res) => {
    const researchers = await db.academicResearcher.findMany();
    res.json(researchers);
};




export const getResearchersByQueryController = async (req, res) => {
    const {
        page = "1",
        limit = "10",
        sortBy = "id",
        sortOrder = "asc",
        mainTopic,
        subtopics,
        institutionName,
        researcher,
        scholarId,
        department,
    } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    const researchers = await db.academicResearcher.findMany({
        where: {
            ...(mainTopic && {
                mainTopic: {
                    contains: mainTopic as string,
                    mode: "insensitive",
                },
            }),

            ...(institutionName && {
                institutionName: {
                    contains: institutionName as string,
                    mode: "insensitive",
                },
            }),

            ...(researcher && {
                OR: [
                    {
                        firstName: {
                            contains: researcher as string,
                            mode: "insensitive",
                        },
                    },
                    {
                        lastName: {
                            contains: researcher as string,
                            mode: "insensitive",
                        },
                    },
                ],
            }),

            ...(scholarId && {
                scholarId: {
                    contains: scholarId as string,
                    mode: "insensitive",
                },
            }),

            ...(department && {
                department: {
                    contains: department as string,
                    mode: "insensitive",
                },
            }),
        },

        take: limitNumber,
        skip: (pageNumber - 1) * limitNumber,

        orderBy: {
            [sortBy as string]: sortOrder === "desc" ? "desc" : "asc",
        },
    });

    res.json(researchers);
};