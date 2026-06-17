import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";

export interface Contributor {
  name: string;
  role: string;
  // email: string;
  linkedIn: string;
  team: string;
}

const REQUIRED_FIELDS: (keyof Contributor)[] = [
  "name",
  "role",
  // "email",
  "linkedIn",
  "team",
];

/**
 * Parses raw CSV text into a flat array of Contributor objects.
 * No grouping is done here — grouping by `team` (or anything else)
 * is the caller's responsibility at render/use time.
 *
 * Throws on:
 *  - any parse error reported by papaparse
 *  - any row missing a required field or containing an empty string for one
 */
export const parseContributorsCsv = (csvText: string): Contributor[] => {
  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transform: (value) => value.trim(),
  });

  if (result.errors.length > 0) {
    const details = result.errors
      .map((e) => `row ${e.row ?? "?"}: ${e.message}`)
      .join("; ");
    throw new Error(`Failed to parse contributors CSV: ${details}`);
  }

  const contributors: Contributor[] = result.data.map((row, index) => {
    for (const field of REQUIRED_FIELDS) {
      const value = row[field];
      if (!value || value.length === 0) {
        throw new Error(
          `Contributors CSV row ${index + 1} is missing required field "${field}". Row data: ${JSON.stringify(row)}`,
        );
      }
    }

    return {
      name: row.name,
      role: row.role,
      // email: row.email,
      linkedIn: row.linkedIn,
      team: row.team,
    };
  });

  return contributors;
};

/**
 * Convenience helper: reads scholar_team.csv from the project root
 * (alongside package.json) and parses it.
 *
 * Relies on process.cwd() rather than __dirname so this works
 * identically in dev (ts-node/tsx) and after compilation to dist/,
 * since __dirname would point at a different folder post-build.
 */
export const readAndParseContributorsCsv = (
  fileName: string = "scholar_team.csv",
): Contributor[] => {
  const filePath = path.join(process.cwd(), fileName);
  const csvText = fs.readFileSync(filePath, "utf-8");
  return parseContributorsCsv(csvText);
};
