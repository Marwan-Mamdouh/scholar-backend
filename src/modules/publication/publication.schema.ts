import z, { int } from "zod";
import { PublicationType, PublicationAccessType, PublicationIndex, Quartile } from "@prisma/client";

export const domainSchema = z.object({
    name: z.string(),
});

export const domainFilterSchema = z.object({
    id: z.int(),
});

export const subCategorySchema = z.object({
    name: z.string(),
    domainId: z.int()
});

export const subCategoryFilterSchema = z.object({
    id: z.int(),
});



export const publicationSchema = z.object({
    subCategoryId: z.number().int(), 
    acronym: z.string().max(100).optional(), 
    publicationType: z.enum(PublicationType), 
    title: z.string(),
    issn: z.string().length(8).optional(), 
    eissn: z.string().length(8).optional(),
    openAccessType: z.enum(PublicationAccessType), 
    specificFocusScope: z.string().max(500).optional(), 
    websiteLink: z.url().max(500).optional(), 
    journalScope: z.string().optional(), 
});

export const publicationPatchSchema = z.object({
    id: z.int(),
    subCategoryId: z.number().int(), 
    acronym: z.string().max(100).optional(), 
    publicationType: z.enum(PublicationType), 
    title: z.string(),
    issn: z.string().length(8).optional(), 
    eissn: z.string().length(8).optional(),
    openAccessType: z.enum(PublicationAccessType), 
    specificFocusScope: z.string().max(500).optional(), 
    websiteLink: z.url().max(500).optional(), 
    journalScope: z.string().optional(), 
});

export const publicationIDSchema = z.object({
    id: z.int()
});

export const publicationMetricsIDSchema = z.object({
    id: z.int()
});

export const publicationMetricsSchema = z.object({
  publicationId: z.number().int(),
  metricYear: z.number().int(),
  indexingService: z.nativeEnum(PublicationIndex).optional(),
  journalImpactFactor: z.number().optional(),
  fiveYearImpactFactor: z.number().optional(),
  quartile: z.nativeEnum(Quartile).optional(),
  jci: z.number().optional(),
  eigenfactor: z.number().optional(),
  articleInfluenceScore: z.number().optional(),
  citescore: z.number().optional(),
});

export const publicationMetricsPatchSchema = z.object({
  id: z.int(),
  publicationId: z.number().int(),
  metricYear: z.number().int(),
  indexingService: z.enum(PublicationIndex).optional(),
  journalImpactFactor: z.number().optional(),
  fiveYearImpactFactor: z.number().optional(),
  quartile: z.enum(Quartile).optional(),
  jci: z.number().optional(),
  eigenfactor: z.number().optional(),
  articleInfluenceScore: z.number().optional(),
  citescore: z.number().optional(),
});

export type publicationMetricsPatch = z.infer<typeof publicationMetricsPatchSchema>;
export type publicationMetricsID = z.infer<typeof publicationMetricsIDSchema>;
export type publicationMetrics = z.infer<typeof publicationMetricsSchema>;
export type publicationPatch = z.infer<typeof publicationPatchSchema>;
export type publicationID = z.infer<typeof publicationIDSchema>;
export type subCategoryFilter = z.infer<typeof subCategoryFilterSchema>;
export type domainFilter = z.infer<typeof domainFilterSchema>;
export type publication = z.infer<typeof publicationSchema>;
export type subCategory = z.infer<typeof subCategorySchema>;
export type domain = z.infer<typeof domainSchema>;
