"""
PostgreSQL persistence layer for the Telegram jobs bot.
"""

from __future__ import annotations

import hashlib
import json
import re
import os
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import UTC, datetime
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
    original_source: str
    content_hash: str
    send_status: str
    first_seen_at: str
    last_seen_at: str

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
            original_source=self.original_source,
        )


def get_postgres_url() -> str:
    url = os.environ.get("POSTGRES_URL")
    if not url:
        raise ValueError("POSTGRES_URL environment variable is missing!")
    return url


@contextmanager
def connect(db_path: str = "") -> Iterator[connection]:
    """Open a PostgreSQL connection and ensure schema exists."""
    # db_path is ignored for postgres, kept for API compatibility with main.py
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
                original_source TEXT DEFAULT '',
                content_hash TEXT NOT NULL UNIQUE,
                send_status TEXT NOT NULL DEFAULT 'pending',
                first_seen_at TEXT NOT NULL,
                last_seen_at TEXT NOT NULL
            );

            CREATE INDEX IF NOT EXISTS idx_jobs_send_status
                ON jobs(send_status, last_seen_at);

            CREATE INDEX IF NOT EXISTS idx_jobs_source
                ON jobs(source, last_seen_at);

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


def job_content_hash(job: Job) -> str:
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
    content_hash = job_content_hash(job)
    source_job_id = str(getattr(job, "source_job_id", "") or "")
    tags_json = json.dumps(job.tags or [], ensure_ascii=False, sort_keys=True)

    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute("SELECT id FROM jobs WHERE content_hash = %s", (content_hash,))
        existing = cur.fetchone()

        if existing:
            job_id = existing["id"]
            cur.execute(
                """
                UPDATE jobs
                SET source = %s, source_job_id = %s, title = %s, company = %s, location = %s,
                    url = %s, canonical_url = %s, salary = %s, job_type = %s, tags_json = %s,
                    is_remote = %s, original_source = %s, last_seen_at = %s
                WHERE id = %s
                """,
                (
                    job.source, source_job_id, job.title, job.company or "", job.location or "",
                    job.url, canonical_url, job.salary or "", job.job_type or "", tags_json,
                    1 if job.is_remote else 0, job.original_source or "", ts, job_id
                )
            )
            return job_id, False

        cur.execute(
            """
            INSERT INTO jobs (
                source, source_job_id, title, company, location, url, canonical_url,
                salary, job_type, tags_json, is_remote, original_source,
                content_hash, send_status, first_seen_at, last_seen_at
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'pending', %s, %s)
            RETURNING id
            """,
            (
                job.source, source_job_id, job.title, job.company or "", job.location or "",
                job.url, canonical_url, job.salary or "", job.job_type or "", tags_json,
                1 if job.is_remote else 0, job.original_source or "", content_hash, ts, ts
            )
        )
        return cur.fetchone()[0], True


def upsert_jobs(conn: connection, jobs: list[Job]) -> tuple[int, int]:
    inserted = 0
    refreshed = 0
    for job in jobs:
        _, is_new = upsert_job(conn, job)
        if is_new:
            inserted += 1
        else:
            refreshed += 1
    return inserted, refreshed


def get_jobs_for_sending(conn: connection, limit: int = 100) -> list[StoredJob]:
    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute(
            """
            SELECT * FROM jobs
            WHERE send_status IN ('pending', 'retry', 'partial')
            ORDER BY first_seen_at ASC, id ASC
            LIMIT %s
            """,
            (limit,)
        )
        return [_row_to_stored_job(row) for row in cur.fetchall()]


def record_topic_send(conn: connection, job_id: int, topic_key: str, success: bool, error: str = "") -> None:
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
    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute("SELECT topic_key FROM job_sends WHERE job_id = %s AND status = 'sent'", (job_id,))
        return {str(row["topic_key"]) for row in cur.fetchall()}


def set_job_send_status(conn: connection, job_id: int, status: str) -> None:
    allowed = {"pending", "sent", "retry", "partial", "skipped"}
    if status not in allowed:
        raise ValueError(f"Invalid send status: {status}")
    with conn.cursor() as cur:
        cur.execute("UPDATE jobs SET send_status = %s WHERE id = %s", (status, job_id))


def update_source_run(conn: connection, source: str, status: str, error: str = "", last_run_at: Optional[str] = None) -> None:
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
    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute("SELECT last_run_at FROM source_runs WHERE source = %s", (source,))
        row = cur.fetchone()
        return str(row["last_run_at"]) if row and row["last_run_at"] else None


def count_jobs(conn: connection) -> int:
    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute("SELECT COUNT(*) AS c FROM jobs")
        return int(cur.fetchone()["c"])


def _row_to_stored_job(row: dict) -> StoredJob:
    tags = []
    try:
        loaded = json.loads(row["tags_json"] or "[]")
        tags = loaded if isinstance(loaded, list) else []
    except json.JSONDecodeError:
        tags = []

    return StoredJob(
        id=int(row["id"]),
        source=row["source"],
        source_job_id=row["source_job_id"] or "",
        title=row["title"],
        company=row["company"] or "",
        location=row["location"] or "",
        url=row["url"],
        canonical_url=row["canonical_url"],
        salary=row["salary"] or "",
        job_type=row["job_type"] or "",
        tags=tags,
        is_remote=bool(row["is_remote"]),
        original_source=row["original_source"] or "",
        content_hash=row["content_hash"],
        send_status=row["send_status"],
        first_seen_at=row["first_seen_at"],
        last_seen_at=row["last_seen_at"],
    )
