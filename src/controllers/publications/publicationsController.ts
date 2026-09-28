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
            page = "1",
            limit = "10",
            sortBy = "id",
            sortOrder = "asc",
        } = req.query;

        const pageNumber = Math.max(1, parseInt(String(page), 10) || 1);
        const limitNumber = Math.min(
            100,
            Math.max(1, parseInt(String(limit), 10) || 10)
        );

        const sortField: SortField = ALLOWED_SORT_FIELDS.includes(
            sortBy as SortField
        )
            ? (sortBy as SortField)
            : "id";

        const order: "asc" | "desc" =
            String(sortOrder).toLowerCase() === "desc" ? "desc" : "asc";

        const [publications, total] = await Promise.all([
            db.academicPublication.findMany({
                take: limitNumber,
                skip: (pageNumber - 1) * limitNumber,
                orderBy: {
                    [sortField]: order,
                },
                include: {
                    subCategory: true,
                },
            }),
            db.academicPublication.count(),
        ]);

        res.status(200).json({
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
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};