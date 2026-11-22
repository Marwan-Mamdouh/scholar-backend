import { describe, expect, it } from "vitest";
import {
  EMPTY_FILTERS,
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
  });

  it("only shows a sponsor for sponsored projects with a named company", () => {
    expect(toProjectSummary(makeProject({ isSponsored: true, sponsorCompany: null })).sponsor).toBeUndefined();
    expect(toProjectSummary(makeProject({ isSponsored: false })).sponsor).toBeUndefined();
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
    expect(hasActiveFilters({ ...EMPTY_FILTERS, yearRange: { fromYear: 2024, toYear: 2025 } })).toBe(true);
  });
});
