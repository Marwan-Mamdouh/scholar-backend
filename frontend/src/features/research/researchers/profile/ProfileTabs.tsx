"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ChartColumn, FileText, Users, type LucideIcon } from "lucide-react";

export type ProfileTabId = "papers" | "coauthors" | "analytics";

const TABS: { id: ProfileTabId; label: string; icon: LucideIcon }[] = [
  { id: "papers", label: "Papers", icon: FileText },
  { id: "coauthors", label: "Co-Authors", icon: Users },
  { id: "analytics", label: "Analytics", icon: ChartColumn },
];

interface ProfileTabsProps {
  renderPanel: (tab: ProfileTabId) => ReactNode;
}

const ProfileTabs = ({ renderPanel }: ProfileTabsProps) => {
  const [active, setActive] = useState<ProfileTabId>("papers");
  const tabRefs = useRef<Record<ProfileTabId, HTMLButtonElement | null>>({
    papers: null,
    coauthors: null,
    analytics: null,
  });

  const focusTab = (index: number) => {
    const tab = TABS[(index + TABS.length) % TABS.length];
    setActive(tab.id);
    tabRefs.current[tab.id]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    if (event.key === "ArrowRight") focusTab(index + 1);
    else if (event.key === "ArrowLeft") focusTab(index - 1);
    else if (event.key === "Home") focusTab(0);
    else if (event.key === "End") focusTab(TABS.length - 1);
    else return;
    event.preventDefault();
  };

  return (
    <div className="flex flex-col gap-6">
      <div
        role="tablist"
        aria-label="Researcher details"
        className="flex overflow-x-auto overflow-y-hidden border-b border-neutral-500/60"
      >
        {TABS.map((tab, index) => {
          const selected = tab.id === active;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[tab.id] = node;
              }}
              type="button"
              role="tab"
              id={`profile-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`profile-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`relative flex flex-1 sm:flex-none shrink-0 items-center justify-center gap-2 px-2.5 sm:px-5 md:px-8 py-3 text-xs md:text-sm font-semibold uppercase tracking-wide sm:tracking-wider transition-colors duration-200 cursor-pointer ${
                selected ? "text-primary-300" : "text-neutral-200 hover:text-neutral-50"
              }`}
            >
              <Icon className="hidden sm:block size-4" aria-hidden="true" />
              {tab.label}
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary-300 transition-transform duration-200 ease-out ${
                  selected ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div
        key={active}
        role="tabpanel"
        id={`profile-panel-${active}`}
        aria-labelledby={`profile-tab-${active}`}
        className="transition-[opacity,translate] duration-200 ease-out starting:opacity-0 starting:translate-y-1 motion-reduce:transition-none"
      >
        {renderPanel(active)}
      </div>
    </div>
  );
};

export default ProfileTabs;
