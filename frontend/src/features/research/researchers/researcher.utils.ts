import type {
  AcademicResearcher,
  CoAuthor,
  FieldShare,
  PaperSort,
  ResearchPaper,
  ResearcherSummary,
  ScholarAuthor,
  ScholarCollaborator,
  ScholarPaper,
  ScholarProfile,
} from "./researcher.type";

const PLACEHOLDER_VALUES = new Set(["", "unknown", "n/a", "na", "none", "null", "-", "—"]);

/** True for real values; false for empty strings and placeholder text like "Unknown". */
export function hasValue(value: string | null | undefined): value is string {
  return typeof value === "string" && !PLACEHOLDER_VALUES.has(value.trim().toLowerCase());
}

export function fullName(researcher: Pick<AcademicResearcher, "firstName" | "lastName">): string {
  return [researcher.firstName, researcher.lastName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");
}

const TITLE_PREFIX =
  /^(Professor\.|Professor|Prof\.|Prof|Dr\.|Dr|Eng\.|PhD Candidate at|PhD Candidate|Associate Professor|Assistant Professor|Ph\.D\.|MSc)\s+/i;

/** Mirrors the backend's cleanName: drops academic titles and anything after a comma. */
export function cleanName(name: string): string {
  let cleaned = name.trim();
  while (TITLE_PREFIX.test(cleaned)) cleaned = cleaned.replace(TITLE_PREFIX, "");
  return cleaned.replace(/,.*/, "").trim();
}

export function getInitials(name: string): string {
  const words = cleanName(name).split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

/** Splits a free-form topics value ("A / B, C" or ["A", "B"]) into unique trimmed labels. */
export function toTopicList(value: unknown): string[] {
  const raw: unknown[] = Array.isArray(value) ? value.flat() : [value];
  const seen = new Set<string>();
  const topics: string[] = [];

  for (const item of raw) {
    if (typeof item !== "string") continue;
    for (const part of item.split(/[\/,;|]/)) {
      const topic = part.trim();
      const key = topic.toLowerCase();
      if (!hasValue(topic) || seen.has(key)) continue;
      seen.add(key);
      topics.push(topic);
    }
  }
  return topics;
}

const KNOWN_ABBREVIATIONS: Record<string, string> = {
  "cairo university": "Cairo Univ",
  "american university in cairo": "AUC",
  "the american university in cairo": "AUC",
  "alexandria university": "Alex Univ",
  "ain shams university": "Ain Shams",
  "mansoura university": "Mansoura U",
  "zewail city of science and technology": "Zewail City",
  "zewail city of science, technology and innovation": "Zewail City",
  "zewail city of science": "Zewail City",
  "german university in cairo": "GUC",
  "british university in egypt": "BUE",
  "nile university": "Nile Univ",
  "helwan university": "Helwan Univ",
  "assiut university": "Assiut Univ",
  "egypt-japan university of science and technology": "E-JUST",
};

const MINOR_WORDS = new Set(["of", "in", "the", "for", "and", "at", "de"]);

/** Short badge label for an institution, or undefined when none can be derived. */
export function abbreviateUniversity(name: string | null | undefined): string | undefined {
  if (!hasValue(name)) return undefined;
  const trimmed = name.trim();
  const known = KNOWN_ABBREVIATIONS[trimmed.toLowerCase()];
  if (known) return known;
  if (trimmed.length <= 14) return trimmed;

  const acronym = trimmed
    .split(/[\s,\-]+/)
    .filter((word) => word.length > 1 && !MINOR_WORDS.has(word.toLowerCase()))
    .map((word) => word[0].toUpperCase())
    .join("");
  return acronym.length >= 2 ? acronym : undefined;
}

export function toResearcherSummary(researcher: AcademicResearcher): ResearcherSummary {
  const name = fullName(researcher);
  const university = hasValue(researcher.institutionName)
    ? researcher.institutionName.trim()
    : undefined;

  const positionParts = [researcher.department, researcher.affiliation]
    .filter(hasValue)
    .map((part) => part.trim())
    .filter((part, index, parts) => part !== university && parts.indexOf(part) === index);

  const tags = toTopicList([researcher.mainTopic, researcher.subtopics]);

  return {
    id: researcher.id,
    name,
    initials: getInitials(name),
    position: positionParts.length ? positionParts.join(", ") : undefined,
    university,
    universityAbbr: abbreviateUniversity(university),
    tags,
  };
}

/** 3200 → "3.2k", 12100 → "12.1k", 1250000 → "1.3M". */
export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${trimZero((value / 1_000_000).toFixed(1))}M`;
  if (abs >= 1_000) return `${trimZero((value / 1_000).toFixed(1))}k`;
  return String(value);
}

function trimZero(value: string): string {
  return value.endsWith(".0") ? value.slice(0, -2) : value;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

const AVATAR_TONES = ["bg-accent-600", "bg-primary-500", "bg-accent-700", "bg-primary-600"];

/** Stable avatar background per researcher so the grid isn't one flat colour. */
export function avatarTone(id: number): string {
  return AVATAR_TONES[Math.abs(id) % AVATAR_TONES.length];
}

/* ---- Profile helpers ---- */

export function googleScholarUrl(researcher: AcademicResearcher): string {
  const storedId = researcher.scholarId?.trim() ?? "";
  if (hasValue(storedId) && !/^\d+$/.test(storedId)) {
    return `https://scholar.google.com/citations?user=${encodeURIComponent(storedId)}`;
  }
  const query = `author:"${cleanName(fullName(researcher))}"`;
  return `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
}

export function semanticScholarUrl(
  researcher: AcademicResearcher,
  scholar: ScholarProfile | null | undefined,
): string {
  if (scholar?.url) return scholar.url;
  const query = cleanName(fullName(researcher));
  return `https://www.semanticscholar.org/search?q=${encodeURIComponent(query)}`;
}

