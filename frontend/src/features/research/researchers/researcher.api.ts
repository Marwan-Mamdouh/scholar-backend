import { api, type ApiResponse, type Paginated } from "@/src/lib/api-client";
import type {
  AcademicResearcher,
  ResearcherQuery,
  ScholarAnalysisResponse,
  ScholarProfile,
  ScholarSearchResponse,
} from "./researcher.type";
import { cleanName, fullName, toScholarProfile } from "./researcher.utils";

export const RESEARCHERS_PAGE_SIZE = 12;

export async function fetchResearchers(
  { page = 1, limit = RESEARCHERS_PAGE_SIZE }: ResearcherQuery,
  signal?: AbortSignal,
): Promise<Paginated<AcademicResearcher>> {
  const { data } = await api.get<Paginated<AcademicResearcher>>(
    "/researchers",
    { params: { page, limit }, signal },
  );
  return data;
}

export async function fetchResearcher(
  id: number,
  signal?: AbortSignal,
): Promise<AcademicResearcher> {
  const { data } = await api.get<ApiResponse<AcademicResearcher>>(
    `/researchers/${id}`,
    { signal },
  );
  return data.data;
}

/**
 * Same lookup the legacy researchers service used: a numeric scholarId is already a
 * Semantic Scholar author id; anything else means "search S2 by name, take the top hit".
 */
export async function resolveScholarAuthorId(
  researcher: AcademicResearcher,
  signal?: AbortSignal,
): Promise<string | null> {
  const storedId = researcher.scholarId?.trim() ?? "";
  if (/^\d+$/.test(storedId)) return storedId;

  const query = cleanName(fullName(researcher));
  if (!query) return null;

  const { data } = await api.get<ScholarSearchResponse>("/search", {
    params: { query, limit: 1 },
    signal,
  });
  return data.authors?.[0]?.authorId ?? null;
}

/** Papers, metrics and co-authors from Semantic Scholar, or null when no author matches. */
export async function fetchScholarProfile(
  researcher: AcademicResearcher,
  signal?: AbortSignal,
): Promise<ScholarProfile | null> {
  const authorId = await resolveScholarAuthorId(researcher, signal);
  if (!authorId) return null;

  const { data } = await api.post<ScholarAnalysisResponse>(
    "/analyze",
    { authorId },
    { signal },
  );
  return toScholarProfile(data.author, data.collaborators);
}
