import * as xlsx from "xlsx";
import { readFileSync } from "node:fs";
import { db } from "../src/db/db_config.js";

// ─────────────────────────────────────────────
// Enums (mirror of Prisma schema)
// ─────────────────────────────────────────────
const PUBLISHERS = [
  "IEEE",
  "APS",
  "Royal Society",
  "ACS",
  "ACM",
  "Taylor & Francis",
  "Oxford",
  "ElSevier",
  "Springer",
  "Sage",
  "MDPI",
] as const;

const PUBLICATION_TYPES = ["Transaction", "Magazine", "Journal", "Letter"] as const;

const PUBLICATION_ACCESS_TYPES = [
  "Hybrid",
  "Full Open Access",
  "Golden Open Access",
  "Diamond Open Access",
  "Green Open Access",
  "Bronze Open Access",
  "Subscriber Based Access",
] as const;

const PUBLICATION_INDICES = ["SCIE", "ESCI", "SSCI"] as const;

const QUARTILES = ["Q1", "Q2", "Q3", "Q4"] as const;

// Normalize "Full Open Access" -> "Full_Open_Access" etc.
function normalizeAccessType(raw: string): string | null {
  const value = raw.trim();
  // Special case: "Hybrid Open Access" -> "Hybrid"
  if (value.toLowerCase() === "hybrid open access") return "Hybrid";
  const mapped = value.replace(/\s+/g, "_");
  if ((PUBLICATION_ACCESS_TYPES as readonly string[]).includes(value)) return mapped;
  // Try direct underscore form already
  if ((PUBLICATION_ACCESS_TYPES as readonly string[]).map((v) => v.replace(/\s+/g, "_")).includes(mapped))
    return mapped;
  return null;
}

function enumMatch<T extends readonly string[]>(list: T, raw: string): T[number] | null {
  const value = raw.trim();
  if ((list as readonly string[]).includes(value)) return value as T[number];
  return null;
}

// ─────────────────────────────────────────────
// XLSX column header constants (exact match)
// ─────────────────────────────────────────────
const COL = {
  acronym: "Publication Acronym",
  type: "Publication Type",
  title: "Publication Title",
  domain: "Primary Domain",
  subCategory: "Sub-Category",
  focusScope: "Specific Focus / Scope",
  openAccess: "Open Access Type",
  issn: "ISSN",
  eissn: "eISSN",
  index: "Index",
  jif: "Journal Impact Factor (JIF)*",
  jif5: "5-Year Impact Factor*",
  quartile: "Quartile (JIF)",
  jci: "JCI",
  eigenfactor: "Eigenfactor",
  ais: "Article Influence Score (AIS)",
  citescore: "CiteScore",
  website: "Website Link",
  scope: "Journal Scope",
} as const;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function numOrNull(v: unknown): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

