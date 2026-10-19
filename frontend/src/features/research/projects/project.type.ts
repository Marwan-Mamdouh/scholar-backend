export interface SponsorCompany {
  id: number;
  name: string;
  industry: string | null;
  website: string | null;
}

/** Row returned by GET /api/projects (includes the sponsor company) */
export interface GraduationProject {
  id: number;
  isSponsored: boolean;
  sponsorCompanyId: number | null;
  university: string | null;
  faculty: string | null;
  industry: string | null;
  // Json column: a list of field names, e.g. ["Microwave", "Antennas"]
  domains: unknown;
  supervisor: string | null;
  coSupervisor: string | null;
  projectTitle: string;
  noOfStudents: number | null;
  documentationLink: string | null;
  postedAt: string;
  sponsorCompany?: SponsorCompany | null;
}

export type Sponsorship = "" | "sponsored" | "unsponsored";

/** Filter values as the toolbar holds them; "" means "any" */
export interface ProjectFilters {
  search: string;
  university: string;
  projectField: string;
  year: string;
  sponsorship: Sponsorship;
}

/** Query params supported by GET /api/projects */
export interface ProjectQuery extends Partial<ProjectFilters> {
  page?: number;
  limit?: number;
}

/** Dropdown options derived from the projects themselves */
export interface ProjectFacets {
  universities: string[];
  fields: string[];
  years: string[];
}

/** Everything a project card shows; optional rows are omitted when absent */
export interface ProjectSummary {
  id: number;
  title: string;
  year?: string;
  university?: string;
  fields: string[];
  supervisor?: string;
  mentors: string[];
  sponsor?: string;
  link?: string;
}
