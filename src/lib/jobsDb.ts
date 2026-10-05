import fs from "fs";
import path from "path";
import pg from "pg";
const { Pool } = pg;
import { matchCompanyId } from "../utils/companyMatcher.js";

export interface JobItem {
  id: number | string;
  source?: string;
  source_job_id?: string;
  title: string;
  company?: string;
  location?: string;
  url: string;
  canonical_url?: string;
  salary?: string;
  job_type?: string;
  tags_json?: string;
  is_remote?: number | boolean;
  original_source?: string;
  content_hash?: string;
  send_status?: string;
  first_seen_at?: string;
  last_seen_at?: string;
  last_checked_at?: string;
  is_taken?: boolean;
  number_visited?: number;
}

export interface CompanyMonthlyStat {
  company_id: string;
  year_month: string;
  job_count: number;
  updated_at?: string;
}

export interface JobsQueryFilter {
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  country?: string;
  discipline?: string;
  company?: string;
  type?: string;
  source?: string;
  is_remote?: boolean | string | number;
  includeTaken?: boolean;
}

const getJsonDbPath = () => path.join(process.cwd(), "jobs_export.json");
const getStatsJsonDbPath = () => path.join(process.cwd(), "company_monthly_stats.json");

let globalPgPool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!globalPgPool) {
    let connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (connectionString && connectionString.includes("sslmode=require")) {
      connectionString = connectionString.replace("sslmode=require", "sslmode=verify-full");
    }
    globalPgPool = new Pool({
      connectionString,
      ssl: connectionString?.includes("sslmode=") || connectionString?.includes("prisma")
        ? { rejectUnauthorized: false }
        : undefined,
    });
  }
  return globalPgPool;
}

export function isLocalJsonMode(): boolean {
  return process.env.USE_LOCAL_JSON_DB === "true";
}

