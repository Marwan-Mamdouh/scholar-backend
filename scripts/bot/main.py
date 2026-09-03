"""
Programming Jobs Scraper — Main entry point.

Runtime flow:
fetch → filter → persist to Postgres → log summary.

The scraper writes jobs to the same Postgres database that the frontend
reads from. No Telegram sending — the only destination is the DB.
"""

from __future__ import annotations

import logging
import time
from dataclasses import dataclass
from typing import Callable, Iterable

try:
    from sources import ALL_FETCHERS
except ModuleNotFoundError:  # local flat-file test layout
    from __init__ import ALL_FETCHERS
from models import Job, is_programming_job, passes_geo_filter
from db import connect, count_jobs, update_source_run, upsert_jobs

# ─── Logging ─────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("main")

Fetcher = tuple[str, Callable[[], list[Job]]]


@dataclass
class RunSummary:
    raw_jobs: int = 0
    filtered_jobs: int = 0
    inserted_jobs: int = 0
    refreshed_jobs: int = 0
    total_jobs_in_db: int = 0


def fetch_all_jobs(conn, fetchers: Iterable[Fetcher]) -> list[Job]:
    """Fetch jobs from configured sources and record source health."""
    all_jobs: list[Job] = []

    for display_name, fetcher in fetchers:
        source_key = display_name.strip().lower()
        try:
            log.info(f"Fetching from {display_name}...")
            jobs = fetcher() or []
            all_jobs.extend(jobs)
            update_source_run(conn, source_key, "ok")
            log.info(f"  {display_name}: {len(jobs)} raw jobs")
        except Exception as exc:  # keep one failed source from killing the run
            update_source_run(conn, source_key, "failed", str(exc))
            log.error(f"  {display_name} failed: {exc}")

    return all_jobs


def should_keep_job(job: Job) -> bool:
    """Runtime quality filter.

    All sources — WUZZUF and LinkedIn alike — must pass both the
    keyword filter (is_programming_job) and geo filter. This keeps
    the database focused on programming roles only.
    """
    if not job.title or not job.url:
        return False

    return is_programming_job(job) and passes_geo_filter(job)


def filter_jobs_for_runtime(jobs: list[Job]) -> list[Job]:
    """Apply the bot's runtime filter rules."""
    return [job for job in jobs if should_keep_job(job)]


def persist_filtered_jobs(conn, jobs: list[Job]) -> tuple[int, int, list[Job]]:
    """Apply runtime filters, persist matching jobs, and return counts."""
    filtered = filter_jobs_for_runtime(jobs)
    inserted, refreshed = upsert_jobs(conn, filtered)
    conn.commit()
    return inserted, refreshed, filtered


def run_bot(
    db_path: str = "",
    fetchers: Iterable[Fetcher] = ALL_FETCHERS,
) -> RunSummary:
    """Run one scrape cycle. Parameters are injectable for tests."""
    start = time.time()
    summary = RunSummary()

    log.info("=" * 60)
    log.info("Job Scraper — Starting run")
    log.info("=" * 60)

    with connect(db_path) as conn:
        all_jobs = fetch_all_jobs(conn, fetchers)
        summary.raw_jobs = len(all_jobs)
        log.info(f"Total raw jobs fetched: {summary.raw_jobs}")

        inserted, refreshed, filtered = persist_filtered_jobs(conn, all_jobs)
        summary.filtered_jobs = len(filtered)
        summary.inserted_jobs = inserted
        summary.refreshed_jobs = refreshed
        log.info(
            f"After filtering: {summary.filtered_jobs} jobs | "
            f"inserted={inserted}, refreshed={refreshed}"
        )

        summary.total_jobs_in_db = count_jobs(conn)

    elapsed = time.time() - start
    log.info(f"Run complete in {elapsed:.1f}s. Total DB jobs: {summary.total_jobs_in_db}")
    log.info("=" * 60)
    return summary


def main() -> None:
    run_bot()


if __name__ == "__main__":
    main()
