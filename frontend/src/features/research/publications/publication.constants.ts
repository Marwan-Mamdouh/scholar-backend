import type {
  LicenseType,
  PublicationAccessType,
  PublicationFilters,
  Publisher,
} from "./publication.type";

export const ACCESS_TYPE_LABELS: Record<PublicationAccessType, string> = {
  Hybrid: "Hybrid",
  Full_Open_Access: "Full Open Access",
  Golden_Open_Access: "Golden Open Access",
  Diamond_Open_Access: "Diamond Open Access",
  Green_Open_Access: "Green Open Access",
  Bronze_Open_Access: "Bronze Open Access",
  Subscriber_Based_Access: "Subscriber Based Access",
};

export const LICENSE_LABELS: Record<LicenseType, string> = {
  CC: "CC",
  CC_BY: "CC BY",
  CC_BY_SA: "CC BY-SA",
  CC_BY_NC: "CC BY-NC",
  CC_BY_ND: "CC BY-ND",
  CC_BY_NC_ND: "CC BY-NC-ND",
};

export const PUBLISHER_LABELS: Record<Publisher, string> = {
  IEEE: "IEEE",
  APS: "APS",
  RoyalSociety: "Royal Society",
  ACS: "ACS",
  ACM: "ACM",
  TaylorAFrancis: "Taylor & Francis",
  Oxford: "Oxford",
  ElSevier: "Elsevier",
  Springer: "Springer",
  Sage: "Sage",
  MDPI: "MDPI",
};

export const EMPTY_FILTERS: PublicationFilters = {
  categoryIds: [],
  publicationTypes: [],
  accessModels: [],
  publishers: [],
  quartiles: [],
};
