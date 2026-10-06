/** Row returned by GET /api/researchers and GET /api/researchers/:id */
export interface AcademicResearcher {
  id: number;
  firstName: string;
  lastName: string;
  institutionName: string | null;
  department: string | null;
  affiliation: string | null;
  mainTopic: string | null;
  // Json column: the Excel importer stores a "A / B" string, but arrays show up too
  subtopics: unknown;
  // Numeric → Semantic Scholar author id, otherwise a Google Scholar user id
  scholarId: string | null;
  linkedinUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Query params supported by GET /api/researchers */
export interface ResearcherQuery {
  page?: number;
  limit?: number;
}

/* ---- Semantic Scholar payloads proxied by GET /api/search and POST /api/analyze ---- */

export interface ScholarPaperAuthor {
  authorId: string | null;
  name: string;
}

export interface ScholarPaper {
  paperId: string;
  title: string;
  year: number | null;
  venue: string | null;
  citationCount: number | null;
  url?: string | null;
  fieldsOfStudy: string[] | null;
  authors?: ScholarPaperAuthor[];
}

export interface ScholarAuthor {
  authorId: string;
  name: string;
  url?: string;
  hIndex: number | null;
  paperCount: number | null;
  citationCount: number | null;
  primaryField?: string | null;
  papers?: ScholarPaper[];
}

export interface ScholarCollaborator {
  id: string | null;
  name: string;
  count: number;
}

export interface ScholarSearchResponse {
  success: boolean;
  total: number;
  authors: ScholarAuthor[];
}

export interface ScholarAnalysisResponse {
  author: ScholarAuthor;
  collaborators: ScholarCollaborator[];
}

/* ---- View models ---- */

export interface ResearcherStats {
  publications: number;
  citations: number;
  hIndex: number;
}

/** Everything a researcher card can show; optional rows are omitted when absent. */
export interface ResearcherSummary {
  id: number;
  name: string;
  initials: string;
  position?: string;
  university?: string;
  universityAbbr?: string;
  bio?: string;
  stats?: ResearcherStats;
  tags: string[];
  bookmarked?: boolean;
}

export interface ResearchPaper {
  id: string;
  title: string;
  year?: number;
  venue?: string;
  citations: number;
  url?: string;
}

export interface CoAuthor {
  id: string;
  name: string;
  count: number;
  url?: string;
}

export interface FieldShare {
  name: string;
  count: number;
  /** 0..1 */
  share: number;
}

export interface ScholarProfile {
  authorId: string;
  url: string;
  primaryField?: string;
  stats: ResearcherStats;
  papers: ResearchPaper[];
  coAuthors: CoAuthor[];
  fields: FieldShare[];
}

export type PaperSort = "newest" | "oldest" | "cited";