export async function getJobs(filters: JobsQueryFilter = {}): Promise<{
  jobs: JobItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const pageNumber = Math.max(1, parseInt(String(filters.page || "1"), 10) || 1);
  const limitNumber = Math.min(100, Math.max(1, parseInt(String(filters.limit || "100"), 10) || 100));
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  if (isLocalJsonMode()) {
    try {
      const dbPath = getJsonDbPath();
      if (!fs.existsSync(dbPath)) {
        return { jobs: [], total: 0, page: pageNumber, limit: limitNumber, totalPages: 0 };
      }
      const rawData = await fs.promises.readFile(dbPath, "utf-8");
      const allJobs: JobItem[] = JSON.parse(rawData);

      const filtered = allJobs.filter((job) => {
        if (!filters.includeTaken && job.is_taken) return false;
        const seenDate = job.last_seen_at || job.first_seen_at;
        if (seenDate && seenDate < thirtyDaysAgo) return false;

        if (filters.search) {
          const s = String(filters.search).toLowerCase();
          const matchTitle = job.title?.toLowerCase().includes(s);
          const matchCompany = job.company?.toLowerCase().includes(s);
          const matchLocation = job.location?.toLowerCase().includes(s);
          const matchTags = job.tags_json?.toLowerCase().includes(s);
          if (!matchTitle && !matchCompany && !matchLocation && !matchTags) return false;
        }

        if (filters.company) {
          const c = String(filters.company).toLowerCase();
          if (!job.company?.toLowerCase().includes(c)) return false;
        }

        if (filters.country) {
          const c = String(filters.country).toLowerCase();
          if (!job.location?.toLowerCase().includes(c)) return false;
        }

        if (filters.source) {
          const src = String(filters.source).toLowerCase();
          if (!job.source?.toLowerCase().includes(src)) return false;
        }

        if (filters.type) {
          const t = String(filters.type).toLowerCase();
          if (!job.job_type?.toLowerCase().includes(t)) return false;
        }

        return true;
      });

      filtered.sort((a, b) => {
        const timeA = a.first_seen_at ? new Date(a.first_seen_at).getTime() : 0;
        const timeB = b.first_seen_at ? new Date(b.first_seen_at).getTime() : 0;
        return timeB - timeA;
      });

      const total = filtered.length;
      const startIndex = (pageNumber - 1) * limitNumber;
      const paginated = filtered.slice(startIndex, startIndex + limitNumber);

      return {
        jobs: paginated,
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      };
    } catch (err) {
      console.error("Error reading local JSON database:", err);
      throw err;
    }
  }

  const pool = getPool();
  const whereClauses: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (!filters.includeTaken) {
    whereClauses.push("(is_taken = false OR is_taken IS NULL)");
  }

  whereClauses.push(
    `COALESCE(NULLIF(last_seen_at, ''), NULLIF(first_seen_at, ''))::timestamptz >= $${paramIndex}::timestamptz`
  );
  values.push(thirtyDaysAgo);
  paramIndex++;

  if (filters.search) {
    whereClauses.push(`(
      title ILIKE $${paramIndex} OR
      company ILIKE $${paramIndex} OR
      location ILIKE $${paramIndex} OR
      tags_json ILIKE $${paramIndex}
    )`);
    values.push(`%${filters.search}%`);
    paramIndex++;
  }

  if (filters.company) {
    whereClauses.push(`company ILIKE $${paramIndex}`);
    values.push(`%${filters.company}%`);
    paramIndex++;
  }

  if (filters.country) {
    whereClauses.push(`location ILIKE $${paramIndex}`);
    values.push(`%${filters.country}%`);
    paramIndex++;
  }

  if (filters.source) {
    whereClauses.push(`source ILIKE $${paramIndex}`);
    values.push(`%${filters.source}%`);
    paramIndex++;
  }

  if (filters.type) {
    whereClauses.push(`job_type ILIKE $${paramIndex}`);
    values.push(`%${filters.type}%`);
    paramIndex++;
  }

  if (filters.is_remote !== undefined) {
    const isRemoteVal = filters.is_remote === true || filters.is_remote === "true" || filters.is_remote === 1 ? 1 : 0;
    whereClauses.push(`is_remote = $${paramIndex}`);
    values.push(isRemoteVal);
    paramIndex++;
  }

  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const countQuery = `SELECT COUNT(*)::int AS count FROM jobs ${whereString}`;
  const countResult = await pool.query(countQuery, values);
  const total = countResult.rows[0]?.count || 0;

  const dataQuery = `
    SELECT * FROM jobs
    ${whereString}
    ORDER BY first_seen_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;
  const offset = (pageNumber - 1) * limitNumber;
  const dataResult = await pool.query(dataQuery, [...values, limitNumber, offset]);

  return {
    jobs: dataResult.rows as JobItem[],
    total,
    page: pageNumber,
    limit: limitNumber,
    totalPages: Math.ceil(total / limitNumber),
  };
}

export async function getJobById(id: number | string): Promise<JobItem | null> {
  const isNumeric = !isNaN(Number(id));
  if (isLocalJsonMode()) {
    const dbPath = getJsonDbPath();
    if (!fs.existsSync(dbPath)) return null;
    const rawData = await fs.promises.readFile(dbPath, "utf-8");
    const jobs: JobItem[] = JSON.parse(rawData);
    return jobs.find((j) => String(j.id) === String(id)) || null;
  }

  const pool = getPool();
  const query = isNumeric
    ? `SELECT * FROM jobs WHERE id = $1::integer`
    : `SELECT * FROM jobs WHERE id::text = $1`;
  const { rows } = await pool.query(query, [id]);
  return (rows[0] as JobItem) || null;
}

export async function markJobAsTaken(id: number | string): Promise<{ success: boolean; message: string }> {
  const now = new Date().toISOString();

  if (isLocalJsonMode()) {
    const dbPath = getJsonDbPath();
    if (!fs.existsSync(dbPath)) {
      throw new Error("Local JSON database file not found");
    }

    const rawData = await fs.promises.readFile(dbPath, "utf-8");
    const jobs: JobItem[] = JSON.parse(rawData);

    const targetJob = jobs.find((job) => String(job.id) === String(id));
    if (targetJob) {
      targetJob.is_taken = true;
      targetJob.last_checked_at = now;
      await fs.promises.writeFile(dbPath, JSON.stringify(jobs, null, 4), "utf-8");
    }

    return { success: true, message: "Job marked as taken locally" };
  }

  const pool = getPool();
  await pool.query(
    `UPDATE jobs SET is_taken = true, last_checked_at = $1 WHERE id = $2`,
    [now, id]
  );
  return { success: true, message: "Job marked as taken in database" };
}

export async function incrementJobVisits(id: number | string): Promise<{ success: boolean; number_visited: number; notFound?: boolean }> {
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    throw new Error("Invalid Job ID: must be an integer");
  }

  if (isLocalJsonMode()) {
    const dbPath = getJsonDbPath();
    if (!fs.existsSync(dbPath)) {
      throw new Error("Local JSON database file not found");
    }

    const rawData = await fs.promises.readFile(dbPath, "utf-8");
    const jobs: JobItem[] = JSON.parse(rawData);

    const targetJob = jobs.find((job) => String(job.id) === String(numericId));
    if (!targetJob) {
      return { success: false, number_visited: 0, notFound: true };
    }

    targetJob.number_visited = (targetJob.number_visited || 0) + 1;
    await fs.promises.writeFile(dbPath, JSON.stringify(jobs, null, 4), "utf-8");

    return { success: true, number_visited: targetJob.number_visited };
  }

  const pool = getPool();
  const { rows } = await pool.query(
    `UPDATE jobs
     SET number_visited = COALESCE(number_visited, 0) + 1
     WHERE id = $1::integer
     RETURNING number_visited`,
    [numericId]
  );

  if (rows.length === 0) {
    return { success: false, number_visited: 0, notFound: true };
  }

  return { success: true, number_visited: rows[0].number_visited };
}

export async function insertBatchJobs(jobs: Partial<JobItem>[]): Promise<{ success: boolean; inserted: number }> {
  if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
    return { success: true, inserted: 0 };
  }

  if (isLocalJsonMode()) {
    const dbPath = getJsonDbPath();
    let currentJobs: JobItem[] = [];
    if (fs.existsSync(dbPath)) {
      try {
        currentJobs = JSON.parse(await fs.promises.readFile(dbPath, "utf-8"));
      } catch {
        currentJobs = [];
      }
    }

    let nextId = Math.max(0, ...currentJobs.map((j) => Number(j.id) || 0)) + 1;
    let inserted = 0;
    const now = new Date().toISOString();

    for (const job of jobs) {
      if (!job.title || !job.url) continue;
      currentJobs.unshift({
        id: nextId++,
        source: job.source || "manual",
        source_job_id: job.source_job_id || "",
        title: job.title,
        company: job.company || "",
        location: job.location || "",
        url: job.url,
        canonical_url: job.canonical_url || job.url,
        salary: job.salary || "",
        job_type: job.job_type || "",
        tags_json: job.tags_json || "[]",
        is_remote: job.is_remote ? 1 : 0,
        original_source: job.original_source || "",
        content_hash: job.content_hash || `${job.title}|${job.company}|${job.url}`,
        send_status: "pending",
        first_seen_at: job.first_seen_at || now,
        last_seen_at: job.last_seen_at || now,
        is_taken: false,
        number_visited: 0,
      });
      inserted++;
    }

    await fs.promises.writeFile(dbPath, JSON.stringify(currentJobs, null, 4), "utf-8");
    return { success: true, inserted };
  }

  const pool = getPool();
  let count = 0;
  const now = new Date().toISOString();

  for (const job of jobs) {
    if (!job.title || !job.url) continue;
    await pool.query(
      `INSERT INTO jobs (
        source, source_job_id, title, company, location, url, canonical_url,
        salary, job_type, tags_json, is_remote, original_source, content_hash,
        send_status, first_seen_at, last_seen_at, is_taken, number_visited
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'pending', $14, $15, false, 0)
      ON CONFLICT (content_hash) DO UPDATE SET
        last_seen_at = EXCLUDED.last_seen_at,
        source = EXCLUDED.source,
        title = EXCLUDED.title,
        company = EXCLUDED.company,
        location = EXCLUDED.location,
        url = EXCLUDED.url`,
      [
        job.source || "manual",
        job.source_job_id || "",
        job.title,
        job.company || "",
        job.location || "",
        job.url,
        job.canonical_url || job.url,
        job.salary || "",
        job.job_type || "",
        job.tags_json || "[]",
        job.is_remote ? 1 : 0,
        job.original_source || "",
        job.content_hash || `${job.title}|${job.company}|${job.url}`,
        job.first_seen_at || now,
        job.last_seen_at || now,
      ]
    );
    count++;
  }

  return { success: true, inserted: count };
}

export async function isSyncDue(): Promise<boolean> {
  const now = new Date();
  const currentDay = now.getDate();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), currentDay + 1);
  const isLastDayOfMonth = tomorrow.getDate() === 1;
  const isFirstDayOfMonth = currentDay === 1;
  const isFiveDayMark = currentDay % 5 === 0;

  if (isLastDayOfMonth || isFirstDayOfMonth || isFiveDayMark) {
    return true;
  }

  const currentYm = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;

  if (isLocalJsonMode()) {
    const statsPath = getStatsJsonDbPath();
    if (!fs.existsSync(statsPath)) return true;
    try {
      const statsRaw = await fs.promises.readFile(statsPath, "utf-8");
      const stats: (CompanyMonthlyStat & { updated_at?: string })[] = JSON.parse(statsRaw);
      const currentStats = stats.filter((s) => s.year_month === currentYm);
      if (currentStats.length === 0) return true;
      const latestUpdate = Math.max(...currentStats.map((s) => (s.updated_at ? new Date(s.updated_at).getTime() : 0)));
      return Date.now() - latestUpdate > 5 * 24 * 60 * 60 * 1000;
    } catch {
      return true;
    }
  }

  const pool = getPool();
  try {
    const { rows } = await pool.query(
      `SELECT MAX(updated_at) AS last_updated 
       FROM company_monthly_stats 
       WHERE year_month = $1`,
      [currentYm]
    );
    if (!rows[0]?.last_updated) return true;
    const lastUpdated = new Date(rows[0].last_updated).getTime();
    return Date.now() - lastUpdated > 5 * 24 * 60 * 60 * 1000;
  } catch {
    return true;
  }
}

export async function syncCompanyMonthlyStats(targetMonths?: string[]): Promise<{ success: boolean; syncedMonths: string[] }> {
  const now = new Date();

  if (!targetMonths || targetMonths.length === 0) {
    const currentYm = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
    const prevDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
    const prevYm = `${prevDate.getUTCFullYear()}-${String(prevDate.getUTCMonth() + 1).padStart(2, "0")}`;
    targetMonths = [prevYm, currentYm];
  }

  if (isLocalJsonMode()) {
    const dbPath = getJsonDbPath();
    const statsPath = getStatsJsonDbPath();

    if (!fs.existsSync(dbPath)) {
      return { success: true, syncedMonths: targetMonths };
    }

    const rawJobs = await fs.promises.readFile(dbPath, "utf-8");
    const jobs: JobItem[] = JSON.parse(rawJobs);

    let existingStats: CompanyMonthlyStat[] = [];
    if (fs.existsSync(statsPath)) {
      try {
        existingStats = JSON.parse(await fs.promises.readFile(statsPath, "utf-8"));
      } catch {
        existingStats = [];
      }
    }

    const counts: Record<string, number> = {};
    for (const job of jobs) {
      if (!job.first_seen_at) continue;
      const d = new Date(job.first_seen_at);
      const ym = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
      if (!targetMonths.includes(ym)) continue;

      const compId = matchCompanyId(job.company);
      if (!compId) continue;

      const key = `${compId}__${ym}`;
      counts[key] = (counts[key] || 0) + 1;
    }

    const nowIso = now.toISOString();
    for (const [key, count] of Object.entries(counts)) {
      const [company_id, year_month] = key.split("__");
      const idx = existingStats.findIndex((s) => s.company_id === company_id && s.year_month === year_month);
      if (idx >= 0) {
        existingStats[idx].job_count = Math.max(existingStats[idx].job_count, count);
        existingStats[idx].updated_at = nowIso;
      } else {
        existingStats.push({ company_id, year_month, job_count: count, updated_at: nowIso });
      }
    }

    await fs.promises.writeFile(statsPath, JSON.stringify(existingStats, null, 4), "utf-8");
    return { success: true, syncedMonths: targetMonths };
  }

  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS company_monthly_stats (
        company_id VARCHAR(64) NOT NULL,
        year_month VARCHAR(7) NOT NULL,
        job_count INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (company_id, year_month)
    );
    CREATE INDEX IF NOT EXISTS idx_company_monthly_stats_ym ON company_monthly_stats(year_month);
  `);

  await pool.query(
    `INSERT INTO company_monthly_stats (company_id, year_month, job_count, updated_at)
     SELECT 
       matched.company_id,
       to_char((j."postedAt" AT TIME ZONE 'UTC'), 'YYYY-MM') AS year_month,
       COUNT(DISTINCT j.id)::int AS job_count,
       NOW() AS updated_at
     FROM jobs j JOIN companies c ON j."companyId" = c.id
     CROSS JOIN LATERAL (
       SELECT CASE
         WHEN c.name ILIKE '%siemens energy%' THEN 'siemens-energy'
         WHEN c.name ILIKE '%siemens gamesa%' THEN 'siemens-gamesa'
         WHEN c.name ILIKE '%siemens digital industries%' 
           OR c.name ILIKE '%siemens dis%' 
           OR c.name ILIKE '%siemens eda%' 
           OR c.name ILIKE '%mentor graphics%' THEN 'siemens-dis'
         WHEN c.name ILIKE '%siemens%' THEN 'siemens'
         WHEN c.name ILIKE '%stmicroelectronics%' 
           OR c.name ILIKE '%stmicro%' 
           OR c.name ILIKE '%st micro%' THEN 'stmicroelectronics'
         WHEN c.name ILIKE '%mediatek%' THEN 'mediatek'
         WHEN c.name ILIKE '%analog devices%' THEN 'analog-devices'
         WHEN c.name ILIKE '%intel%' 
           AND c.name NOT ILIKE '%intelligent%' 
           AND c.name NOT ILIKE '%infineon%' THEN 'intel'
         WHEN c.name ILIKE '%texas instruments%' THEN 'texas-instruments'
         WHEN c.name ILIKE '%infineon%' THEN 'infineon'
         WHEN c.name ILIKE '%capgemini%' THEN 'capgemini'
         WHEN c.name ILIKE '%cisco%' 
           AND c.name NOT ILIKE '%san francisco%' THEN 'cisco'
         WHEN c.name ILIKE '%infinilink%' THEN 'infinilink'
         WHEN c.name ILIKE '%valeo%' THEN 'valeo'
         WHEN c.name ILIKE '%dell %' 
           OR c.name ILIKE '%dell technologies%' 
           OR c.name ILIKE '%dell inc%' THEN 'dell'
         WHEN c.name ILIKE '%vodafone%' 
           OR c.name ILIKE '%vois%' THEN 'vodafone'
         WHEN c.name ILIKE '%iss international%' THEN 'iss-international'
         WHEN c.name ILIKE '%mixel%' THEN 'mixel'
         ELSE NULL
       END AS company_id
     ) matched
     WHERE matched.company_id IS NOT NULL
       AND j."postedAt" IS NOT NULL
       AND to_char((j."postedAt" AT TIME ZONE 'UTC'), 'YYYY-MM') = ANY($1::text[])
     GROUP BY matched.company_id, to_char((j."postedAt" AT TIME ZONE 'UTC'), 'YYYY-MM')
     ON CONFLICT (company_id, year_month)
     DO UPDATE SET 
       job_count = GREATEST(company_monthly_stats.job_count, EXCLUDED.job_count),
       updated_at = NOW();`,
    [targetMonths]
  );

  return { success: true, syncedMonths: targetMonths };
}