const MAX_FIELD_SLICES = 5;

/** Paper counts per field of study, largest first; the tail folds into "Other". */
export function aggregateFields(papers: ScholarPaper[]): FieldShare[] {
  const counts = new Map<string, number>();
  for (const paper of papers) {
    for (const field of new Set(paper.fieldsOfStudy ?? [])) {
      if (!hasValue(field)) continue;
      counts.set(field, (counts.get(field) ?? 0) + 1);
    }
  }

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const head = sorted.slice(0, MAX_FIELD_SLICES);
  const tailCount = sorted.slice(MAX_FIELD_SLICES).reduce((sum, [, count]) => sum + count, 0);
  if (tailCount > 0) head.push(["Other", tailCount]);

  const total = head.reduce((sum, [, count]) => sum + count, 0);
  return head.map(([name, count]) => ({ name, count, share: total ? count / total : 0 }));
}

function toPaper(paper: ScholarPaper): ResearchPaper {
  return {
    id: paper.paperId,
    title: paper.title?.trim() || "Untitled paper",
    year: paper.year ?? undefined,
    venue: hasValue(paper.venue) ? paper.venue.trim() : undefined,
    citations: paper.citationCount ?? 0,
    url: paper.url ?? undefined,
  };
}

function toCoAuthor(collaborator: ScholarCollaborator, index: number): CoAuthor {
  return {
    id: collaborator.id ?? `${collaborator.name}-${index}`,
    name: collaborator.name,
    count: collaborator.count,
    url: collaborator.id
      ? `https://www.semanticscholar.org/author/${collaborator.id}`
      : undefined,
  };
}

export function toScholarProfile(
  author: ScholarAuthor,
  collaborators: ScholarCollaborator[] = [],
): ScholarProfile {
  const papers = author.papers ?? [];
  return {
    authorId: author.authorId,
    url: author.url ?? `https://www.semanticscholar.org/author/${author.authorId}`,
    primaryField: hasValue(author.primaryField) ? author.primaryField : undefined,
    stats: {
      hIndex: author.hIndex ?? 0,
      publications: author.paperCount ?? papers.length,
      citations: author.citationCount ?? 0,
    },
    papers: papers.map(toPaper),
    coAuthors: collaborators
      .filter((collaborator) => hasValue(collaborator.name))
      .map(toCoAuthor)
      .sort((a, b) => b.count - a.count),
    fields: aggregateFields(papers),
  };
}

export function filterAndSortPapers(
  papers: ResearchPaper[],
  query: string,
  sort: PaperSort,
): ResearchPaper[] {
  const needle = query.trim().toLowerCase();
  const filtered = needle
    ? papers.filter((paper) => paper.title.toLowerCase().includes(needle))
    : [...papers];

  // Papers without a year sink to the bottom for both year orders
  const year = (paper: ResearchPaper, fallback: number) => paper.year ?? fallback;
  const comparators: Record<PaperSort, (a: ResearchPaper, b: ResearchPaper) => number> = {
    newest: (a, b) => year(b, -Infinity) - year(a, -Infinity),
    oldest: (a, b) => year(a, Infinity) - year(b, Infinity),
    cited: (a, b) => b.citations - a.citations,
  };
  return filtered.sort(comparators[sort]);
}
