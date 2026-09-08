# CV Parser (CLI)

Script-based application: pass a PDF/DOCX CV, get validated structured JSON.
No server, no frontend, no persistence — everything runs in one command.

```
CV (PDF/DOCX) → file validation → text extraction → cleaning
              → AI structured parsing → Pydantic validation → JSON output
```

## Setup

```powershell
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
copy .env.example .env          # then fill in AI_API_KEY etc.
```

Configuration (`.env`):

| Variable | Default | Purpose |
|---|---|---|
| `AI_API_KEY` | — | Google Gemini API key |
| `AI_MODEL` | `gemini-3.6-flash` | Gemini model name |
| `MAX_CV_SIZE_MB` | `10` | File size limit |
| `MAX_CV_TEXT_CHARS` | `80000` | Hard cap before AI call (no silent truncation) |
| `AI_TIMEOUT_SECONDS` | `60` | Per-request timeout |
| `AI_MAX_RETRIES` | `2` | Limited AI retries |

## Usage

```powershell
# Parse a CV and print JSON
.venv\Scripts\python parse_cv.py candidate_cv.pdf

# Write the result to a file
.venv\Scripts\python parse_cv.py candidate_cv.docx -o profile.json

# See extracted text only (no AI call, no key needed)
.venv\Scripts\python parse_cv.py candidate_cv.pdf --extract-text

# Create a small sample CV to test with
.venv\Scripts\python parse_cv.py --make-sample sample.pdf
```

Success output:

```json
{ "success": true, "data": { "personal_information": {...}, "education": [...], ... } }
```

Failures print `{"success": false, "error": {"code", "message"}}` and exit with
code 1 — no stack traces:

| Code | Meaning |
|---|---|
| `FILE_NOT_FOUND` | Path does not exist |
| `UNSUPPORTED_FILE_TYPE` | Not a PDF/DOCX |
| `EMPTY_FILE` / `FILE_TOO_LARGE` / `CORRUPTED_FILE` | File validation |
| `DOCUMENT_EXTRACTION_FAILED` | Unreadable/scanned document |
| `CV_TEXT_TOO_LONG` | Extracted text exceeds `MAX_CV_TEXT_CHARS` |
| `CV_PARSING_FAILED` | AI request failed after retries |
| `OUTPUT_VALIDATION_FAILED` | AI output failed schema validation after one repair attempt |
| `AI_NOT_CONFIGURED` | No `AI_API_KEY` in `.env` |

## Design

```
parse_cv.py              CLI entry point (argparse)
app/services/
  validation.py          extension + magic-byte sniff + size/empty checks
  document_extractor.py  pypdf (per page) + python-docx (incl. tables), in-memory
  text_cleaner.py        whitespace/blank-line cleanup, repeated header/footer removal
  cv_service.py          orchestration + deterministic normalization
app/ai/
  prompts.py             anti-hallucination, injection-hardened system prompt
  schema.py              JSON Schema derived from the Pydantic models
  client.py              CVParser interface + Gemini implementation
                         (structured output, limited retries, one repair attempt)
app/schemas/             Pydantic v2 CV profile models (spec sections 7–20)
utils/dates.py           precision-preserving date normalization
tests/                   unit + integration (AI mocked, no key needed)
```

Key properties:

- **Anti-hallucination**: the system prompt forbids fabrication; missing values
  come back `null` / `[]`. A deterministic post-parse pass dedupes skills
  (`python3` → `Python`) and assigns `edu_001`-style ids.
- **Prompt-injection safe**: CV text is wrapped as untrusted data; the model is
  instructed to never follow commands found inside it.
- **Structured output**: the JSON schema is sent via Gemini's
  `response_schema` (with a plain-JSON fallback), then validated with Pydantic.
- **Privacy**: no temp files, no CV text in logs, nothing stored.
- **Dates**: normalized to `YYYY` / `YYYY-MM` / `YYYY-MM-DD` only at the
  precision actually present ("Summer 2025" is preserved verbatim).

## Tests

```powershell
.venv\Scripts\python -m pytest
```
