import ResearchContainer from "@/src/features/research/ResearchContainer";
import { TabType } from "@/src/features/research/Research.type";
import CatalogPage from "@/src/components/catalog/CatalogPage";

export default async function ResearchPage(
  props: Readonly<{
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  }>,
) {
  const searchParams = await props.searchParams;
  const tab = searchParams?.tab;
  const activeTab: TabType =
    tab === "papers" || tab === "publications" || tab === "projects"
      ? tab
      : "researchers";

  return (
    <CatalogPage
      title="Research & Discovery Hub"
      description="Explore researchers, academic papers, and real-world projects from institutions worldwide."
    >
      <ResearchContainer activeTab={activeTab} />
    </CatalogPage>
  );
}
