import { describe, expect, it } from "vitest";
import {
  abbreviateUniversity,
  aggregateFields,
  avatarTone,
  cleanName,
  filterAndSortPapers,
  formatCompact,
  getInitials,
  googleScholarUrl,
  hasValue,
  semanticScholarUrl,
  toResearcherSummary,
  toScholarProfile,
  toTopicList,
} from "./researcher.utils";
import {
  COLLABORATORS,
  RESEARCHERS,
  makeResearcher,
  makeScholarAuthor,
} from "./researcher.test-fixtures";
import type { ResearchPaper } from "./researcher.type";

describe("hasValue", () => {
  it("rejects empty and placeholder values", () => {
    for (const value of [null, undefined, "", "  ", "Unknown", "N/A", "-", "none"]) {
      expect(hasValue(value)).toBe(false);
    }
  });

  it("accepts real values", () => {
    expect(hasValue("Cairo University")).toBe(true);
  });
});

describe("cleanName / getInitials", () => {
  it("strips academic titles and text after a comma", () => {
    expect(cleanName("Prof. Dr. Ahmed Mahmoud, PhD")).toBe("Ahmed Mahmoud");
    expect(cleanName("Associate Professor Sarah El-Ghandour")).toBe("Sarah El-Ghandour");
  });

  it("uses first and last name initials, ignoring titles", () => {
    expect(getInitials("Dr. Sarah El-Ghandour")).toBe("SE");
    expect(getInitials("Prof. Dr. Ahmed Hassan Mahmoud")).toBe("AM");
    expect(getInitials("Madonna")).toBe("M");
    expect(getInitials("")).toBe("?");
  });
});

describe("toTopicList", () => {
  it("splits strings on common separators and dedupes case-insensitively", () => {
    expect(toTopicList("Micro-electronics / MEMs, mems; Sensors")).toEqual([
      "Micro-electronics",
      "MEMs",
      "Sensors",
    ]);
  });

  it("flattens arrays and drops non-strings and placeholders", () => {
    expect(toTopicList([["NLP", "Unknown"], 4, null, "Machine Learning"])).toEqual([
      "NLP",
      "Machine Learning",
    ]);
    expect(toTopicList(null)).toEqual([]);
    expect(toTopicList({ a: 1 })).toEqual([]);
  });
});

describe("abbreviateUniversity", () => {
  it("uses known Egyptian university abbreviations", () => {
    expect(abbreviateUniversity("American University in Cairo")).toBe("AUC");
    expect(abbreviateUniversity("cairo university")).toBe("Cairo Univ");
    expect(abbreviateUniversity("Ain Shams University")).toBe("Ain Shams");
  });

  it("keeps short names and builds acronyms for long ones", () => {
    expect(abbreviateUniversity("MIT")).toBe("MIT");
    expect(
      abbreviateUniversity("Arab Academy for Science, Technology and Maritime Transport"),
    ).toBe("AASTMT");
  });

  it("returns undefined when there is no institution", () => {
    expect(abbreviateUniversity("Unknown")).toBeUndefined();
    expect(abbreviateUniversity(null)).toBeUndefined();
  });
});

describe("toResearcherSummary", () => {
  it("maps a full API row to card data", () => {
    expect(toResearcherSummary(RESEARCHERS[1])).toEqual({
      id: 2,
      name: "Sarah El-Ghandour",
      initials: "SE",
      position: "School of Sciences",
      university: "American University in Cairo",
      universityAbbr: "AUC",
      tags: ["NLP", "Machine Learning", "Arabic Dialects"],
    });
  });

  it("omits placeholder institution and missing optional fields", () => {
    const summary = toResearcherSummary(
      makeResearcher({ mainTopic: null, subtopics: null }),
    );
    expect(summary.university).toBeUndefined();
    expect(summary.universityAbbr).toBeUndefined();
    expect(summary.position).toBeUndefined();
    expect(summary.bio).toBeUndefined();
    expect(summary.stats).toBeUndefined();
    expect(summary.tags).toEqual([]);
  });

  it("doesn't repeat the institution in the position line", () => {
    const summary = toResearcherSummary(
      makeResearcher({
        institutionName: "Cairo University",
        department: "Faculty of Engineering",
        affiliation: "Cairo University",
      }),
    );
    expect(summary.position).toBe("Faculty of Engineering");
  });
});

describe("formatCompact", () => {
  it.each([
    [0, "0"],
    [999, "999"],
    [1000, "1k"],
    [3200, "3.2k"],
    [12_140, "12.1k"],
    [1_250_000, "1.3M"],
  ])("%d → %s", (value, expected) => {
    expect(formatCompact(value)).toBe(expected);
  });
});

