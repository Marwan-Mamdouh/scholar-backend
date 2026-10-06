"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useSwapTransition } from "@/src/hooks/useSwapTransition";
import ResearchContent from "../ResearchContent";
import ResearcherGrid from "./ResearcherGrid";
import ResearcherProfile from "./profile/ResearcherProfile";
import { toResearcherSummary } from "./researcher.utils";
import { PANEL_SHELL } from "./researcher.style";
import type { AcademicResearcher } from "./researcher.type";

export const RESEARCHER_PARAM = "researcher";

const TRANSITION_MS = 250;
const VIEW_BASE =
  "transition-[opacity,translate] duration-250 ease-out motion-reduce:transition-none";
// Grid slides out/in from the left, the profile from the right — Back reverses it
const GRID_MOTION = "starting:opacity-0 starting:-translate-x-6";
const GRID_EXIT = "opacity-0 -translate-x-6";
const PROFILE_MOTION = "starting:opacity-0 starting:translate-x-6";
const PROFILE_EXIT = "opacity-0 translate-x-6";

export function parseResearcherId(value: string | null): number | null {
  if (!value || !/^\d+$/.test(value)) return null;
  const id = Number(value);
  return id > 0 ? id : null;
}

interface ResearchersExplorerProps {
  researchers: AcademicResearcher[];
  /** Set when the list request failed; profiles opened by URL still work */
  error?: string;
}

const ResearchersExplorer = ({ researchers, error }: ResearchersExplorerProps) => {
  const searchParams = useSearchParams();
  const selectedId = parseResearcherId(searchParams.get(RESEARCHER_PARAM));
  const { shown: shownId, leaving } = useSwapTransition(selectedId, TRANSITION_MS);

  const containerRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Bring the swapped-in view's top into sight (a long grid may be scrolled away)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const node = containerRef.current;
    if (node && node.getBoundingClientRect().top < 0) {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [shownId]);

  const navigate = (id: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === null) params.delete(RESEARCHER_PARAM);
    else params.set(RESEARCHER_PARAM, String(id));
    // Shallow history entry: no server round trip, useSearchParams still updates,
    // and the browser Back button returns to the grid
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  const isProfile = shownId !== null;
  const motion = isProfile
    ? `${PROFILE_MOTION} ${leaving ? PROFILE_EXIT : ""}`
    : `${GRID_MOTION} ${leaving ? GRID_EXIT : ""}`;

  return (
    <div ref={containerRef} className="scroll-mt-28">
      <div
        key={shownId ?? "grid"}
        className={`${VIEW_BASE} ${motion}`}
        aria-busy={leaving || undefined}
      >
        {isProfile ? (
          <div className={PANEL_SHELL}>
            <ResearcherProfile
              id={shownId}
              initialResearcher={researchers.find((researcher) => researcher.id === shownId)}
              onBack={() => navigate(null)}
            />
          </div>
        ) : error ? (
          <ResearchContent activeTab="researchers">
            <div className="flex flex-col items-center justify-center gap-2.5 py-20 text-center">
              <h3 className="text-2xl font-semibold text-danger-300">
                Researchers Are Unavailable
              </h3>
              <p className="max-w-md text-neutral-100">{error}</p>
              <p className="text-sm text-neutral-300">
                Reload the page once the service is reachable again.
              </p>
            </div>
          </ResearchContent>
        ) : researchers.length > 0 ? (
          <ResearchContent activeTab="researchers">
            <ResearcherGrid
              researchers={researchers.map(toResearcherSummary)}
              onViewProfile={navigate}
            />
          </ResearchContent>
        ) : (
          <ResearchContent activeTab="researchers" />
        )}
      </div>
    </div>
  );
};

export default ResearchersExplorer;