export async function purgeExpiredCompanyStats(): Promise<{ success: boolean; deletedCount: number }> {
  const cutoffDate = new Date();
  cutoffDate.setUTCMonth(cutoffDate.getUTCMonth() - 12);
  const cutoffYm = `${cutoffDate.getUTCFullYear()}-${String(cutoffDate.getUTCMonth() + 1).padStart(2, "0")}`;

  if (isLocalJsonMode()) {
    const statsPath = getStatsJsonDbPath();
    if (!fs.existsSync(statsPath)) return { success: true, deletedCount: 0 };
    try {
      const statsRaw = await fs.promises.readFile(statsPath, "utf-8");
      const stats: CompanyMonthlyStat[] = JSON.parse(statsRaw);
      const filtered = stats.filter((s) => s.year_month >= cutoffYm);
      const deletedCount = stats.length - filtered.length;
      if (deletedCount > 0) {
        await fs.promises.writeFile(statsPath, JSON.stringify(filtered, null, 4), "utf-8");
      }
      return { success: true, deletedCount };
    } catch {
      return { success: false, deletedCount: 0 };
    }
  }

  const pool = getPool();
  try {
    const { rowCount } = await pool.query(
      `DELETE FROM company_monthly_stats WHERE year_month < $1`,
      [cutoffYm]
    );
    return { success: true, deletedCount: rowCount || 0 };
  } catch {
    return { success: false, deletedCount: 0 };
  }
}

