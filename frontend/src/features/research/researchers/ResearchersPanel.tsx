import { connection } from "next/server";
import ResearchersExplorer from "./ResearchersExplorer";
import { fetchResearchers } from "./researcher.api";
import type { AcademicResearcher } from "./researcher.type";

const ResearchersPanel = async () => {
  // Fetch on every request, not once at build time
  await connection();

  let researchers: AcademicResearcher[] = [];
  let total = 0;
  let totalPages = 0;
  let error: string | undefined;
  try {
    const result = await fetchResearchers({ page: 1 });
    researchers = result.data ?? [];
    ({ total, totalPages } = result.pagination);
  } catch (cause) {
    error =
      cause instanceof Error
        ? cause.message
        : "The researchers service is unavailable.";
  }

  return (
    <ResearchersExplorer
      researchers={researchers}
      total={total}
      totalPages={totalPages}
      error={error}
    />
  );
};

export default ResearchersPanel;
