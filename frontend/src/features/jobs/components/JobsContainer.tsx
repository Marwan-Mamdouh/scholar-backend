import JobsExplorer from "./JobsExplorer";
import CatalogPage from "@/src/components/catalog/CatalogPage";

export default function JobsContainer() {
  return (
    <CatalogPage
      title="Jobs & Opportunities"
      description="Find your next step in research, engineering, and industry. Explore roles that turn your knowledge into impact."
    >
      <JobsExplorer />
    </CatalogPage>
  );
}
