import { connection } from "next/server";
import type { Paginated } from "@/src/lib/api-client";
import ProjectsExplorer from "./ProjectsExplorer";
import { fetchProjectFacets, fetchProjects } from "./project.api";
import type { GraduationProject, ProjectFacets } from "./project.type";

const NO_FACETS: ProjectFacets = { universities: [], fields: [] };

const ProjectsPanel = async () => {
  // Fetch on every request, not once at build time
  await connection();

  const [first, facets] = await Promise.allSettled([
    fetchProjects({ page: 1 }),
    fetchProjectFacets(),
  ]);

  let initialPage: Paginated<GraduationProject> | null = null;
  let initialError: string | undefined;
  if (first.status === "fulfilled") initialPage = first.value;
  else
    initialError =
      first.reason instanceof Error
        ? first.reason.message
        : "The projects service is unavailable.";

  return (
    <ProjectsExplorer
      initialPage={initialPage}
      // Dropdowns still work (just without options) if the sample request fails
      facets={facets.status === "fulfilled" ? facets.value : NO_FACETS}
      initialError={initialError}
    />
  );
};

export default ProjectsPanel;
