import { api, type Paginated } from "@/src/lib/api-client";
import type { GraduationProject, ProjectQuery } from "./project.type";

export const PROJECTS_PAGE_SIZE = 12;

export async function fetchProjects(
  { page = 1, limit = PROJECTS_PAGE_SIZE, search, university, universities, projectField, projectFields, year, yearRange, sponsorship }: ProjectQuery,
  signal?: AbortSignal,
): Promise<Paginated<GraduationProject>> {
  const { data } = await api.get<Paginated<GraduationProject>>("/projects", {
    params: {
      page,
      limit,
      search: search?.trim() || undefined,
      university: university || undefined,
      projectField: projectField || undefined,
      universities,
      projectFields,
      year: year || undefined,
      ...yearRange,
      sponsorship: sponsorship || undefined,
    },
    paramsSerializer: { indexes: null },
    signal,
  });
  return data;
}
