import { connection } from "next/server";
import type { Paginated } from "@/src/lib/api-client";
import ProjectsExplorer from "./ProjectsExplorer";
import { fetchProjects } from "./project.api";
import type { GraduationProject } from "./project.type";

const ProjectsPanel = async () => {
  // Fetch on every request, not once at build time
  await connection();

  let initialPage: Paginated<GraduationProject> | null = null;
  let initialError: string | undefined;
  try {
    initialPage = await fetchProjects({ page: 1 });
  } catch (cause) {
    initialError =
      cause instanceof Error
        ? cause.message
        : "The projects service is unavailable.";
  }

  return (
    <ProjectsExplorer initialPage={initialPage} initialError={initialError} />
  );
};

export default ProjectsPanel;
