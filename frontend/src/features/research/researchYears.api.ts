import { api, type ApiResponse } from "@/src/lib/api-client";

export type YearRange = { fromYear: number; toYear: number } | null;

export type YearCatalog = "papers" | "projects";

export interface YearCount {
  year: number;
  count: number;
}

export interface ResearchYears {
  years: number[];
  counts: YearCount[];
}

export async function fetchResearchYears(
  catalog: YearCatalog,
  signal: AbortSignal,
): Promise<ResearchYears> {
  const { data } = await api.get<
    ApiResponse<number[]> & { counts?: YearCount[] }
  >(`/${catalog}/years`, {
    signal,
  });
  return { years: data.data, counts: data.counts ?? [] };
}
