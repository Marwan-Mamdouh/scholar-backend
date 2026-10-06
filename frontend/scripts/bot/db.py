"""
PostgreSQL & Local JSON persistence layer for the Telegram jobs bot.
"""

from __future__ import annotations

import hashlib
import json
import re
import os
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from typing import Iterator, Optional
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

import psycopg2
import psycopg2.extras
from psycopg2.extensions import connection

from models import Job

SCHEMA_VERSION = 1

_TRACKING_QUERY_PREFIXES = ("utm_",)
_TRACKING_QUERY_KEYS = {
    "fbclid", "gclid", "msclkid", "mc_cid", "mc_eid",
    "trk", "tracking_id", "ref", "refid",
}


@dataclass(frozen=True)
class StoredJob:
    id: int
    source: str
    source_job_id: str
    title: str
    company: str
    location: str
    url: str
    canonical_url: str
    salary: str
    job_type: str
    tags: list
    is_remote: bool
    "originalSource": str
    "contentHash": str
    "sendStatus": str
    "postedAt": str
    "updatedAt": str
    last_checked_at: str = ""
    number_visited: int = 0

    def to_job(self) -> Job:
        return Job(
            title=self.title,
            company=self.company,
            location=self.location,
            url=self.url,
            source=self.source,
            salary=self.salary,
            job_type=self.job_type,
            tags=self.tags,
            is_remote=self.is_remote,
            "originalSource"=self."originalSource",
            number_visited=self.number_visited,
        )


def is_json_db_mode() -> bool:
    if os.environ.get("USE_LOCAL_JSON_DB", "").lower() in ("true", "1", "yes"):
        return True
    try:
        env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env.local"))
        if os.path.exists(env_path):
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip().startswith("USE_LOCAL_JSON_DB="):
                        val = line.strip().split("=", 1)[1].strip('"\'').lower()
                        return val in ("true", "1", "yes")
    except Exception:
        pass
    return False


def get_json_db_filepath() -> str:
    return os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "jobs_export.json"))


def get_postgres_url() -> str:
    url = os.environ.get("POSTGRES_URL")
    if not url:
        try:
            env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env.local"))
            if os.path.exists(env_path):
                with open(env_path, "r", encoding="utf-8") as f:
                    for line in f:
                        if line.strip().startswith("POSTGRES_URL="):
                            url = line.strip().split("=", 1)[1].strip('"\'')
        except Exception:
            pass
    if not url:
        raise ValueError("POSTGRES_URL environment variable is missing!")
    return url


class DummyJsonConnection:
    def commit(self):
        pass
    def rollback(self):
        pass
    def close(self):
        pass


