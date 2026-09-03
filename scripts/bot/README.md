# Job Scraper

Python scraper that fetches programming jobs from **WUZZUF** and **LinkedIn**, filters them, and persists to **PostgreSQL**.

The frontend jobs page reads directly from the same Postgres database — no Telegram, no intermediate messaging.

## Pipeline

```text
fetch WUZZUF + LinkedIn
  ↓
filter by keywords + geo rules (Egypt / Saudi / Remote)
  ↓
upsert to Postgres (content-hash dedup)
  ↓
log summary
```

## Sources

| Source   | Status  | What it collects                                            |
| -------- | ------- | ----------------------------------------------------------- |
| WUZZUF   | Enabled | Public job cards from category/search pages (Egypt-focused) |
| LinkedIn | Enabled | Public guest search cards for fresh jobs                    |

Enabled sources are defined in `sources/__init__.py`.

## Setup

### Requirements

```bash
pip install -r requirements.txt
```

### Environment Variables

| Variable       | Required | Purpose                      |
| -------------- | -------- | ---------------------------- |
| `POSTGRES_URL` | Yes      | PostgreSQL connection string |

### Run Locally

```bash
export POSTGRES_URL="postgresql://user:pass@host:5432/dbname"
python main.py
```

## GitHub Actions

Workflow: `.github/workflows/update-jobs.yml`

- Runs every 6 hours via cron (`0 */6 * * *`)
- Can be triggered manually via `workflow_dispatch`
- Uses `POSTGRES_URL` secret for database connection

## Project Structure

```text
├── main.py              # Entry point: fetch → filter → persist → log
├── config.py            # Keywords, geo patterns, emoji map, settings
├── models.py            # Job dataclass + filter predicates
├── db.py                # Postgres persistence (upsert, dedup, source tracking)
├── requirements.txt     # requests, psycopg2-binary
├── sources/
│   ├── __init__.py      # Source registry
│   ├── http_utils.py    # Shared HTTP session
│   ├── wuzzuf.py        # WUZZUF scraper
│   └── linkedin.py      # LinkedIn guest search scraper
└── tests/
    ├── test_db.py
    ├── test_linkedin.py
    ├── test_sources_registry.py
    ├── test_wuzzuf.py
    └── test_readme.py
```

## Database Schema

The scraper creates/manages these tables in Postgres:

- **`jobs`** — deduplicated job listings (content-hash unique constraint)
- **`source_runs`** — fetch health tracking per source
- **`metadata`** — schema version tracking

## Filtering

Jobs pass the filter if they:

1. Have a title and URL
2. Match at least one `INCLUDE_KEYWORDS` entry (for non-LinkedIn sources)
3. Pass geo-filtering: Egypt/Saudi Arabia jobs pass regardless; other locations must be remote

LinkedIn jobs bypass keyword matching (kept if they pass geo-filter) so they can be persisted for the frontend.

## Testing

```bash
python -m unittest discover -s tests -v
```

## LinkedIn Limitations

LinkedIn does not provide a public real-time API for job monitoring. This scraper uses limited public guest search results. If LinkedIn changes its public HTML or blocks requests, the LinkedIn source may return fewer results. WUZZUF remains the stable primary source.