function strOrNull(v: unknown): string | null {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function stripIssn(v: unknown): string | null {
  const s = strOrNull(v);
  if (!s) return null;
  const cleaned = s.replace(/[-\s]/g, "");
  return cleaned.length === 8 ? cleaned : null;
}

// ─────────────────────────────────────────────
// Row processing
// ─────────────────────────────────────────────
interface RowResult {
  rowNumber: number;
  status: "ok" | "fail" | "warn";
  title: string;
  errors: string[];
  warnings: string[];
}

function processRow(raw: Record<string, unknown>, rowNumber: number): RowResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const title = strOrNull(raw[COL.title]) ?? `Row ${rowNumber}`;
  if (!strOrNull(raw[COL.title])) warnings.push("title: empty, will default to row number");

  const domain = strOrNull(raw[COL.domain]);
  if (!domain) errors.push("Primary Domain: required, cannot be empty");

  const subCategory = strOrNull(raw[COL.subCategory]);
  if (!subCategory) errors.push("Sub-Category: required, cannot be empty");

  const type = strOrNull(raw[COL.type]);
  let publicationType: string | null = null;
  if (type) {
    publicationType = enumMatch(PUBLICATION_TYPES, type);
    if (!publicationType) errors.push(`Publication Type: "${type}" is not a valid value`);
  } else {
    errors.push("Publication Type: required");
  }

  const oaRaw = strOrNull(raw[COL.openAccess]);
  let openAccessType: string | null = null;
  if (oaRaw) {
    openAccessType = normalizeAccessType(oaRaw);
    if (!openAccessType)
      errors.push(`Open Access Type: "${oaRaw}" is not a valid value`);
  } else {
    errors.push("Open Access Type: required");
  }

  const issn = stripIssn(raw[COL.issn]);
  if (strOrNull(raw[COL.issn]) && !issn)
    errors.push(`ISSN: "${raw[COL.issn]}" must be exactly 8 characters (after stripping hyphens)`);

  const eissn = stripIssn(raw[COL.eissn]);
  if (strOrNull(raw[COL.eissn]) && !eissn)
    errors.push(`eISSN: "${raw[COL.eissn]}" must be exactly 8 characters (after stripping hyphens)`);

  const index = strOrNull(raw[COL.index]);
  let indexingService: string | null = null;
  if (index) {
    indexingService = enumMatch(PUBLICATION_INDICES, index);
    if (!indexingService) errors.push(`Index: "${index}" is not a valid value (SCIE/ESCI/SSCI)`);
  }

  const quartile = strOrNull(raw[COL.quartile]);
  let quartileVal: string | null = null;
  if (quartile) {
    quartileVal = enumMatch(QUARTILES, quartile);
    if (!quartileVal) errors.push(`Quartile (JIF): "${quartile}" is not a valid value (Q1-Q4)`);
  }

  const metricFields = [
    [COL.jif, "Journal Impact Factor"],
    [COL.jif5, "5-Year Impact Factor"],
    [COL.jci, "JCI"],
    [COL.eigenfactor, "Eigenfactor"],
    [COL.ais, "Article Influence Score"],
    [COL.citescore, "CiteScore"],
  ] as const;

  let hasMetrics = false;
  for (const [field, label] of metricFields) {
    const n = numOrNull(raw[field]);
    if (n !== null) {
      hasMetrics = true;
      if (n < 0) errors.push(`${label}: must not be negative`);
    }
  }

  const status: RowResult["status"] =
    errors.length > 0 ? "fail" : warnings.length > 0 ? "warn" : "ok";

  return {
    rowNumber,
    status,
    title,
    errors,
    warnings,
  };
}

