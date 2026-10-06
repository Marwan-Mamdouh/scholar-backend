import { db } from "../db/db_config.js";
import pg from "pg";

let globalPgPool: pg.Pool | null = null;
export function getPool(): pg.Pool {
  if (!globalPgPool) {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("Missing POSTGRES_URL or DATABASE_URL in environment variables.");
    }
    globalPgPool = new pg.Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
  }
  return globalPgPool;
}

export function isLocalJsonMode(): boolean {
  return false;
}
export function getStatsJsonDbPath(): string { return ""; }

export interface CompanyMonthlyStat {
  company_id: string;
  year_month: string;
  job_count: number;
  updated_at?: string;
}

export async function insertBatchJobs(jobs: Partial<any>[]): Promise<{ success: boolean; inserted: number }> {
  if (!jobs || !Array.isArray(jobs) || jobs.length === 0) return { success: true, inserted: 0 };
  let count = 0;
  for (const job of jobs) {
    if (!job.title || !job.url) continue;
    const companyName = job.company || "Unknown Company";
    const locationName = job.location || "Unknown Location";
    const now = new Date();
    try {
        let comp = await db.company.findUnique({ where: { name: companyName } });
        if (!comp) comp = await db.company.create({ data: { name: companyName } });
        let branch = await db.companyBranch.findFirst({ where: { companyId: comp.id, city: locationName } });
        if (!branch) branch = await db.companyBranch.create({ data: { companyId: comp.id, city: locationName } });

        const hash = job.content_hash || `${job.title}|${job.company}|${job.url}`;
        let existingJob = await db.job.findFirst({ where: { contentHash: hash } });
        if (existingJob) {
            await db.job.update({
                where: { id: existingJob.id },
                data: {
                    lastCheckedAt: new Date(job.last_seen_at || now),
                    source: job.source,
                    title: job.title,
                    applyLink: job.url
                }
            });
        } else {
            await db.job.create({
                data: {
                    companyId: comp.id,
                    branchId: branch.id,
                    title: job.title,
                    salary: job.salary || null,
                    applyLink: job.url,
                    source: job.source || "manual",
                    originalSource: job.original_source || null,
                    contentHash: hash,
                    postedAt: job.first_seen_at ? new Date(job.first_seen_at) : now,
                    lastCheckedAt: job.last_seen_at ? new Date(job.last_seen_at) : now,
                    isTaken: false
                }
            });
            count++;
        }
    } catch (e) { console.error("Error inserting job:", e); }
  }
  return { success: true, inserted: count };
}

export async function cleanupClosedJobs(limit = 50): Promise<{ checked: number; closed: number }> {
  const jobs = await db.job.findMany({
    where: { isTaken: false, source: { in: ['LinkedIn', 'Wuzzuf', 'linkedin', 'wuzzuf'] } },
    orderBy: { lastCheckedAt: 'asc' },
    take: limit
  });
  if (jobs.length === 0) return { checked: 0, closed: 0 };
  let closedCount = 0;
  const now = new Date();
  for (const job of jobs) {
    if (!job.applyLink) continue;
    try {
      const response = await fetch(job.applyLink, {
        headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "en-US,en;q=0.9" },
        signal: AbortSignal.timeout(5000),
        redirect: job.source?.toLowerCase() === "wuzzuf" ? "manual" : "follow",
      });
      let isClosed = false;
      const lowerSource = job.source?.toLowerCase() || '';
      if (lowerSource === "wuzzuf") {
        if (response.status === 302 || response.status === 404) isClosed = true;
        else if (response.ok) {
          const html = await response.text();
          if (html.includes("This job is no longer available") || html.includes("Applications are closed")) isClosed = true;
        }
      } else if (lowerSource === "linkedin") {
        if (response.ok) {
          const html = await response.text();
          if (html.includes("No longer accepting applications") || html.includes("Not currently accepting applications")) isClosed = true;
        }
      }
      if (isClosed) {
        await db.job.update({ where: { id: job.id }, data: { isTaken: true, lastCheckedAt: now } });
        closedCount++;
        continue;
      }
    } catch (err) { }
    await db.job.update({ where: { id: job.id }, data: { lastCheckedAt: now } });
  }
  return { checked: jobs.length, closed: closedCount };
}

export async function fetchJobs(limit = 10, offset = 0, isTaken?: boolean, lastCheckedBefore?: Date, source?: string, daysLimit?: number) {
  let where: any = {};
  if (isTaken !== undefined) where.isTaken = isTaken;
  if (source) where.source = source;
  if (lastCheckedBefore) where.lastCheckedAt = { lt: lastCheckedBefore };
  if (daysLimit) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - daysLimit);
      where.postedAt = { gte: cutoff };
  }
  const items = await db.job.findMany({ where, take: limit, skip: offset, orderBy: { postedAt: 'desc' }, include: { company: true, branch: true } });
  const total = await db.job.count({ where });
  return { success: true, items, total, page: Math.floor(offset / limit) + 1, totalPages: Math.ceil(total / limit) };
}

export async function markJobTaken(id: number | string) {
  await db.job.update({ where: { id: Number(id) }, data: { isTaken: true } });
  return { success: true };
}

export async function getJobs(filters: any = {}): Promise<{ success: boolean; data: any[]; total: number }> {
    const res = await fetchJobs(filters.limit || 50, filters.offset || 0, filters.isTaken, undefined, filters.source);
    return { success: true, data: res.items, total: res.total };
}

export async function getJobById(id: number | string): Promise<any | null> {
    return await db.job.findUnique({ where: { id: Number(id) }, include: { company: true, branch: true } });
}

export async function incrementJobVisits(id: number | string): Promise<{ success: boolean; number_visited: number; notFound?: boolean }> {
    try {
        const job = await db.job.findUnique({ where: { id: Number(id) } });
        if (!job) return { success: false, number_visited: 0, notFound: true };
        const updated = await db.job.update({ where: { id: Number(id) }, data: { numberVisited: (job.numberVisited || 0) + 1 } });
        return { success: true, number_visited: updated.numberVisited || 0 };
    } catch (e) {
        return { success: false, number_visited: 0, notFound: true };
    }
}

export async function markJobAsTaken(id: number | string): Promise<{ success: boolean; message: string }> {
    try {
        await db.job.update({ where: { id: Number(id) }, data: { isTaken: true } });
        return { success: true, message: "Job marked as taken" };
    } catch (e) {
        return { success: false, message: "Job not found" };
    }
}

async function isSyncDue(): Promise<boolean> {
  const pool = getPool();
  try {
    const { rows } = await pool.query(
      "SELECT MAX(updated_at) as last_updated FROM company_monthly_stats"
    );
    if (!rows.length || !rows[0].last_updated) return true;
    const lastUpdated = new Date(rows[0].last_updated);
    const hoursSinceUpdate = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60);
    return hoursSinceUpdate > 24;
  } catch (err) {
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

