import { api } from "@/src/lib/api-client";
import { PAGE_SIZE } from "./jobs.constants";
import type { JobFilters, JobsResponse } from "./jobs.type";

export function buildJobsQuery(filters: JobFilters): string {
  const params = new URLSearchParams({
    page: String(filters.page),
    limit: String(PAGE_SIZE),
    sortBy: filters.sort === "title" ? "title" : "postedAt",
    sortOrder: filters.sort === "newest" ? "desc" : "asc",
  });
  for (const key of [
    "search",
    "type",
    "seniority",
  ] as const) {
    const value = filters[key].trim();
    if (value) params.set(key, value);
  }
  for (const key of ["countries", "disciplines", "companyIds"] as const) {
    for (const value of filters[key]) params.append(key, String(value));
  }
  return params.toString();
}

export async function fetchJobs(
  query: string,
  signal: AbortSignal,
): Promise<JobsResponse> {
  const { data } = await api.get<JobsResponse>("/jobs", {
    params: new URLSearchParams(query),
    signal,
  });
  return data;
}
