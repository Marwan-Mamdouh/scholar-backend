export type DecimalString = string;

export type PublicationAccessType =
  | "Hybrid"
  | "Full_Open_Access"
  | "Golden_Open_Access"
  | "Diamond_Open_Access"
  | "Green_Open_Access"
  | "Bronze_Open_Access"
  | "Subscriber_Based_Access";

export type LicenseType =
  | "CC"
  | "CC_BY"
  | "CC_BY_SA"
  | "CC_BY_NC"
  | "CC_BY_ND"
  | "CC_BY_NC_ND";

export type PublicationType = "Transaction" | "Magazine" | "Journal" | "Letter";

export type Publisher =
  | "IEEE"
  | "APS"
  | "RoyalSociety"
  | "ACS"
  | "ACM"
  | "TaylorAFrancis"
  | "Oxford"
  | "ElSevier"
  | "Springer"
  | "Sage"
  | "MDPI";

export type Quartile = "Q1" | "Q2" | "Q3" | "Q4";

export type PublicationIndex = "SCIE" | "ESCI" | "SSCI";

export type Workflow = "standard" | "non_standard";

export interface PublicationSubCategory {
  id: number;
  domainId: number;
  name: string;
  domain?: { id: number; name: string };
}

export interface PublicationDomain {
  id: number;
  name: string;
  subCategories: PublicationSubCategory[];
}

export interface PublicationYearlyMetric {
  id: number;
  publicationId: number;
  metricYear: number;
  indexingService: PublicationIndex | null;
  impactFactor: DecimalString | null;
  impactFactor5yr: DecimalString | null;
  quartile: Quartile | null;
  jci: DecimalString | null;
  sjr: DecimalString | null;
  h5Index: DecimalString | null;
  eigenfactor: DecimalString | null;
  articleInfluenceScore: DecimalString | null;
  citescore: DecimalString | null;
  totalCitations: number;
  articleDownloads: number;
}

export interface PublicationPricing {
  id: number;
  publicationId: number;
  pricingYear: number;
  currency: string;
  cost: DecimalString;
  isSubscription: boolean | null;
}

export interface PublicationEditorialStat {
  id: number;
  publicationId: number;
  submissionToFirstDecision: DecimalString | null;
  submissionToReviewDecision: DecimalString | null;
  submissionToAcceptance: DecimalString | null;
  acceptanceToPublication: DecimalString | null;
  acceptanceRate: DecimalString | null;
}

export interface Publication {
  id: number;
  subCategoryId: number;
  acronym: string | null;
  publisher: Publisher;
  publicationType: PublicationType;
  title: string;
  issn: string | null;
  eissn: string | null;
  issnCdrom: string | null;
  URL: string | null;
  yearLunched: number | null;
  openAccessType: PublicationAccessType;
  specificFocusScope: string | null;
  workflow: Workflow;
  licenseType: LicenseType | null;
  journalScope: string | null;
  imprint: string | null;
  subBucket: string | null;
  subCategory: PublicationSubCategory;
  yearlyMetrics: PublicationYearlyMetric[];
  pricings: PublicationPricing[];
  editorialStats: PublicationEditorialStat[];
}

export interface PublicationFilterResponse {
  data: Publication[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface NumericRange {
  min: number;
  max: number;
}

export interface PublicationFilterRanges {
  impactFactor: NumericRange;
  sjr: NumericRange;
  citeScore: NumericRange;
  firstDecisionWeeks: NumericRange;
  submissionToAcceptanceWeeks: NumericRange;
}

export interface RangeValue {
  min?: number;
  max?: number;
}

export interface PublicationFilterState {
  search: string;
  categoryIds: number[];
  publishingModel: PublicationAccessType[];
  licensing: LicenseType[];
  quartiles: Quartile[];
  impactFactor: RangeValue;
  sjr: RangeValue;
  citeScore: RangeValue;
  currency: string;
  maxCost?: number;
  firstDecisionWeeks: RangeValue;
  submissionToAcceptanceWeeks: RangeValue;
}
