import { Handshake, UserRound, UsersRound } from "lucide-react";
import getButtonClasses from "@/src/components/ui/Button/button.style";
import type { ProjectSummary } from "./project.type";

const MAX_FIELDS = 3;

const SECTION_LABEL = "flex items-center gap-1.5 text-sm font-semibold text-neutral-50";
const SECTION_ICON = "size-4 shrink-0 text-primary-300";

const ProjectCard = ({ project }: { project: ProjectSummary }) => {
  const { title, year, university, fields, supervisor, mentors, sponsor, link } = project;

  return (
    <article
      aria-label={title}
      className="flex flex-col gap-3 rounded-2xl border border-primary-300/40 bg-white/5 p-4 transition-[border-color,box-shadow,translate] duration-200 ease-out hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-[0_0_15px_#37b5aa33]"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 title={title} className="line-clamp-3 font-bold leading-snug text-primary-100">
            {title}
          </h3>
          {year && (
            <span className="shrink-0 rounded-full bg-accent-300 px-2 py-0.5 text-xs font-bold text-neutral-900">
              {year}
            </span>
          )}
        </div>
        {university && <p className="text-xs text-neutral-200">{university}</p>}
      </div>

      {fields.length > 0 && (
        <ul aria-label="Project fields" className="flex flex-wrap gap-1.5">
          {fields.slice(0, MAX_FIELDS).map((field) => (
            <li
              key={field}
              className="rounded-full border border-accent-300 px-2 py-0.5 text-[11px] text-accent-200"
            >
              {field}
            </li>
          ))}
        </ul>
      )}

      {supervisor && (
        <div className="flex flex-col gap-1">
          <p className={SECTION_LABEL}>
            <UserRound className={SECTION_ICON} aria-hidden="true" />
            Supervisor
          </p>
          <p className="text-xs text-neutral-200">{supervisor}</p>
        </div>
      )}

      {mentors.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className={SECTION_LABEL}>
            <UsersRound className={SECTION_ICON} aria-hidden="true" />
            Mentors
          </p>
          <ul aria-label="Mentors" className="flex flex-col gap-0.5 text-xs text-neutral-200">
            {mentors.map((mentor) => (
              <li key={mentor}>{mentor}</li>
            ))}
          </ul>
        </div>
      )}

      {sponsor && (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-neutral-50">
          <Handshake className={SECTION_ICON} aria-hidden="true" />
          Sponsored By {sponsor}
        </p>
      )}

      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View project: ${title} (opens in a new tab)`}
          className={`${getButtonClasses({ variant: "outlined", intent: "accent", size: "md" })} mt-auto w-full`}
        >
          View Project
        </a>
      )}
    </article>
  );
};

export default ProjectCard;
