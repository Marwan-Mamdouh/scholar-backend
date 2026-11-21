import { Prisma, PublicationAccessType, PublicationType, Publisher, Quartile } from "@prisma/client";
import { z } from "zod";
import { db } from "../../db/db_config.js";

const list = <T extends z.ZodType<unknown, string>>(item: T) =>
    z.string().transform(value => value.split(",")).pipe(z.array(item)).optional();

export const publicationFilterSchema = z.object({
    categoryIds: list(z.string().regex(/^[1-9]\d*$/).transform(Number).pipe(z.number().int().max(2147483647))),
    publicationTypes: list(z.enum(PublicationType)),
    accessModels: list(z.enum(PublicationAccessType)),
    publishers: list(z.enum(Publisher)),
    quartiles: list(z.enum(Quartile)),
});

type PublicationFilters = z.infer<typeof publicationFilterSchema>;

export const publicationMetricOrder = [
    { metricYear: "desc" },
    { id: "desc" },
] satisfies Prisma.PublicationYearlyMetricOrderByWithRelationInput[];

const latestMetrics = Prisma.sql`
    SELECT DISTINCT ON ("publicationId") "publicationId", quartile
    FROM "publicationYearlyMetrics"
    ORDER BY "publicationId", "metricYear" DESC, id DESC
`;

export async function publicationFilterWhere({
    categoryIds, publicationTypes, accessModels, publishers, quartiles,
}: PublicationFilters): Promise<Prisma.AcademicPublicationWhereInput> {
    const where: Prisma.AcademicPublicationWhereInput = {
        ...(categoryIds?.length && { subCategoryId: { in: categoryIds } }),
        ...(publicationTypes?.length && { publicationType: { in: publicationTypes } }),
        ...(accessModels?.length && { openAccessType: { in: accessModels } }),
        ...(publishers?.length && { publisher: { in: publishers } }),
    };

    if (quartiles?.length) {
        const rows = await db.$queryRaw<{ publicationId: number }[]>`
            SELECT "publicationId" FROM (${latestMetrics}) AS latest
            WHERE quartile::text IN (${Prisma.join(quartiles)})
        `;
        where.id = { in: rows.map(row => row.publicationId) };
    }

    return where;
}

export async function getPublicationFacets() {
    const [subjects, groups, latestQuartiles] = await Promise.all([
        db.publicationSubCategory.findMany({
            where: { publications: { some: {} } },
            select: { id: true, name: true, domainId: true, domain: { select: { id: true, name: true } } },
            orderBy: [{ domain: { name: "asc" } }, { name: "asc" }, { id: "asc" }],
        }),
        db.academicPublication.groupBy({
            by: ["publicationType", "openAccessType", "publisher"],
        }),
        db.$queryRaw<{ quartile: Quartile }[]>`
            SELECT DISTINCT quartile FROM (${latestMetrics}) AS latest
            WHERE quartile IS NOT NULL
            ORDER BY quartile
        `,
    ]);

    return {
        subjects,
        publicationTypes: [...new Set(groups.map(group => group.publicationType))].sort(),
        accessModels: [...new Set(groups.map(group => group.openAccessType))].sort(),
        publishers: [...new Set(groups.map(group => group.publisher))].sort(),
        quartiles: latestQuartiles.map(metric => metric.quartile),
    };
}
