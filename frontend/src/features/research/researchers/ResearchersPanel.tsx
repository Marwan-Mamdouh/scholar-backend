import { connection } from "next/server";
import ResearchersExplorer from "./ResearchersExplorer";
import { fetchResearchers } from "./researcher.api";
import type { AcademicResearcher } from "./researcher.type";

const ResearchersPanel = async () => {
  // Fetch on every request, not once at build time
  await connection();

  let researchers: AcademicResearcher[] = [];
  let error: string | undefined;
  try {
    researchers = (await fetchResearchers({ page: 1 })).data ?? [];
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "The researchers service is unavailable.";
  }

  return <ResearchersExplorer researchers={researchers} error={error} />;
};

export default ResearchersPanel;