describe("avatarTone", () => {
  it("is stable per id and varies across ids", () => {
    expect(avatarTone(5)).toBe(avatarTone(5));
    expect(new Set([1, 2, 3, 4].map(avatarTone)).size).toBe(4);
  });
});

describe("external profile links", () => {
  it("links a Google Scholar user id directly", () => {
    expect(googleScholarUrl(makeResearcher({ scholarId: "AbC_12" }))).toBe(
      "https://scholar.google.com/citations?user=AbC_12",
    );
  });

  it("falls back to a Google Scholar author search for numeric or missing ids", () => {
    const url = googleScholarUrl(makeResearcher({ scholarId: "145053999" }));
    expect(url).toContain("https://scholar.google.com/scholar?q=");
    expect(decodeURIComponent(url)).toContain('author:"Raghied Atta"');
  });

  it("prefers the matched Semantic Scholar author page", () => {
    const profile = toScholarProfile(makeScholarAuthor());
    expect(semanticScholarUrl(makeResearcher(), profile)).toBe(
      "https://www.semanticscholar.org/author/145053999",
    );
    expect(semanticScholarUrl(makeResearcher(), null)).toBe(
      "https://www.semanticscholar.org/search?q=Raghied%20Atta",
    );
  });
});

describe("aggregateFields", () => {
  it("counts each field once per paper, largest first, shares sum to 1", () => {
    const fields = aggregateFields(makeScholarAuthor().papers!);
    expect(fields.map((field) => [field.name, field.count])).toEqual([
      ["Materials Science", 3],
      ["Engineering", 2],
      ["Computer Science", 1],
      ["Medicine", 1],
    ]);
    expect(fields.reduce((sum, field) => sum + field.share, 0)).toBeCloseTo(1);
  });

  it("folds fields past the fifth into Other", () => {
    const papers = ["A", "B", "C", "D", "E", "F", "G"].map((field, index) => ({
      paperId: String(index),
      title: field,
      year: 2020,
      venue: null,
      citationCount: 0,
      fieldsOfStudy: [field],
    }));
    const fields = aggregateFields(papers);
    expect(fields).toHaveLength(6);
    expect(fields.at(-1)).toMatchObject({ name: "Other", count: 2 });
  });

  it("returns nothing when no paper has fields", () => {
    expect(aggregateFields([])).toEqual([]);
  });
});

describe("toScholarProfile", () => {
  it("maps S2 metrics, papers and co-authors (sorted by collaborations)", () => {
    const profile = toScholarProfile(makeScholarAuthor(), COLLABORATORS);
    expect(profile.stats).toEqual({ hIndex: 9, publications: 37, citations: 321 });
    expect(profile.papers).toHaveLength(7);
    expect(profile.papers[6]).toMatchObject({ year: undefined, venue: undefined });
    expect(profile.coAuthors.map((coAuthor) => coAuthor.name)).toEqual([
      "G. Reed",
      "G. Ensell",
      "A. Evans",
    ]);
    expect(profile.coAuthors[0].url).toBe("https://www.semanticscholar.org/author/10");
  });

  it("tolerates authors with no papers or metrics", () => {
    const profile = toScholarProfile(
      makeScholarAuthor({ papers: undefined, hIndex: null, paperCount: null, citationCount: null }),
    );
    expect(profile.stats).toEqual({ hIndex: 0, publications: 0, citations: 0 });
    expect(profile.papers).toEqual([]);
    expect(profile.fields).toEqual([]);
    expect(profile.coAuthors).toEqual([]);
  });
});

describe("filterAndSortPapers", () => {
  const papers: ResearchPaper[] = [
    { id: "a", title: "Solar stills", year: 2020, citations: 1 },
    { id: "b", title: "Glucose sensor", year: 2024, citations: 9 },
    { id: "c", title: "Undated solar work", citations: 3 },
  ];

  it("filters by title, case-insensitively", () => {
    expect(filterAndSortPapers(papers, "  SOLAR ", "newest").map((p) => p.id)).toEqual([
      "a",
      "c",
    ]);
  });

  it("sorts by year (undated last) and by citations", () => {
    expect(filterAndSortPapers(papers, "", "newest").map((p) => p.id)).toEqual(["b", "a", "c"]);
    expect(filterAndSortPapers(papers, "", "oldest").map((p) => p.id)).toEqual(["a", "b", "c"]);
    expect(filterAndSortPapers(papers, "", "cited").map((p) => p.id)).toEqual(["b", "c", "a"]);
  });

  it("does not mutate the input", () => {
    const copy = [...papers];
    filterAndSortPapers(papers, "", "cited");
    expect(papers).toEqual(copy);
  });
});
