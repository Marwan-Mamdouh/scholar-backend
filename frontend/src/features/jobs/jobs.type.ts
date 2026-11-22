import type { Paginated } from "@/src/lib/api-client";

export type JobType = "fullTime" | "partTime" | "internship";
export type Seniority = "junior" | "mid" | "senior" | "lead";

export interface Job {
  id: number;
  title: string;
  industry: string | null;
  domains: unknown;
  type: JobType | null;
  seniority: Seniority | null;
  description: string | null;
  requirements: string | null;
  salary: string | null;
  applyLink: string | null;
  postedAt: string;
  company: {
    id: number;
    name: string;
    website: string | null;
    headquartersCountry: string | null;
  };
  branch: { id: number; city: string | null; country: string | null };
}

export interface JobFilters {
  search: string;
  countries: string[];
  disciplines: string[];
  companyIds: number[];
  type: JobType | "";
  seniority: Seniority | "";
  sort: "newest" | "oldest" | "title";
  page: number;
}

export interface JobFacets {
  countries: string[];
  disciplines: string[];
  companies: { id: number; name: string }[];
}

export type JobsResponse = Paginated<Job>;