// ─────────────────────────────────────────────
// Import mode — actually write to DB
// ─────────────────────────────────────────────
async function importRow(
  raw: Record<string, unknown>,
  rowNumber: number,
  publisher: string,
): Promise<RowResult> {
  const validation = processRow(raw, rowNumber);
  if (validation.status === "fail") return validation;

  try {
    const domainName = strOrNull(raw[COL.domain])!;
    const subCatName = strOrNull(raw[COL.subCategory])!;

    const domain = await db.publicationDomain.upsert({
      where: { name: domainName },
      update: {},
      create: { name: domainName },
    });

    const existingSub = await db.publicationSubCategory.findFirst({
      where: { name: subCatName, domainId: domain.id },
    });
    const subCategory =
      existingSub ??
      (await db.publicationSubCategory.create({
        data: { name: subCatName, domainId: domain.id },
      }));

    const title = strOrNull(raw[COL.title]) ?? `Row ${rowNumber}`;

    const publication = await db.academicPublication.create({
      data: {
        subCategoryId: subCategory.id,
        acronym: strOrNull(raw[COL.acronym]),
        publisher: publisher as any,
        publicationType: enumMatch(PUBLICATION_TYPES, strOrNull(raw[COL.type])!) as any,
        title,
        issn: stripIssn(raw[COL.issn]),
        eissn: stripIssn(raw[COL.eissn]),
        URL: strOrNull(raw[COL.website]),
        openAccessType: normalizeAccessType(strOrNull(raw[COL.openAccess])!) as any,
        specificFocusScope: strOrNull(raw[COL.focusScope]),
        journalScope: strOrNull(raw[COL.scope]),
        workflow: "standard" as any,
        subBucket: "CoreGold" as any,
      },
    });

    const metricYear = 2026;
    const impactFactor = numOrNull(raw[COL.jif]);
    const impactFactor5yr = numOrNull(raw[COL.jif5]);
    const jci = numOrNull(raw[COL.jci]);
    const eigenfactor = numOrNull(raw[COL.eigenfactor]);
    const ais = numOrNull(raw[COL.ais]);
    const citescore = numOrNull(raw[COL.citescore]);
    const index = strOrNull(raw[COL.index]);
    const quartile = strOrNull(raw[COL.quartile]);

    const hasAnyMetric = [
      impactFactor,
      impactFactor5yr,
      jci,
      eigenfactor,
      ais,
      citescore,
      index,
      quartile,
    ].some((v) => v !== null);

    if (hasAnyMetric) {
      await db.publicationYearlyMetric.create({
        data: {
          publicationId: publication.id,
          metricYear,
          indexingService: index ? (enumMatch(PUBLICATION_INDICES, index) as any) : null,
          impactFactor: impactFactor,
          impactFactor5yr: impactFactor5yr,
          quartile: quartile ? (enumMatch(QUARTILES, quartile) as any) : null,
          jci: jci,
          eigenfactor: eigenfactor,
          articleInfluenceScore: ais,
          citescore: citescore,
          totalCitations: 0,
          articleDownloads: 0,
        },
      });
    }

    validation.status = validation.status === "warn" ? "warn" : "ok";
    return validation;
  } catch (err: any) {
    validation.status = "fail";
    validation.errors.push(`DB Error: ${err?.message ?? String(err)}`);
    return validation;
  }
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const filteredArgs = args.filter((a) => a !== "--dry-run");

  const [xlsxPath, publisherArg] = filteredArgs;

  if (!xlsxPath || !publisherArg) {
    console.error("Usage: npx tsx prisma/seed-publications.ts <path-to-xlsx> <publisher> [--dry-run]");
    console.error(`Valid publishers: ${PUBLISHERS.join(", ")}`);
    process.exit(1);
  }

  const publisher = enumMatch(PUBLISHERS, publisherArg);
  if (!publisher) {
    console.error(`Invalid publisher "${publisherArg}".`);
    console.error(`Valid publishers: ${PUBLISHERS.join(", ")}`);
    process.exit(1);
  }

  console.log(`\n📄 Reading XLSX: ${xlsxPath}`);
  console.log(`🏢 Publisher: ${publisher}`);
  console.log(`🔍 Mode: ${dryRun ? "DRY-RUN (no DB writes)" : "IMPORT"}\n`);

  const workbook = xlsx.read(readFileSync(xlsxPath), { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]!];
  const rows = xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

  if (rows.length === 0) {
    console.error("No data rows found in the first sheet.");
    process.exit(1);
  }

  let okCount = 0;
  let failCount = 0;
  let warnCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const rowNumber = i + 2; // +1 for header, +1 for 1-based
    const raw = rows[i]!;

    const result = dryRun
      ? processRow(raw, rowNumber)
      : await importRow(raw, rowNumber, publisher);

    const icon = result.status === "ok" ? "✅" : result.status === "warn" ? "⚠️" : "❌";
    let line = `${icon} Row ${rowNumber} — "${result.title}"`;
    if (result.status !== "ok") {
      const details = [
        ...result.errors.map((e) => `  - ${e}`),
        ...result.warnings.map((w) => `  - ${w}`),
      ].join("\n");
      line += `\n${details}`;
    }
    console.log(line);

    if (result.status === "ok") okCount++;
    else if (result.status === "warn") warnCount++;
    else failCount++;
  }

  console.log(`\n─────────────────────────────────`);
  console.log(`✅ ${okCount} valid`);
  console.log(`⚠️  ${warnCount} warnings`);
  console.log(`❌ ${failCount} failed`);
  console.log(`─────────────────────────────────`);

  if (!dryRun) {
    console.log(`\n📊 Import complete for publisher: ${publisher}`);
  }
}

main()
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
