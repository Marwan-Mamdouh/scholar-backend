import {
  Banknote,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  MapPin,
} from "lucide-react";
import Badge from "@/src/components/ui/Badge/Badge";
import CatalogCard from "@/src/components/catalog/CatalogCard";
import { JOB_TYPES, SENIORITY_LEVELS } from "../jobs.constants";
import type { Job } from "../jobs.type";
import { jobDomains, jobLocation, postedDate } from "../jobs.utils";

export default function JobCard({ job }: { job: Job }) {
  const domains = jobDomains(job.domains);
  return (
    <CatalogCard
      title={job.title}
      eyebrow={job.company.name}
      href={`/jobs/${job.id}`}
      icon={<Building2 aria-hidden="true" className="size-8 text-accent-300" />}
      badge={
        job.type ? (
          <Badge
            size="md"
            variant="solid"
            intent="accent"
            className="whitespace-nowrap font-medium"
          >
            {JOB_TYPES[job.type]}
          </Badge>
        ) : undefined
      }
    >
      {(job.industry || domains.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {[
            ...new Set(
              [job.industry, ...domains].filter((tag): tag is string => !!tag),
            ),
          ]
            .slice(0, 2)
            .map((tag) => (
              <Badge
                size="md"
                key={tag}
                variant="outlined"
                intent="accent"
                className="max-w-full break-words"
              >
                {tag}
              </Badge>
            ))}
        </div>
      )}
      <dl className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <dt>
            <MapPin aria-hidden="true" className="size-3.5 text-accent-300" />
            <span className="sr-only">Location</span>
          </dt>
          <dd>{jobLocation(job)}</dd>
        </div>
        <div className="flex items-start gap-2">
          <dt>
            <BriefcaseBusiness
              aria-hidden="true"
              className="size-3.5 text-accent-300"
            />
            <span className="sr-only">Seniority</span>
          </dt>
          <dd>
            {job.seniority
              ? SENIORITY_LEVELS[job.seniority]
              : "Seniority not specified"}
          </dd>
        </div>
        <div className="flex items-start gap-2">
          <dt>
            <Banknote aria-hidden="true" className="size-3.5 text-accent-300" />
            <span className="sr-only">Salary</span>
          </dt>
          <dd>{job.salary || "Salary not disclosed"}</dd>
        </div>
        <div className="flex items-start gap-2">
          <dt>
            <CalendarDays
              aria-hidden="true"
              className="size-3.5 text-accent-300"
            />
            <span className="sr-only">Posted</span>
          </dt>
          <dd>{postedDate(job.postedAt)}</dd>
        </div>
      </dl>
    </CatalogCard>
  );
}
