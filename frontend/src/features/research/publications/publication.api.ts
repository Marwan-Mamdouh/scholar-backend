import { apiGet } from "@/src/lib/api-client";
import type {
  NumericRange,
  Publication,
  PublicationDomain,
  PublicationFilterRanges,
  PublicationFilterResponse,
  PublicationFilterState,
  RangeValue,
} from "./publication.type";

export function isRangeActive(
  value: RangeValue,
  bound?: NumericRange,
): boolean {
  if (value.min === undefined && value.max === undefined) return false;
  if (!bound) return true;

  const narrowsMin = value.min !== undefined && value.min > bound.min;
  const narrowsMax = value.max !== undefined && value.max < bound.max;
  return narrowsMin || narrowsMax;
}

function activeRange(
  value: RangeValue,
  bound?: NumericRange,
): RangeValue | undefined {
  return isRangeActive(value, bound) ? value : undefined;
}

function appendRange(
  params: URLSearchParams,
  prefix: string,
  value: RangeValue | undefined,
): void {
  if (!value) return;
  if (value.min !== undefined) params.set(`${prefix}Min`, String(value.min));
  if (value.max !== undefined) params.set(`${prefix}Max`, String(value.max));
}

export function buildSearchParams(
  filters: PublicationFilterState,
  ranges?: PublicationFilterRanges,
): URLSearchParams {
  const params = new URLSearchParams();

  const query = filters.search.trim();
  if (query) params.set("q", query);

  if (filters.categoryIds.length) {
    params.set("categoryIds", filters.categoryIds.join(","));
  }

  if (filters.publishingModel.length) {
    params.set("publishingModel", filters.publishingModel.join(","));
  }

  if (filters.licensing.length) {
    params.set("licensing", filters.licensing.join(","));
  }

  if (filters.quartiles.length) {
    params.set("quartiles", filters.quartiles.join(","));
  }

  if (filters.maxCost !== undefined) {
    params.set("currency", filters.currency);
    params.set("maxCost", String(filters.maxCost));
  }

  appendRange(
    params,
    "impactFactor",
    activeRange(filters.impactFactor, ranges?.impactFactor),
  );
  appendRange(params, "sjr", activeRange(filters.sjr, ranges?.sjr));
  appendRange(
    params,
    "citeScore",
    activeRange(filters.citeScore, ranges?.citeScore),
  );
  appendRange(
    params,
    "firstDecisionWeeks",
    activeRange(filters.firstDecisionWeeks, ranges?.firstDecisionWeeks),
  );
  appendRange(
    params,
    "submissionToAcceptanceWeeks",
    activeRange(
      filters.submissionToAcceptanceWeeks,
      ranges?.submissionToAcceptanceWeeks,
    ),
  );

  return params;
}

export async function fetchPublications(
  filters: PublicationFilterState,
  ranges?: PublicationFilterRanges,
  init?: RequestInit,
): Promise<Publication[]> {
  const params = buildSearchParams(filters, ranges);
  const { data } = await apiGet<PublicationFilterResponse>(
    `/publication/search?${params.toString()}`,
    init,
  );
  return data ?? [];
}

export function fetchFilterRanges(): Promise<PublicationFilterRanges> {
  return apiGet<PublicationFilterRanges>("/publication/filter", {
    next: { revalidate: 300 },
  });
}

export function fetchDomains(): Promise<PublicationDomain[]> {
  return apiGet<PublicationDomain[]>("/publication/domain", {
    next: { revalidate: 300 },
  });
}
