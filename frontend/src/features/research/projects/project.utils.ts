import type {
  GraduationProject,
  ProjectFacets,
  ProjectFilters,
  ProjectSummary,
} from "./project.type";

const PLACEHOLDER_VALUES = new Set(["", "unknown", "n/a", "na", "none", "null", "-", "—"]);

export function hasValue(value: string | null | undefined): value is string {
  return typeof value === "string" && !PLACEHOLDER_VALUES.has(value.trim().toLowerCase());
}

export const EMPTY_FILTERS: ProjectFilters = {
  search: "",
  university: "",
  projectField: "",
  year: "",
  sponsorship: "",
};

/** Field names from the `domains` Json column (array, or a "A, B" string). */
export function toFieldList(domains: unknown): string[] {
  const raw: unknown[] = Array.isArray(domains) ? domains.flat() : [domains];
  const seen = new Set<string>();
  const fields: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    for (const part of item.split(/[,;|]/)) {
      const field = part.trim();
      const key = field.toLowerCase();
      if (!hasValue(field) || seen.has(key)) continue;
      seen.add(key);
      fields.push(field);
    }
  }
  return fields;
}

/** Co-supervisor names; several may share the column ("A, B" / "A & B" / one per line). */
export function toNameList(value: string | null | undefined): string[] {
  if (!hasValue(value)) return [];
  return value
    .split(/[,;\n]|\s&\s|\sand\s/i)
    .map((name) => name.trim())
    .filter(hasValue);
}

export function projectYear(postedAt: string | null | undefined): string | undefined {
  if (!postedAt) return undefined;
  const year = new Date(postedAt).getUTCFullYear();
  return Number.isFinite(year) ? String(year) : undefined;
}

function safeLink(value: string | null | undefined): string | undefined {
  if (!hasValue(value)) return undefined;
  return /^https?:\/\//i.test(value.trim()) ? value.trim() : undefined;
}

export function toProjectSummary(project: GraduationProject): ProjectSummary {
  const sponsor =
    project.isSponsored && hasValue(project.sponsorCompany?.name)
      ? project.sponsorCompany.name.trim()
      : undefined;

  return {
    id: project.id,
    title: project.projectTitle?.trim() || "Untitled project",
    year: projectYear(project.postedAt),
    university: hasValue(project.university) ? project.university.trim() : undefined,
    fields: toFieldList(project.domains),
    supervisor: hasValue(project.supervisor) ? project.supervisor.trim() : undefined,
    mentors: toNameList(project.coSupervisor),
    sponsor,
    link: safeLink(project.documentationLink),
  };
}

function sortedUnique(values: (string | undefined)[], compare?: (a: string, b: string) => number) {
  const byKey = new Map<string, string>();
  for (const value of values) {
    if (!value) continue;
    const key = value.toLowerCase();
    if (!byKey.has(key)) byKey.set(key, value);
  }
  return [...byKey.values()].sort(compare ?? ((a, b) => a.localeCompare(b)));
}

/** Dropdown options from a sample of projects (the API has no facets endpoint). */
export function buildFacets(projects: GraduationProject[]): ProjectFacets {
  return {
    universities: sortedUnique(
      projects.map((project) => (hasValue(project.university) ? project.university.trim() : undefined)),
    ),
    fields: sortedUnique(projects.flatMap((project) => toFieldList(project.domains))),
    years: sortedUnique(
      projects.map((project) => projectYear(project.postedAt)),
      (a, b) => Number(b) - Number(a),
    ),
  };
}

/** Stable key for a filter combination; search is trimmed so trailing spaces don't refetch. */
export function filtersKey(filters: ProjectFilters): string {
  return JSON.stringify({ ...filters, search: filters.search.trim() });
}

export function hasActiveFilters(filters: ProjectFilters): boolean {
  return filtersKey(filters) !== filtersKey(EMPTY_FILTERS);
}
