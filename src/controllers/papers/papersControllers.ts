import { db } from "../../db/db_config.js";

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

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));

        const where = {
            ...(search && {
                OR: [
                    { title: { contains: search } },
                    { subtitle: { contains: search } },
                    { journalTitle: { contains: search } },
                    { doi: { contains: search } },
                    { sourceName: { contains: search } },
                ],
            }),
            ...(year && { publicationYear: parseInt(year) }),
        };

        const validSortFields = ["publicationYear", "createdAt", "title", "journalTitle"];
        const orderBy = validSortFields.includes(sortBy)
            ? { [sortBy]: order === "asc" ? "asc" : "desc" }
            : { publicationYear: "desc" };

        const [papers, total] = await Promise.all([
            db.researchPaper.findMany({
                where,
                orderBy,
                skip: (pageNum - 1) * limitNum,
                take: limitNum,
                include: {
                    staff: {
                        select: { id: true, name: true },
                    },
                },
            }),
            db.researchPaper.count({ where }),
        ]);

        // BigInt is NOT JSON-serializable — convert putCode before sending
        const serialized = papers.map(p => ({
            ...p,
            putCode: p.putCode !== null ? p.putCode.toString() : null,
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