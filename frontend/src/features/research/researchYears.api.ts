import { api, type ApiResponse } from "@/src/lib/api-client";

export type YearRange = { fromYear: number; toYear: number } | null;

export type YearCatalog = "papers" | "projects";

export async function fetchResearchYears(
  catalog: YearCatalog,
  signal: AbortSignal,
) {
  const { data } = await api.get<ApiResponse<number[]>>(`/${catalog}/years`, {
    signal,
  });
  return data.data;
}
