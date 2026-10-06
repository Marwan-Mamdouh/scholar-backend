import ResearcherCard from "./ResearcherCard";
import type { ResearcherSummary } from "./researcher.type";

interface ResearcherGridProps {
  researchers: ResearcherSummary[];
  onViewProfile: (id: number) => void;
}

const ResearcherGrid = ({ researchers, onViewProfile }: ResearcherGridProps) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