@contextmanager
def connect(db_path: str = "") -> Iterator[connection]:
    """Open a PostgreSQL or Local JSON database connection."""
    if is_json_db_mode():
        conn = DummyJsonConnection()
        yield conn
        return

    conn = psycopg2.connect(get_postgres_url())
    try:
        init_db(conn)
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db(conn: connection) -> None:
    """Create or migrate the database schema in PostgreSQL."""
    if is_json_db_mode():
        filepath = get_json_db_filepath()
        if not os.path.exists(filepath):
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump([], f)
        return

    with conn.cursor() as cur:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS metadata (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS jobs (
                id SERIAL PRIMARY KEY,
                source TEXT NOT NULL,
                source_job_id TEXT DEFAULT '',
                title TEXT NOT NULL,
                company TEXT DEFAULT '',
                location TEXT DEFAULT '',
                url TEXT NOT NULL,
                canonical_url TEXT NOT NULL,
                salary TEXT DEFAULT '',
                job_type TEXT DEFAULT '',
                tags_json TEXT DEFAULT '[]',
                is_remote INTEGER DEFAULT 0,
                "originalSource" TEXT DEFAULT '',
                "contentHash" TEXT NOT NULL UNIQUE,
                "sendStatus" TEXT NOT NULL DEFAULT 'pending',
                "postedAt" TEXT NOT NULL,
                "updatedAt" TEXT NOT NULL,
                "isTaken" BOOLEAN DEFAULT false,
                last_checked_at TEXT
            );

            CREATE INDEX IF NOT EXISTS idx_jobs_"sendStatus"
                ON jobs("sendStatus", "updatedAt");

            CREATE INDEX IF NOT EXISTS idx_jobs_source
                ON jobs(source, "updatedAt");

            CREATE INDEX IF NOT EXISTS idx_jobs_"isTaken"
                ON jobs("isTaken", "postedAt");

            CREATE TABLE IF NOT EXISTS job_sends (
                id SERIAL PRIMARY KEY,
                job_id INTEGER NOT NULL,
                topic_key TEXT NOT NULL,
                status TEXT NOT NULL,
                sent_at TEXT,
                error TEXT DEFAULT '',
                updated_at TEXT NOT NULL,
                UNIQUE(job_id, topic_key),
                FOREIGN KEY(job_id) REFERENCES jobs(id) ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_job_sends_status
                ON job_sends(status, updated_at);

            CREATE TABLE IF NOT EXISTS source_runs (
                source TEXT PRIMARY KEY,
                last_run_at TEXT,
                status TEXT NOT NULL DEFAULT 'never',
                error TEXT DEFAULT '',
                updated_at TEXT NOT NULL
            );
            
            ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "isTaken" BOOLEAN DEFAULT false;
            ALTER TABLE jobs ADD COLUMN IF NOT EXISTS last_checked_at TEXT;
            ALTER TABLE jobs ADD COLUMN IF NOT EXISTS number_visited INTEGER DEFAULT 0;
        """)
        
        cur.execute(
            """
            INSERT INTO metadata (key, value) 
            VALUES (%s, %s)
            ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
            """,
            ("schema_version", str(SCHEMA_VERSION)),
        )


def now_utc() -> str:
    return datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _parse_iso_timestamp(value: object) -> datetime | None:
    if not value:
        return None
    text = str(value).strip()
    if not text:
        return None
    if text.endswith("Z"):
        text = f"{text[:-1]}+00:00"
    try:
        parsed = datetime.fromisoformat(text)
    except ValueError:
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=UTC)
    return parsed.astimezone(UTC)


def normalize_text(value: object) -> str:
    if value is None:
        return ""
    text = str(value).strip().lower()
    text = re.sub(r"\s+", " ", text)
    return text


def normalize_company(value: object) -> str:
    text = normalize_text(value)
    suffixes = r"\b(inc|inc\.|ltd|ltd\.|llc|corp|corporation|company|co\.|gmbh|ag|sa|pvt)\b"
    text = re.sub(suffixes, "", text)
    text = re.sub(r"\s+", " ", text).strip(" ,.-")
    return text


def canonicalize_url(url: str) -> str:
    if not url:
        return ""
    split = urlsplit(url.strip())
    scheme = split.scheme.lower() or "https"
    netloc = split.netloc.lower()
    path = split.path.rstrip("/") or split.path
    kept_query_pairs: list[tuple[str, str]] = []
    for key, value in parse_qsl(split.query, keep_blank_values=True):
        key_l = key.lower()
        if key_l in _TRACKING_QUERY_KEYS:
            continue
        if any(key_l.startswith(prefix) for prefix in _TRACKING_QUERY_PREFIXES):
            continue
        kept_query_pairs.append((key, value))
    query = urlencode(kept_query_pairs, doseq=True)
    return urlunsplit((scheme, netloc, path, query, ""))


def job_"contentHash"(job: Job) -> str:
    canonical_url = canonicalize_url(job.url)
    raw = "|".join([
        normalize_text(job.title),
        normalize_company(job.company),
        normalize_text(job.location),
        canonical_url,
    ])
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def upsert_job(conn: connection, job: Job) -> tuple[int, bool]:
    if not job.title or not job.url:
        raise ValueError("Job must have a title and url before persistence.")

    ts = now_utc()
    canonical_url = canonicalize_url(job.url)
    "contentHash" = job_"contentHash"(job)
    source_job_id = str(getattr(job, "source_job_id", "") or "")
    tags_json = json.dumps(job.tags or [], ensure_ascii=False, sort_keys=True)
    is_job_closed = bool(getattr(job, ""isTaken"", False))

    if is_json_db_mode():
        filepath = get_json_db_filepath()
        jobs_data = []
        if os.path.exists(filepath):
            with open(filepath, "r", encoding="utf-8") as f:
                try:
                    jobs_data = json.load(f)
                except Exception:
                    jobs_data = []

        existing = None
        for item in jobs_data:
            if item.get(""contentHash"") == "contentHash":
                existing = item
                break

        if existing:
            job_id = existing["id"]
            if is_job_closed:
                existing[""isTaken""] = True
                existing[""updatedAt""] = ts
            else:
                existing.update({
                    "source": job.source,
                    "source_job_id": source_job_id,
                    "title": job.title,
                    "company": job.company or "",
                    "location": job.location or "",
                    "url": job.url,
                    "canonical_url": canonical_url,
                    "salary": job.salary or "",
                    "job_type": job.job_type or "",
                    "tags_json": tags_json,
                    "is_remote": 1 if job.is_remote else 0,
                    ""originalSource"": job."originalSource" or "",
                    ""updatedAt"": ts,
                })
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(jobs_data, f, indent=4, ensure_ascii=False)
            return job_id, False

        # If job is closed and NOT in DB, do not insert
        if is_job_closed:
            return 0, False

        max_id = max((int(item.get("id", 0)) for item in jobs_data if isinstance(item.get("id"), (int, str)) and str(item.get("id")).isdigit()), default=0)
        job_id = max_id + 1

        new_entry = {
            "id": job_id,
            "source": job.source,
            "source_job_id": source_job_id,
            "title": job.title,
            "company": job.company or "",
            "location": job.location or "",
            "url": job.url,
            "canonical_url": canonical_url,
            "salary": job.salary or "",
            "job_type": job.job_type or "",
            "tags_json": tags_json,
            "is_remote": 1 if job.is_remote else 0,
            ""originalSource"": job."originalSource" or "",
            ""contentHash"": "contentHash",
            ""sendStatus"": "pending",
            ""postedAt"": ts,
            ""updatedAt"": ts,
            ""isTaken"": False,
            "number_visited": 0
        }
        jobs_data.insert(0, new_entry)

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(jobs_data, f, indent=4, ensure_ascii=False)

        return job_id, True

    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute("SELECT id FROM jobs WHERE "contentHash" = %s", ("contentHash",))
        existing = cur.fetchone()

        if existing:
            job_id = existing["id"]
            if is_job_closed:
                cur.execute('UPDATE jobs SET "isTaken" = true, "updatedAt" = %s WHERE id = %s', (ts, job_id))
            else:
                cur.execute(
                    '''
                    UPDATE jobs
                    SET source = %s, title = %s, "applyLink" = %s, "salary" = %s,
                        "originalSource" = %s, "updatedAt" = %s
                    WHERE id = %s
                    ''',
                    (
                        job.source, job.title, job.url, job.salary or "",
                        job."originalSource" or "", ts, job_id
                    )
                )
            return job_id, False

        if is_job_closed:
            return 0, False

        # 1. Upsert Company
        cur.execute(
            'INSERT INTO companies (name, "updatedAt") VALUES (%s, NOW()) '
            'ON CONFLICT (name) DO UPDATE SET "updatedAt" = NOW() RETURNING id',
            (job.company or "Unknown",)
        )
        company_id = cur.fetchone()[0]

        # 2. Upsert Branch
        cur.execute(
            'SELECT id FROM "companyBranches" WHERE "companyId" = %s LIMIT 1',
            (company_id,)
        )
        branch_row = cur.fetchone()
        if branch_row:
            branch_id = branch_row[0]
        else:
            cur.execute(
                'INSERT INTO "companyBranches" ("companyId", city, country) VALUES (%s, %s, %s) RETURNING id',
                (company_id, job.location or "", "")
            )
            branch_id = cur.fetchone()[0]

        # 3. Insert Job
        cur.execute(
            '''
            INSERT INTO jobs (
                source, title, "companyId", "branchId", "applyLink",
                "salary", "originalSource", "contentHash", "postedAt", "updatedAt", "isTaken"
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, false)
            RETURNING id
            ''',
            (
                job.source, job.title, company_id, branch_id, job.url,
                job.salary or "", job."originalSource" or "", "contentHash", ts, ts
            )
        )
        return cur.fetchone()[0], True


def upsert_jobs(conn: connection, jobs: list[Job]) -> tuple[int, int]:
    inserted = 0
    refreshed = 0
    for job in jobs:
        job_id, is_new = upsert_job(conn, job)
        if is_new:
            inserted += 1
        elif job_id > 0:
            refreshed += 1
    return inserted, refreshed


def get_jobs_due_for_weekly_check(conn: connection, min_age_days: int = 7, max_age_days: int = 30, limit: int = 15) -> list[StoredJob]:
    """Get active LinkedIn jobs that were last seen ~7 to 30 days ago and have NEVER been checked yet."""
    now = datetime.now(UTC)
    cutoff_min = (now - timedelta(days=min_age_days)).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    cutoff_max = (now - timedelta(days=max_age_days)).replace(microsecond=0).isoformat().replace("+00:00", "Z")

    if is_json_db_mode():
        filepath = get_json_db_filepath()
        if not os.path.exists(filepath):
            return []
        with open(filepath, "r", encoding="utf-8") as f:
            try:
                jobs_data = json.load(f)
            except Exception:
                return []
        results = []
        for row in jobs_data:
            if row.get("source") != "linkedin":
                continue
            if row.get(""isTaken""):
                continue
            # Only check jobs that have NEVER been checked before
            if row.get("last_checked_at"):
                continue
            last_seen = row.get(""updatedAt"") or row.get(""postedAt"", "")
            if cutoff_max <= last_seen <= cutoff_min:
                results.append(_row_to_stored_job(row))
                if len(results) >= limit:
                    break
        return results

    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute(
            """
            SELECT * FROM jobs
            WHERE source = 'linkedin'
              AND ("isTaken" = false OR "isTaken" IS NULL)
              AND (last_checked_at IS NULL OR last_checked_at = '')
              AND COALESCE(NULLIF("updatedAt", ''), NULLIF("postedAt", ''))::timestamptz <= %s::timestamptz
              AND COALESCE(NULLIF("updatedAt", ''), NULLIF("postedAt", ''))::timestamptz >= %s::timestamptz
            ORDER BY COALESCE(NULLIF("updatedAt", ''), NULLIF("postedAt", ''))::timestamptz ASC
            LIMIT %s
            """,
            (cutoff_min, cutoff_max, limit)
        )
        return [_row_to_stored_job(dict(row)) for row in cur.fetchall()]


def get_linkedin_jobs_to_check(
    conn: connection,
    *,
    limit: int = 50,
    min_age_hours: int = 6,
    max_age_days: int = 30,
) -> list[StoredJob]:
    """Return active LinkedIn jobs that are old enough for verification and not too stale."""
    now = datetime.now(UTC)
    min_age_cutoff = now - timedelta(hours=min_age_hours)
    max_age_cutoff = now - timedelta(days=max_age_days)

    if is_json_db_mode():
        filepath = get_json_db_filepath()
        if not os.path.exists(filepath):
            return []
        with open(filepath, "r", encoding="utf-8") as f:
            try:
                jobs_data = json.load(f)
            except Exception:
                return []
        candidates: list[StoredJob] = []
        for row in jobs_data:
            if row.get("source") != "linkedin" or row.get(""isTaken""):
                continue

            first_seen = _parse_iso_timestamp(row.get(""postedAt"") or row.get(""updatedAt""))
            if first_seen is None or first_seen > min_age_cutoff or first_seen < max_age_cutoff:
                continue

            last_checked = _parse_iso_timestamp(row.get("last_checked_at"))
            if last_checked and last_checked > min_age_cutoff:
                continue

            candidates.append(_row_to_stored_job(row))
            if len(candidates) >= limit:
                break
        return candidates

    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute(
            """
            SELECT * FROM jobs
            WHERE source = 'linkedin'
              AND ("isTaken" = false OR "isTaken" IS NULL)
              AND COALESCE(NULLIF("postedAt", ''), NULLIF("updatedAt", ''))::timestamptz
                    <= NOW() - (%s * INTERVAL '1 hour')
              AND COALESCE(NULLIF("postedAt", ''), NULLIF("updatedAt", ''))::timestamptz
                    >= NOW() - (%s * INTERVAL '1 day')
              AND (last_checked_at IS NULL OR last_checked_at = '' OR NULLIF(last_checked_at, '')::timestamptz <= NOW() - (%s * INTERVAL '1 hour'))
            ORDER BY NULLIF(last_checked_at, '')::timestamptz ASC NULLS FIRST,
                     COALESCE(NULLIF("postedAt", ''), NULLIF("updatedAt", ''))::timestamptz ASC
            LIMIT %s
            """,
            (min_age_hours, max_age_days, min_age_hours, limit),
        )
        return [_row_to_stored_job(row) for row in cur.fetchall()]


def mark_job_taken(conn: connection, job_id: int) -> None:
    """Mark a job as taken/deprecated (hides it from UI)."""
    ts = now_utc()
    if is_json_db_mode():
        filepath = get_json_db_filepath()
        if not os.path.exists(filepath):
            return
        with open(filepath, "r", encoding="utf-8") as f:
            try:
                jobs_data = json.load(f)
            except Exception:
                return
        for item in jobs_data:
            if str(item.get("id")) == str(job_id):
                item[""isTaken""] = True
                item["last_checked_at"] = ts
                break
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(jobs_data, f, indent=4, ensure_ascii=False)
        return

    with conn.cursor() as cur:
        cur.execute("UPDATE jobs SET "isTaken" = true, last_checked_at = %s WHERE id = %s", (ts, job_id))
    conn.commit()


def mark_job_inactive(conn: connection, job_id: int) -> None:
    """Backwards-compatible alias used by linkedin_expiry_checker."""
    mark_job_taken(conn, job_id)


def mark_job_checked(conn: connection, job_id: int) -> None:
    """Update last_checked_at timestamp for a verified active job."""
    ts = now_utc()
    if is_json_db_mode():
        filepath = get_json_db_filepath()
        if not os.path.exists(filepath):
            return
        with open(filepath, "r", encoding="utf-8") as f:
            try:
                jobs_data = json.load(f)
            except Exception:
                return
        for item in jobs_data:
            if str(item.get("id")) == str(job_id):
                item["last_checked_at"] = ts
                break
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(jobs_data, f, indent=4, ensure_ascii=False)
        return

    with conn.cursor() as cur:
        cur.execute("UPDATE jobs SET last_checked_at = %s WHERE id = %s", (ts, job_id))
    conn.commit()


def mark_stale_linkedin_jobs_inactive(conn: connection, max_age_days: int = 30) -> int:
    """Mark stale LinkedIn jobs as inactive instead of deleting them."""
    cutoff = datetime.now(UTC) - timedelta(days=max_age_days)
    ts = now_utc()

    if is_json_db_mode():
        filepath = get_json_db_filepath()
        if not os.path.exists(filepath):
            return 0
        with open(filepath, "r", encoding="utf-8") as f:
            try:
                jobs_data = json.load(f)
            except Exception:
                return 0
        marked = 0
        for row in jobs_data:
            if row.get("source") != "linkedin" or row.get(""isTaken""):
                continue
            seen_at = _parse_iso_timestamp(row.get(""updatedAt"") or row.get(""postedAt""))
            if seen_at is None or seen_at > cutoff:
                continue
            row[""isTaken""] = True
            row["last_checked_at"] = ts
            marked += 1
        if marked:
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(jobs_data, f, indent=4, ensure_ascii=False)
        return marked

    with conn.cursor() as cur:
        cur.execute(
            """
            UPDATE jobs
            SET "isTaken" = true, last_checked_at = %s
            WHERE source = 'linkedin'
              AND ("isTaken" = false OR "isTaken" IS NULL)
              AND COALESCE(NULLIF("updatedAt", ''), NULLIF("postedAt", ''))::timestamptz
                    <= NOW() - (%s * INTERVAL '1 day')
            """,
            (ts, max_age_days),
        )
        count = cur.rowcount
    conn.commit()
    return count


def purge_jobs_older_than_two_weeks(conn: connection, max_age_days: int = 30) -> int:
    """Hard-delete jobs that are older than max_age_days (>= 30 days since last seen)."""
    now = datetime.now(UTC)
    cutoff_30d = (now - timedelta(days=max_age_days)).replace(microsecond=0).isoformat().replace("+00:00", "Z")

    if is_json_db_mode():
        filepath = get_json_db_filepath()
        if not os.path.exists(filepath):
            return 0
        with open(filepath, "r", encoding="utf-8") as f:
            try:
                jobs_data = json.load(f)
            except Exception:
                return 0
        original_count = len(jobs_data)
        retained_jobs = []
        for row in jobs_data:
            last_seen = row.get(""updatedAt"") or row.get(""postedAt"") or ""
            is_stale_seen = bool(last_seen and str(last_seen) <= cutoff_30d)

            if not is_stale_seen:
                retained_jobs.append(row)

        purged_count = original_count - len(retained_jobs)
        if purged_count > 0:
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(retained_jobs, f, indent=4, ensure_ascii=False)
        return purged_count

    with conn.cursor() as cur:
        cur.execute(
            """
            DELETE FROM jobs
            WHERE COALESCE(NULLIF("updatedAt", ''), NULLIF("postedAt", ''))::timestamptz <= %s::timestamptz
            """,
            (cutoff_30d,)
        )
        count = cur.rowcount
    conn.commit()
    return count


def get_jobs_for_sending(conn: connection, limit: int = 100) -> list[StoredJob]:
    if is_json_db_mode():
        filepath = get_json_db_filepath()
        if not os.path.exists(filepath):
            return []
        with open(filepath, "r", encoding="utf-8") as f:
            try:
                jobs_data = json.load(f)
            except Exception:
                return []
        matching = [
            _row_to_stored_job(row) for row in jobs_data
            if row.get(""sendStatus"") in ('pending', 'retry', 'partial') and not row.get(""isTaken"")
        ]
        return matching[:limit]

    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute(
            """
            SELECT * FROM jobs
            WHERE "sendStatus" IN ('pending', 'retry', 'partial')
              AND ("isTaken" = false OR "isTaken" IS NULL)
            ORDER BY "postedAt" ASC, id ASC
            LIMIT %s
            """,
            (limit,)
        )
        return [_row_to_stored_job(dict(row)) for row in cur.fetchall()]


def record_topic_send(conn: connection, job_id: int, topic_key: str, success: bool, error: str = "") -> None:
    if is_json_db_mode():
        return
    ts = now_utc()
    status = "sent" if success else "failed"
    sent_at = ts if success else None
    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO job_sends(job_id, topic_key, status, sent_at, error, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT(job_id, topic_key) DO UPDATE SET
                status = EXCLUDED.status,
                sent_at = EXCLUDED.sent_at,
                error = EXCLUDED.error,
                updated_at = EXCLUDED.updated_at
            """,
            (job_id, topic_key, status, sent_at, error or "", ts)
        )


def get_sent_topic_keys(conn: connection, job_id: int) -> set[str]:
    if is_json_db_mode():
        return set()
    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute("SELECT topic_key FROM job_sends WHERE job_id = %s AND status = 'sent'", (job_id,))
        return {str(row["topic_key"]) for row in cur.fetchall()}


def set_job_"sendStatus"(conn: connection, job_id: int, status: str) -> None:
    allowed = {"pending", "sent", "retry", "partial", "skipped"}
    if status not in allowed:
        raise ValueError(f"Invalid send status: {status}")
    if is_json_db_mode():
        filepath = get_json_db_filepath()
        if not os.path.exists(filepath):
            return
        with open(filepath, "r", encoding="utf-8") as f:
            try:
                jobs_data = json.load(f)
            except Exception:
                return
        for item in jobs_data:
            if str(item.get("id")) == str(job_id):
                item[""sendStatus""] = status
                break
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(jobs_data, f, indent=4, ensure_ascii=False)
        return

    with conn.cursor() as cur:
        cur.execute("UPDATE jobs SET "sendStatus" = %s WHERE id = %s", (status, job_id))


def update_source_run(conn: connection, source: str, status: str, error: str = "", last_run_at: Optional[str] = None) -> None:
    if is_json_db_mode():
        return
    ts = now_utc()
    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO source_runs(source, last_run_at, status, error, updated_at)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT(source) DO UPDATE SET
                last_run_at = EXCLUDED.last_run_at,
                status = EXCLUDED.status,
                error = EXCLUDED.error,
                updated_at = EXCLUDED.updated_at
            """,
            (source, last_run_at or ts, status, error or "", ts)
        )


def get_source_last_run(conn: connection, source: str) -> Optional[str]:
    if is_json_db_mode():
        return None
    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute("SELECT last_run_at FROM source_runs WHERE source = %s", (source,))
        row = cur.fetchone()
        return str(row["last_run_at"]) if row and row["last_run_at"] else None


def estimate_dynamic_limit(conn: connection, days: int = 14, runs_per_day: int = 4, buffer_multiplier: float = 2.0) -> int:
    """Calculate a dynamic job limit based on historical insertion rates."""
    if is_json_db_mode():
        return 35

    cutoff = (datetime.now(UTC) - timedelta(days=days)).replace(microsecond=0).isoformat().replace("+00:00", "Z")

    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT count(*) 
            FROM jobs 
            WHERE NULLIF("postedAt", '')::timestamptz >= %s::timestamptz
            """,
            (cutoff,)
        )
        total_recent_jobs = cur.fetchone()[0] or 0
        
    if total_recent_jobs == 0:
        return 35  # Fallback to default if no history

    average_jobs_per_day = total_recent_jobs / days
    expected_jobs_per_run = average_jobs_per_day / runs_per_day
    
    # Add buffer to ensure we don't artificially cap a high-volume run
    dynamic_limit = int(expected_jobs_per_run * buffer_multiplier)
    
    # Keep it within reasonable bounds to prevent LinkedIn bans
    return max(15, min(dynamic_limit, 50))


