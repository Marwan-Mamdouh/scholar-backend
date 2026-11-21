"use client";

import { ExternalLink } from "lucide-react";
import {
  CatalogDetailsLayout,
  CatalogDetailState,
  DetailSection,
  safeExternalUrl,
} from "@/src/components/catalog/CatalogDetails";
import Badge from "@/src/components/ui/Badge/Badge";
import getButtonClasses from "@/src/components/ui/Button/button.style";
import { useCatalogDetail } from "@/src/hooks/useCatalogDetail";
import { JOB_TYPES, SENIORITY_LEVELS } from "../jobs.constants";
import type { Job } from "../jobs.type";
import { jobDomains, jobLocation, postedDate } from "../jobs.utils";

export default function JobDetails({ id }: { id: string }) {
  const { data: job, loading, notFound, error, reload } =
    useCatalogDetail<Job>(id, "/jobs");
  const applyLink = safeExternalUrl(job?.applyLink);

  return (
    <CatalogDetailsLayout backHref="/jobs" backLabel="Back to jobs">
      <CatalogDetailState
        label="Job"
        loading={loading}
        notFound={notFound}
        error={error}
        onRetry={reload}
      />
      {job && (
        <article className="flex flex-col gap-8">
          <header className="rounded-3xl border border-neutral-700 bg-brand-gradient p-6 md:p-8">
            <p className="mb-3 text-lg text-accent-300">{job.company.name}</p>
            <h1 className="text-h1-sm text-neutral-50 md:text-h1">
              {job.title}
            </h1>
            <p className="mt-3 text-base text-neutral-100">
              {jobLocation(job)} · Posted {postedDate(job.postedAt)}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {job.type && (
                <Badge variant="solid" intent="accent">
                  {JOB_TYPES[job.type]}
                </Badge>
              )}
              {job.seniority && (
                <Badge variant="outlined" intent="accent">
                  {SENIORITY_LEVELS[job.seniority]}
                </Badge>
              )}
              {[...new Set([job.industry, ...jobDomains(job.domains)])]
                .filter((tag): tag is string => !!tag)
                .map((tag) => (
                  <Badge key={tag} variant="outlined" intent="primary">
                    {tag}
                  </Badge>
                ))}
            </div>
            <p className="mt-5 text-base text-neutral-100">
              Salary: {job.salary || "Not disclosed"}
            </p>
            {applyLink ? (
              <a
                href={applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`${getButtonClasses({ intent: "accent", variant: "outlined", size: "lg" })} mt-6 min-h-11 w-fit gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-200`}
              >
                Apply for this job
                <ExternalLink aria-hidden="true" className="size-4" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <p className="mt-6 text-sm text-neutral-200">
                An application link has not been provided for this role.
              </p>
            )}
          </header>
          <DetailSection title="About the role">
            <p className="whitespace-pre-wrap text-base leading-relaxed text-neutral-100">
              {job.description ||
                "No description has been provided for this role."}
            </p>
          </DetailSection>
          <DetailSection title="Requirements">
            <p className="whitespace-pre-wrap text-base leading-relaxed text-neutral-100">
              {job.requirements ||
                "No specific requirements have been provided."}
            </p>
          </DetailSection>
        </article>
      )}
    </CatalogDetailsLayout>
  );
}
