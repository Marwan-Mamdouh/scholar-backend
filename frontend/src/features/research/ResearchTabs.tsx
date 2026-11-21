import { FC } from "react";
import { TabType } from "./Research.type";

interface ResearchTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: "researchers", label: "Researchers" },
  { id: "papers", label: "Papers" },
  { id: "publications", label: "Publications" },
  { id: "projects", label: "Projects" },
];

const ResearchTabs: FC<ResearchTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav
      aria-label="Research catalogs"
      className="relative z-10 flex w-full items-center gap-2 overflow-x-auto pb-1"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={() => onTabChange(tab.id)}
            className={`shrink-0 cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-200 sm:px-6 sm:text-base ${
              isActive
                ? "bg-accent-700/30 text-accent-200"
                : "text-neutral-200 hover:bg-overlay/5 hover:text-neutral-50"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
};

export default ResearchTabs;
