"use client";

import { ExternalLink } from "lucide-react";
import {
  CatalogDetailsLayout,
  CatalogDetailState,
  DetailFields,
  DetailSection,
  safeExternalUrl,
} from "@/src/components/catalog/CatalogDetails";
import Badge from "@/src/components/ui/Badge/Badge";
import getButtonClasses from "@/src/components/ui/Button/button.style";
import { useCatalogDetail } from "@/src/hooks/useCatalogDetail";
import { hasValue, toProjectSummary } from "./project.utils";
import type { GraduationProject } from "./project.type";

const postedDateFormat = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeZone: "UTC",
});

function ProjectDetailContent({ project }: { project: GraduationProject }) {
  const { title, university, fields, supervisor, mentors, sponsor } =
    toProjectSummary(project);
  const documentation = safeExternalUrl(project.documentationLink);
  const postedAt = new Date(project.postedAt);
  const teamSize = project.noOfStudents;
  const overview = [
    { label: "University", value: university },
    {
      label: "Faculty",
      value: hasValue(project.faculty) ? project.faculty.trim() : undefined,
    },
    {
      label: "Industry",
      value: hasValue(project.industry) ? project.industry.trim() : undefined,
    },
    {
      label: "Team size",
      value:
        teamSize !== null && teamSize > 0
          ? `${teamSize} ${teamSize === 1 ? "student" : "students"}`
          : undefined,
    },
    {
      label: "Posted",
      value: Number.isFinite(postedAt.getTime())
        ? postedDateFormat.format(postedAt)
        : undefined,
    },
    {
      label: "Sponsorship",
      value: sponsor ?? (project.isSponsored ? "Sponsored" : "Independent"),
    },
  ].filter(({ value }) => value !== undefined);

  return (
    <article className="flex flex-col gap-6">
      <header className="rounded-3xl border border-neutral-700 bg-brand-gradient p-6 md:p-8">
        <h1 className="text-h2-sm text-neutral-50 md:text-h2">{title}</h1>
        {documentation && (
          <a
            href={documentation}
            target="_blank"
            rel="noopener noreferrer"
            className={`${getButtonClasses({ intent: "accent", variant: "outlined", size: "md" })} mt-5 min-h-11 w-fit gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-200`}
          >
            View documentation
            <ExternalLink aria-hidden="true" className="size-4 shrink-0" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </header>
      <DetailSection title="Project information">
        <DetailFields fields={overview} />
      </DetailSection>
      {fields.length > 0 && (
        <DetailSection title="Project fields">
          <ul aria-label="Project fields" className="flex flex-wrap gap-2">
            {fields.map((field) => (
              <li key={field} className="min-w-0">
                <Badge
                  variant="outlined"
                  intent="accent"
                  size="md"
                  className="max-w-full break-words"
                >
                  {field}
                </Badge>
              </li>
            ))}
          </ul>
        </DetailSection>
      )}
      {(supervisor || mentors.length > 0) && (
        <DetailSection title="Supervision">
          <DetailFields
            fields={[
              ...(supervisor
                ? [{ label: "Supervisor", value: supervisor }]
                : []),
              ...(mentors.length
                ? [
                    {
                      label: "Mentors",
                      value: (
                        <ul>
                          {mentors.map((mentor) => (
                            <li key={mentor}>{mentor}</li>
                          ))}
                        </ul>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </DetailSection>
      )}
    </article>
  );
}

export default function ProjectDetails({ id }: { id: string }) {
  const {
    data: project,
    loading,
    notFound,
    error,
    reload,
  } = useCatalogDetail<GraduationProject>(id, "/projects/catalog");

  return (
    <CatalogDetailsLayout
      backHref="/research?tab=projects"
      backLabel="Back to projects"
    >
      <CatalogDetailState
        label="Project"
        loading={loading}
        notFound={notFound}
        error={error}
        onRetry={reload}
      />
      {project && <ProjectDetailContent project={project} />}
    </CatalogDetailsLayout>
  );
}
