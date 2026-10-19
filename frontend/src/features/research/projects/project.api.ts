import { api, type Paginated } from "@/src/lib/api-client";
import type { GraduationProject, ProjectFacets, ProjectQuery } from "./project.type";
import { buildFacets } from "./project.utils";

export const PROJECTS_PAGE_SIZE = 12;
// The API caps `limit` at 100; facets come from the most recent 100 projects
const FACET_SAMPLE_SIZE = 100;

export async function fetchProjects(
  { page = 1, limit = PROJECTS_PAGE_SIZE, search, university, projectField, year, sponsorship }: ProjectQuery,
  signal?: AbortSignal,
): Promise<Paginated<GraduationProject>> {
  const { data } = await api.get<Paginated<GraduationProject>>("/projects", {
    params: {
      page,
      limit,
      search: search?.trim() || undefined,
      university: university || undefined,
      projectField: projectField || undefined,
      year: year || undefined,
      sponsorship: sponsorship || undefined,
    },
    signal,
  });
  return data;
}

export async function fetchProjectFacets(signal?: AbortSignal): Promise<ProjectFacets> {
  const page = await fetchProjects({ page: 1, limit: FACET_SAMPLE_SIZE }, signal);
  return buildFacets(page.data ?? []);
}