export async function getCompanyMonthlyStats(): Promise<CompanyMonthlyStat[]> {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setUTCMonth(twelveMonthsAgo.getUTCMonth() - 11);
  const cutoffYm = `${twelveMonthsAgo.getUTCFullYear()}-${String(twelveMonthsAgo.getUTCMonth() + 1).padStart(2, "0")}`;

  try {
    if (await isSyncDue()) {
      await syncCompanyMonthlyStats();
    }
  } catch (syncErr) {
    console.warn("Company monthly stats sync check warning:", syncErr);
  }

  if (isLocalJsonMode()) {
    const statsPath = getStatsJsonDbPath();
    if (!fs.existsSync(statsPath)) return [];
    try {
      const statsRaw = await fs.promises.readFile(statsPath, "utf-8");
      const stats: CompanyMonthlyStat[] = JSON.parse(statsRaw);
      return stats.filter((s) => s.year_month >= cutoffYm).sort((a, b) => a.year_month.localeCompare(b.year_month));
    } catch {
      return [];
    }
  }

  const pool = getPool();
  try {
    const { rows } = await pool.query(
      `SELECT company_id, year_month, job_count
       FROM company_monthly_stats
       WHERE year_month >= $1
       ORDER BY year_month ASC`,
      [cutoffYm]
    );
    return rows as CompanyMonthlyStat[];
  } catch (err: any) {
    console.warn("Failed to query company_monthly_stats, returning empty:", err.message);
    return [];
  }
}

