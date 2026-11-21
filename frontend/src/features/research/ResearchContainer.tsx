import ResearchListSkeleton from "./ResearchListSkeleton";
import { Suspense } from "react";
import ResearchTabsClient from "./ResearchTabsClient";
import ResearchInfoCard, { ResearchInfoCardProps } from "./ResearchInfoCard";
import PapersExplorer from "./papers/PapersExplorer";
import { PublicationsPanel } from "./publications";
import { ResearchersPanel } from "./researchers";
import { ProjectsPanel } from "./projects";
import { TabType } from "./Research.type";

const RESEARCH_DATA: Record<TabType, ResearchInfoCardProps> = {
  researchers: {
    title: "Explore Researchers",
    description:
      "Browse academic profiles, research areas, and publications to find experts in your field",
    stats: [
      { label: "Researchers", value: 879 },
      { label: "Universities", value: 481 },
      { label: "Topics", value: 17 },
    ],
  },
  papers: {
    title: "Discover Academic Papers",
    description:
      "Explore academic papers and citation networks across top journals and research platforms.",
  },
  publications: {
    title: "Compare Publications",
    description:
      "Search journals and transactions by title, acronym or ISSN to compare publication metrics and fees.",
  },
  projects: {
    title: "Explore Graduation Projects",
    description:
      "Discover real student projects, explore ideas, and get inspired for your own work",
  },
};

const ResearchContainer = ({ activeTab }: { activeTab: TabType }) => {
  const currentInfo = RESEARCH_DATA[activeTab];

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      {/* Info Card */}
      <ResearchInfoCard
        title={currentInfo.title}
        description={currentInfo.description}
        stats={currentInfo.stats}
      />

      {/* Tabs */}
      <ResearchTabsClient activeTab={activeTab} />

      {/* Content */}
      {activeTab === "publications" ? (
        <Suspense fallback={<ResearchListSkeleton tab="publications" />}>
          <PublicationsPanel />
        </Suspense>
      ) : activeTab === "researchers" ? (
        <Suspense fallback={<ResearchListSkeleton tab="researchers" />}>
          <ResearchersPanel />
        </Suspense>
      ) : activeTab === "projects" ? (
        <Suspense fallback={<ResearchListSkeleton tab="projects" />}>
          <ProjectsPanel />
        </Suspense>
      ) : (
        <PapersExplorer />
      )}
    </div>
  );
};

export default ResearchContainer;
