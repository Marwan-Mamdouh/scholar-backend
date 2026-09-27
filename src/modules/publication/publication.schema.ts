import z, { int } from "zod";
import { PublicationType, PublicationAccessType, PublicationIndex, Quartile, LicenseType, Publisher, Workflow, SubBucket } from "@prisma/client";

// Reusable schema for range sliders (Impact Factor, SJR, Weeks)
const rangeSchema = z
  .object({
    min: z.number().min(0, "Minimum value cannot be negative").optional(),
    max: z.number().min(0, "Maximum value cannot be negative").optional(),
  })
  .refine(
    (data) => {
      if (data.min !== undefined && data.max !== undefined) {
        return data.min <= data.max;
      }
      return true;
    },
    { message: "'min' must be less than or equal to 'max'" }
  );

// Reusable schema for Percentage ranges (0% - 100%)
const percentRangeSchema = z
  .object({
    min: z.number().min(0).max(100, "Percentage cannot exceed 100%").optional(),
    max: z.number().min(0).max(100, "Percentage cannot exceed 100%").optional(),
  })
  .refine(
    (data) => {
      if (data.min !== undefined && data.max !== undefined) {
        return data.min <= data.max;
      }
      return true;
    },
    { message: "'min' must be less than or equal to 'max'" }
  );

// Helpers for parsing query-string filters (comma-separated values, string coercion)
const numParam = z.preprocess(
  (v) => (v === undefined || v === "" ? undefined : Number(v)),
  z.number().optional()
);

const csvPreprocess = <T,>(
  v: unknown,
  cast: (s: string) => T
) =>
  typeof v === "string" && v.trim() !== ""
    ? v.split(",").map((s) => s.trim()).filter(Boolean).map(cast)
    : undefined;

const csvIntArray = z.preprocess(
  (v) => csvPreprocess(v, (s) => Number(s)),
  z.array(z.number().int())
).optional();

const csvEnumArray = <T extends z.ZodTypeAny>(e: T) =>
  z
    .preprocess((v) => csvPreprocess(v, (s) => s), z.array(e))
    .optional();

// GET /search query schema (filters flattened into query-string params)
export const publicationSearchQuerySchema = z.object({
  q: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().optional()
  ),

  categoryIds: csvIntArray,

  publishingModel: csvEnumArray(z.nativeEnum(PublicationAccessType)),

  licensing: csvEnumArray(z.nativeEnum(LicenseType)),

  currency: z
    .string()
    .length(3, "Currency code must be 3 letters (e.g. USD)")
    .transform((val) => val.toUpperCase())
    .optional(),

  maxCost: numParam,

  quartiles: csvEnumArray(z.nativeEnum(Quartile)),

  impactFactorMin: numParam,
  impactFactorMax: numParam,

  sjrMin: numParam,
  sjrMax: numParam,

  citeScoreMin: numParam,
  citeScoreMax: numParam,

  firstDecisionWeeksMin: numParam,
  firstDecisionWeeksMax: numParam,

  submissionToAcceptanceWeeksMin: numParam,
  submissionToAcceptanceWeeksMax: numParam,
});

export const publicationEditorialStatSchema = z.object({
  publicationId: z.number().int(),
  submissionToFirstDecision: z.number().nonnegative().optional().nullable(),
  submissionToReviewDecision: z.number().nonnegative().optional().nullable(),
  submissionToAcceptance: z.number().nonnegative().optional().nullable(),
  acceptanceToPublication: z.number().nonnegative().optional().nullable(),
  acceptanceRate: z
    .number()
    .min(0, "Acceptance rate cannot be negative")
    .max(100, "Acceptance rate cannot exceed 100%")
    .optional()
    .nullable(),
});

export const publicationEditorialStatPatchSchema = z.object({
  id: z.number().int(),
  publicationId: z.number().int(),
  submissionToFirstDecision: z.number().nonnegative().optional().nullable(),
  submissionToReviewDecision: z.number().nonnegative().optional().nullable(),
  submissionToAcceptance: z.number().nonnegative().optional().nullable(),
  acceptanceToPublication: z.number().nonnegative().optional().nullable(),
  acceptanceRate: z
    .number()
    .min(0, "Acceptance rate cannot be negative")
    .max(100, "Acceptance rate cannot exceed 100%")
    .optional()
    .nullable(),
});

