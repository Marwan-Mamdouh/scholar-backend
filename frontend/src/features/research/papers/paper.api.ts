import { api, type Paginated } from "@/src/lib/api-client";

export interface ResearchPaper {
  id: number;
  title: string;
  subtitle: string | null;
  journalTitle: string | null;
  publicationYear: number | null;
  sourceName: string | null;
  type: string | null;
  doi: string | null;
  url: string | null;
  publicationMonth: number | null;
  publicationDay: number | null;
  orcidPath: string | null;
  putCode: string | null;
  staff: { id: number; name: string } | null;
}

export async function fetchPapers(
  search: string,
  year: string,
  page: number,
  signal: AbortSignal,
): Promise<Paginated<ResearchPaper>> {
  const { data } = await api.get<Paginated<ResearchPaper>>("/papers", {
    params: {
      search: search || undefined,
      year: year || undefined,
      page,
      limit: 12,
    },
    signal,
  });
  return data;
}
