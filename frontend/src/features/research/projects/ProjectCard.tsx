import { GraduationCap, Handshake, UserRound, UsersRound } from "lucide-react";
import CatalogCard from "@/src/components/catalog/CatalogCard";
import Badge from "@/src/components/ui/Badge/Badge";
import type { ProjectSummary } from "./project.type";

const MAX_FIELDS = 3;

const SECTION_LABEL =
  "flex items-center gap-1.5 text-sm font-semibold text-neutral-50";
const SECTION_ICON = "size-4 shrink-0 text-accent-300";

const ProjectCard = ({ project }: { project: ProjectSummary }) => {
  const {
    id,
    title,
    year,
    university,
    fields,
    supervisor,
    mentors,
    sponsor,
  } = project;

  return (
    <CatalogCard
      title={title}
      eyebrow={university}
      icon={
        <GraduationCap aria-hidden="true" className="size-8 text-accent-300" />
      }
      badge={
        year && (
          <Badge size="md" variant="solid" intent="accent">
            {year}
          </Badge>
        )
      }
      href={`/research/projects/${id}`}
    >
      {fields.length > 0 && (
        <ul aria-label="Project fields" className="flex flex-wrap gap-2">
          {fields.slice(0, MAX_FIELDS).map((field) => (
            <li key={field} className="min-w-0">
              <Badge
                size="md"
                variant="outlined"
                intent="accent"
                className="max-w-full break-words"
              >
                {field}
              </Badge>
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
          <p className="text-sm text-neutral-200">{supervisor}</p>
        </div>
      )}

      {mentors.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className={SECTION_LABEL}>
            <UsersRound className={SECTION_ICON} aria-hidden="true" />
            Mentors
          </p>
          <ul
            aria-label="Mentors"
            className="flex flex-col gap-0.5 text-sm text-neutral-200"
          >
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
    </CatalogCard>
  );
};

export default ProjectCard;
