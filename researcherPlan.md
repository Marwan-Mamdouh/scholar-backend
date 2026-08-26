# Researcher Module Migration Plan (Phase 3) - UPDATED

This plan outlines the refactoring and completion of the Researchers module, transitioning from the monolithic `index.js` to a structured, type-safe, and modular implementation.

---

## 1. Proposed Endpoints & Handlers

All endpoints will be implemented in `src/modules/researchers/researchers.routes.ts` using `asyncHandler` to ensure robust error handling.

| Method | Endpoint | Description | Middlewares |
| :--- | :--- | :--- | :--- |
| `GET` | `/main-topics` | Fetches unique main topics from the `unique_main_topics` view. | None |
| `GET` | `/filter` | Filters researchers by topic, affiliation, name, or keywords. | `paginationMiddleware`, `validateQuery` |
| `POST` | `/upload-researchers` | Processes an Excel file to bulk-import researchers. | `isAdmin`, `multer.single('file')`, `validate` |
| `POST` | `/analyze` | Performs deep analysis using Semantic Scholar. | `validate` |

---

## 2. Data Schemas & Validation (Zod)

Defined in `researchers.schema.ts`:

- **`FilterQuerySchema`**: Validates `main_topic`, `subtopic`, `university`, `researcher`, `keywords`.
- **`UploadOptionsSchema`**: Validates `clear_db` (boolean) and `main_topic` (string).
- **`AnalyzeRequestSchema`**: Validates the researcher `id`.

---

## 3. Service Layer Logic (`researchers.service.ts`)

### Core Methods:
- **`getMainTopics()`**: Query `unique_main_topics` view.
- **`getResearchers(pagination, filters)`**:
    - Uses a SQL-based approach (or optimized Supabase query) to ensure deduplication.
    - Applies filters and server-side pagination.
- **`uploadResearchers(buffer, options)`**:
    - Parses Excel (`Name`, `Affiliation`, `Subtopics`, `Link`).
    - **Smart ID Extraction**: Regex for Semantic Scholar and Google Scholar IDs.
    - Batch insertion to `academic_researchers`.
- **`analyzeResearcher(id)`**:
    - **Resolution**: Resolves S2 ID using stored `scholar_id` or "Smart Name Search" (cleaning titles like "Dr.", "Prof.").
    - **S2 Integration**: Fetches Author Profile (citations, papers, h-index).
    - **Collaborators**: Aggregates top 10 co-authors from paper metadata.
    - *Note: Gemini AI is skipped for this phase as per request.*

---

## 4. SQL Deduplication Strategy

To handle deduplication efficiently and support pagination correctly, we will use a `DISTINCT ON` approach. Below is the SQL function for Supabase:

```sql
CREATE OR REPLACE FUNCTION get_unique_researchers(
  p_main_topic TEXT DEFAULT NULL,
  p_subtopic TEXT DEFAULT NULL,
  p_university TEXT DEFAULT NULL,
  p_researcher TEXT DEFAULT NULL,
  p_keywords TEXT DEFAULT NULL,
  p_limit INT DEFAULT 10,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id INT,
  name TEXT,
  affiliation TEXT,
  main_topic TEXT,
  subtopics TEXT,
  scholar_id TEXT,
  titles TEXT,
  total_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH filtered_researchers AS (
    SELECT 
      r.id, r.name, r.affiliation, r.main_topic, r.subtopics, r.scholar_id, r.titles
    FROM academic_researchers r
    WHERE (p_main_topic IS NULL OR r.main_topic = p_main_topic)
      AND (p_subtopic IS NULL OR r.subtopics ILIKE '%' || p_subtopic || '%')
      AND (p_university IS NULL OR r.affiliation ILIKE '%' || p_university || '%')
      AND (p_researcher IS NULL OR r.name ILIKE '%' || p_researcher || '%')
      AND (p_keywords IS NULL OR r.titles ILIKE '%' || p_keywords || '%')
  ),
  deduplicated AS (
    SELECT DISTINCT ON (COALESCE(scholar_id, name)) 
      *
    FROM filtered_researchers
    ORDER BY COALESCE(scholar_id, name), id
  )
  SELECT 
    d.id, d.name, d.affiliation, d.main_topic, d.subtopics, d.scholar_id, d.titles,
    (SELECT COUNT(*) FROM deduplicated) as total_count
  FROM deduplicated d
  ORDER BY d.id
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;
```

---

## 5. Technical Standards

- **Error Resilience**: `axios` calls to S2 API will handle failures gracefully, returning local data at minimum.
- **Security**: `/upload-researchers` strictly requires `isAdmin` middleware.
- **Clean Code**: Extract name cleaning and ID parsing into pure utility functions in `extractors.ts`.

---
