import { PROJECTS_PANEL_SHELL } from "./project.style";

const ProjectsPanelSkeleton = () => (
  <div className={`${PROJECTS_PANEL_SHELL} gap-8`} aria-busy="true" aria-label="Loading projects">
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="h-10 w-full lg:w-75 rounded-2xl bg-white/10 animate-pulse" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-9 w-28 rounded-full bg-white/10 animate-pulse" />
        ))}
      </div>
    </div>
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, index) => (
        <div
          key={index}
          className="h-72 rounded-2xl border border-primary-300/40 bg-white/5 animate-pulse"
        />
      ))}
    </div>
  </div>
);

export default ProjectsPanelSkeleton;
