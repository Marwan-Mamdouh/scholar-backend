import { describe, expect, it } from "vitest";
import {
  EMPTY_FILTERS,
  buildFacets,
  filtersKey,
  hasActiveFilters,
  projectYear,
  toFieldList,
  toNameList,
  toProjectSummary,
} from "./project.utils";
import { makeProject } from "./project.test-fixtures";

describe("toFieldList", () => {
  it("reads arrays and comma strings, deduping case-insensitively", () => {
    expect(toFieldList(["Microwave", "antennas", "Antennas"])).toEqual(["Microwave", "antennas"]);
    expect(toFieldList("VLSI, Embedded; IoT")).toEqual(["VLSI", "Embedded", "IoT"]);
  });

  it("ignores non-strings, placeholders and empty values", () => {
    expect(toFieldList([1, null, "N/A", " "])).toEqual([]);
    expect(toFieldList(null)).toEqual([]);
    expect(toFieldList({ a: 1 })).toEqual([]);
  });
});

describe("toNameList", () => {
  it("splits several mentors in one column", () => {
    expect(toNameList("Eng. A, Eng. B")).toEqual(["Eng. A", "Eng. B"]);
    expect(toNameList("Eng. A & Eng. B\nEng. C")).toEqual(["Eng. A", "Eng. B", "Eng. C"]);
    expect(toNameList("Eng. A and Eng. B")).toEqual(["Eng. A", "Eng. B"]);
  });

  it("returns nothing for missing values", () => {
    expect(toNameList(null)).toEqual([]);
    expect(toNameList("Unknown")).toEqual([]);
  });
});

describe("projectYear", () => {
  it("uses the UTC year of postedAt", () => {
    expect(projectYear("2025-01-01T00:00:00.000Z")).toBe("2025");
    expect(projectYear("not a date")).toBeUndefined();
    expect(projectYear(null)).toBeUndefined();
  });
});

describe("toProjectSummary", () => {
  it("maps a full API row to card data", () => {
    expect(toProjectSummary(makeProject())).toEqual({
      id: 1,
      title: "FPGA-Based Digital Design And Verification Of The RISC-V Core",
      year: "2025",
      university: "Cairo University",
      fields: ["Microwave", "Antennas"],
      supervisor: "Dr. Abd El Rahman Abo Taleb",
      mentors: ["Eng. Nour El Deen El Hout", "Eng. Sara Nassef"],
      sponsor: "Siemens EDA",
      link: "https://example.com/fpga-riscv",
    });
  });

  it("omits missing rows instead of inventing them", () => {
    const summary = toProjectSummary(
      makeProject({
        university: null,
        domains: null,
        supervisor: "",
        coSupervisor: null,
        isSponsored: false,
        documentationLink: null,
      }),
    );
    expect(summary).toMatchObject({ university: undefined, fields: [], supervisor: undefined, mentors: [] });
    expect(summary.sponsor).toBeUndefined();
    expect(summary.link).toBeUndefined();
  });

  it("only shows a sponsor for sponsored projects with a named company", () => {
    expect(toProjectSummary(makeProject({ isSponsored: true, sponsorCompany: null })).sponsor).toBeUndefined();
    expect(toProjectSummary(makeProject({ isSponsored: false })).sponsor).toBeUndefined();
  });

  it("drops documentation links that aren't http(s)", () => {
    expect(toProjectSummary(makeProject({ documentationLink: "javascript:alert(1)" })).link).toBeUndefined();
    expect(toProjectSummary(makeProject({ documentationLink: "drive/folder" })).link).toBeUndefined();
  });
});

describe("buildFacets", () => {
  it("collects unique sorted universities and fields, and years newest first", () => {
    const facets = buildFacets([
      makeProject({ university: "Cairo University", domains: ["VLSI"], postedAt: "2023-05-01T00:00:00Z" }),
      makeProject({ university: "Ain Shams University", domains: ["Antennas", "vlsi"], postedAt: "2025-05-01T00:00:00Z" }),
      makeProject({ university: "cairo university", domains: null, postedAt: "2024-05-01T00:00:00Z" }),
      makeProject({ university: null, domains: ["Microwave"], postedAt: "2025-01-01T00:00:00Z" }),
    ]);
    expect(facets).toEqual({
      universities: ["Ain Shams University", "Cairo University"],
      fields: ["Antennas", "Microwave", "VLSI"],
      years: ["2025", "2024", "2023"],
    });
  });
});

describe("filtersKey / hasActiveFilters", () => {
  it("ignores surrounding spaces in the search", () => {
    expect(filtersKey({ ...EMPTY_FILTERS, search: "  fpga " })).toBe(
      filtersKey({ ...EMPTY_FILTERS, search: "fpga" }),
    );
  });

  it("detects any non-empty filter", () => {
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false);
    expect(hasActiveFilters({ ...EMPTY_FILTERS, search: "   " })).toBe(false);
    expect(hasActiveFilters({ ...EMPTY_FILTERS, year: "2025" })).toBe(true);
  });
});
