import type { JobFilters, JobType, Seniority } from "./jobs.type";

export const JOB_TYPES: Record<JobType, string> = {
  fullTime: "Full time",
  partTime: "Part time",
  internship: "Internship",
};

export const SENIORITY_LEVELS: Record<Seniority, string> = {
  junior: "Junior",
  mid: "Mid level",
  senior: "Senior",
  lead: "Lead",
};

export const EMPTY_FILTERS: JobFilters = {
  search: "",
  country: "",
  discipline: "",
  company: "",
  type: "",
  seniority: "",
  sort: "newest",
  page: 1,
};

export const PAGE_SIZE = 12;
