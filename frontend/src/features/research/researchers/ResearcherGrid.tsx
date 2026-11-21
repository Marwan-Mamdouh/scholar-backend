import { CATALOG_GRID } from "@/src/components/catalog/CatalogCard";
import ResearcherCard from "./ResearcherCard";
import type { ResearcherSummary } from "./researcher.type";

interface ResearcherGridProps {
  researchers: ResearcherSummary[];
  onViewProfile: (id: number) => void;
}

const ResearcherGrid = ({
  researchers,
  onViewProfile,
}: ResearcherGridProps) => (
  <div className={CATALOG_GRID}>
    {researchers.map((researcher) => (
      <ResearcherCard
        key={researcher.id}
        researcher={researcher}
        onViewProfile={onViewProfile}
      />
    ))}
  </div>
);

export default ResearcherGrid;
