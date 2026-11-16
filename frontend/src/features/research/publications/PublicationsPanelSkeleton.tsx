import { PANEL_SHELL } from "./PublicationsPanel";

const PublicationsPanelSkeleton = () => (
  <div className={PANEL_SHELL}>
    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
      <div className="h-13 w-full lg:w-75 shrink-0 rounded-2xl bg-white/5 animate-pulse" />
      <div className="flex flex-wrap gap-2">
        {["Category", "Access", "License", "Quartile", "Metrics", "Speed", "Price"].map(
          (label) => (
            <div
              key={label}
              className="h-9 rounded-full bg-white/5 animate-pulse"
              style={{ width: `${label.length * 9 + 44}px` }}
            />
          ),
        )}
      </div>
    </div>

    <div className="w-full overflow-hidden rounded-2xl border border-neutral-500">
      <div className="h-11 bg-white/5" />
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-16 border-t border-neutral-500/60 bg-white/[0.02] animate-pulse"
        />
      ))}
    </div>
  </div>
);

export default PublicationsPanelSkeleton;
