import CatalogLayout from "@/src/components/catalog/CatalogLayout";
import { CatalogCardsSkeleton } from "@/src/components/catalog/CatalogCard";

export default function ResearchListSkeleton({
  tab,
}: {
  tab: "researchers" | "publications" | "projects";
}) {
  const filterCount = { researchers: 3, publications: 5, projects: 4 }[tab];
  const placeholder = "h-11 rounded-xl bg-overlay/5 motion-safe:animate-pulse";
  return (
    <CatalogLayout
      search={<div className={placeholder} aria-hidden="true" />}
      filters={
        filterCount > 0 && (
          <div aria-hidden="true" className="grid gap-1">
            {Array.from({ length: filterCount }, (_, i) => (
              <div key={i} className={placeholder} />
            ))}
          </div>
        )
      }
      resultsLabel={`Loading ${tab}`}
    >
      <CatalogCardsSkeleton />
    </CatalogLayout>
  );
}