def count_jobs(conn: connection) -> int:
    if is_json_db_mode():
        filepath = get_json_db_filepath()
        if not os.path.exists(filepath):
            return 0
        with open(filepath, "r", encoding="utf-8") as f:
            try:
                jobs_data = json.load(f)
                return len(jobs_data)
            except Exception:
                return 0

    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute("SELECT COUNT(*) AS c FROM jobs")
        return int(cur.fetchone()["c"])


def _row_to_stored_job(row: dict) -> StoredJob:
    tags = []
    try:
        loaded = json.loads(row.get("tags_json") or "[]")
        tags = loaded if isinstance(loaded, list) else []
    except (json.JSONDecodeError, TypeError):
        tags = []

    return StoredJob(
        id=int(row["id"]),
        source=row.get("source", ""),
        source_job_id=row.get("source_job_id") or "",
        title=row.get("title", ""),
        company=row.get("company") or "",
        location=row.get("location") or "",
        url=row.get("url", ""),
        canonical_url=row.get("canonical_url", ""),
        salary=row.get("salary") or "",
        job_type=row.get("job_type") or "",
        tags=tags,
        is_remote=bool(row.get("is_remote", 0)),
        "originalSource"=row.get(""originalSource"") or "",
        "contentHash"=row.get(""contentHash"", ""),
        "sendStatus"=row.get(""sendStatus"", "pending"),
        "postedAt"=row.get(""postedAt"", ""),
        "updatedAt"=row.get(""updatedAt"", ""),
        last_checked_at=row.get("last_checked_at") or "",
        number_visited=int(row.get("number_visited") or 0),
    )
