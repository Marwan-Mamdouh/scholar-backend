import { PANEL_SHELL } from "./researcher.style";

const ResearchersPanelSkeleton = () => (
  <div className={`${PANEL_SHELL} gap-12`} aria-busy="true" aria-label="Loading researchers">
    <div className="h-11 w-full lg:w-75 rounded-2xl bg-white/10 animate-pulse" />
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="h-64 rounded-2xl border border-neutral-500 bg-white/5 animate-pulse"
        />
      ))}
    </div>
  </div>
);

export default ResearchersPanelSkeleton;