export async function cleanupClosedJobs(limit = 50): Promise<{ checked: number; closed: number }> {
  const pool = getPool();
  const { rows: jobs } = await pool.query(`
    SELECT id, url, source FROM jobs 
    WHERE (is_taken = false OR is_taken IS NULL)
      AND (source = 'LinkedIn' OR source = 'Wuzzuf' OR source = 'linkedin' OR source = 'wuzzuf')
    ORDER BY last_checked_at ASC NULLS FIRST
    LIMIT $1
  `, [limit]);

  if (jobs.length === 0) {
    return { checked: 0, closed: 0 };
  }

  let closedCount = 0;
  const now = new Date().toISOString();

  for (const job of jobs) {
    if (!job.url) continue;

    try {
      const response = await fetch(job.url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(5000),
        redirect: job.source.toLowerCase() === "wuzzuf" ? "manual" : "follow",
      });

      let isClosed = false;
      const lowerSource = job.source.toLowerCase();

      if (lowerSource === "wuzzuf") {
        if (response.status === 302 || response.status === 404) {
          isClosed = true;
        } else if (response.ok) {
          const html = await response.text();
          if (html.includes("This job is no longer available") || html.includes("Applications are closed")) {
            isClosed = true;
          }
        }
      } else if (lowerSource === "linkedin") {
        if (response.ok) {
          const html = await response.text();
          if (
            html.includes("No longer accepting applications") ||
            html.includes("Not currently accepting applications")
          ) {
            isClosed = true;
          }
        }
      }

      if (isClosed) {
        await pool.query(`UPDATE jobs SET is_taken = true, last_checked_at = $1 WHERE id = $2`, [now, job.id]);
        closedCount++;
        continue;
      }
    } catch (err) {
      console.error(`Failed to verify job ${job.id}:`, err);
    }

    await pool.query(`UPDATE jobs SET last_checked_at = $1 WHERE id = $2`, [now, job.id]);
  }

  return { checked: jobs.length, closed: closedCount };
}