//
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
    acronym: z.string().max(100).optional().nullable(),
    publisher: z.enum(Publisher),
    publicationType: z.enum(PublicationType),
    title: z.string().min(1, "Title is required"),
    issn: z.string().length(8, "ISSN must be exactly 8 characters").optional().nullable(),
    eissn: z.string().length(8, "eISSN must be exactly 8 characters").optional().nullable(),
    issnCdrom: z.string().length(8, "CD-ROM ISSN must be exactly 8 characters").optional().nullable(),
    URL: z.string().url("Invalid URL format").max(500).optional().nullable(),
    yearLunched: z.number().int().min(1000).max(2100).optional().nullable(),
    openAccessType: z.enum(PublicationAccessType),
    specificFocusScope: z.string().max(500).optional().nullable(),
    workflow: z.enum(Workflow),
    licenseType: z.enum(LicenseType).optional().nullable(),
    journalScope: z.string().optional().nullable(),
    imprint: z.string().optional().nullable(),
    subBucket: z.enum(SubBucket),
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

export const publicationEditorialStatsIDSchema = z.object({
    id: z.int()
});

export const publicationMetricsIDSchema = z.object({
    id: z.int()
});

export const publicationMetricsSchema = z.object({
    publicationId: z.number().int(),
    metricYear: z.number().int().min(1900).max(2100),
    indexingService: z.enum(PublicationIndex).optional().nullable(),
    impactFactor: z.number().nonnegative().optional().nullable(),
    impactFactor5yr: z.number().nonnegative().optional().nullable(),
    quartile: z.enum(Quartile).optional().nullable(),
    jci: z.number().nonnegative().optional().nullable(),
    sjr: z.number().nonnegative().optional().nullable(),
    h5Index: z.number().nonnegative().optional().nullable(),
    eigenfactor: z.number().nonnegative().optional().nullable(),
    articleInfluenceScore: z.number().nonnegative().optional().nullable(),
    citescore: z.number().nonnegative().optional().nullable(),
    totalCitations: z.number().int().min(0, "Citations cannot be negative"),
  articleDownloads: z.number().int().min(0, "Downloads cannot be negative"),
});

export const publicationMetricsPatchSchema = z.object({
    id: z.int(),
    publicationId: z.number().int().optional(),
    metricYear: z.number().int().min(1900).max(2100),
    indexingService: z.enum(PublicationIndex).optional().nullable(),
    impactFactor: z.number().nonnegative().optional().nullable(),
    impactFactor5yr: z.number().nonnegative().optional().nullable(),
    quartile: z.enum(Quartile).optional().nullable(),
    jci: z.number().nonnegative().optional().nullable(),
    sjr: z.number().nonnegative().optional().nullable(),
    h5Index: z.number().nonnegative().optional().nullable(),
    eigenfactor: z.number().nonnegative().optional().nullable(),
    articleInfluenceScore: z.number().nonnegative().optional().nullable(),
    citescore: z.number().nonnegative().optional().nullable(),
    totalCitations: z.number().int().min(0, "Citations cannot be negative"),
  articleDownloads: z.number().int().min(0, "Downloads cannot be negative"),
});

export const publicationPricingPatchSchema = z.object({
  id: z.int(),
  publicationId: z.number().int(),
  pricingYear: z.number().int().min(1900).max(2100),
  currency: z
    .string()
    .length(3, "Currency must be a 3-letter ISO code (e.g., USD)")
    .transform((val) => val.toUpperCase()),
  cost: z.number().nonnegative("Cost cannot be negative"),
  isSubscription: z.boolean().optional().nullable().default(false),
});

export const publicationPricingSchema = z.object({
  publicationId: z.number().int(),
  pricingYear: z.number().int().min(1900).max(2100),
  currency: z
    .string()
    .length(3, "Currency must be a 3-letter ISO code (e.g., USD)")
    .transform((val) => val.toUpperCase()),
  cost: z.number().nonnegative("Cost cannot be negative"),
  isSubscription: z.boolean().optional().nullable().default(false),
});

// Infer TypeScript type automatically from Zod
export type publicationEditorialStatsID = z.infer<typeof publicationEditorialStatsIDSchema>;
export type PublicationPricing = z.infer<typeof publicationPricingSchema>;
export type PublicationPricingPatch = z.infer<typeof publicationPricingPatchSchema>;
export type PublicationEditorialStat = z.infer<typeof publicationEditorialStatSchema>;
export type PublicationEditorialStatPatch = z.infer<typeof publicationEditorialStatPatchSchema>;
export type publicationSearchQuery = z.infer<typeof publicationSearchQuerySchema>;
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
