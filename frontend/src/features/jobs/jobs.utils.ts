import type { Job } from "./jobs.type";

export function jobLocation(job: Job): string {
  return (
    [job.branch?.city, job.branch?.country].filter(Boolean).join(", ") ||
    job.company?.headquartersCountry ||
    "Location not specified"
  );
}

export function jobDomains(value: unknown): string[] {
  const domains = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? [value]
      : [];
  return [
    ...new Set(
      domains.filter(
        (domain): domain is string =>
          typeof domain === "string" && !!domain.trim(),
      ),
    ),
  ];
}

export function postedDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date not specified"
    : new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(date);
}
