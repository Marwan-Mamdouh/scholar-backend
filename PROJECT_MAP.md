# Scholar Nexus: The Master Project Map & Blueprint

This document is the definitive guide for understanding the Scholar Nexus ecosystem—from the high-level user stories to the low-level technical mechanics.

---

## 1. The Site Stories (Business Domains)

Scholar Nexus connects academic achievement with the professional market through three primary narratives:

### 👨‍🔬 The Academic Researcher (Discovery Story)

- **Goal**: Discover collaborators and track research impact.
- **Narrative**: "I want to analyze a researcher's impact and find similar work in the field."
- **Journey**: `index.html` → `scanner.html` (Deep Analysis) → `explorer.html` (Paper discovery).
- **Under the Hood**: Uses **Semantic Scholar API** for citation data and **Gemini AI** (conceptually) for field mapping.

### 🎓 The Student / Fresh Grad (Career Bridge Story)

- **Goal**: Showcase graduation projects and find entry-level jobs.
- **Narrative**: "I want to document my academic projects and see which local companies are hiring for my track."
- **Journey**: `register.html` → `profile.html` → `grad-form.html` → `jobs.html`.
- **Under the Hood**: Projects are saved to Supabase; Jobs are visualized on an interactive map with multi-country filtering.

### 🏢 The Recruiter / Admin (Market Management Story)

- **Goal**: Manage job listings and import high-quality industry data.
- **Narrative**: "I need to populate the platform with verified job listings and approve community members."
- **Journey**: `login.html` → `admin-search.html` (Serper Scan) → `linkedin-scraper.html` (Direct Import).
- **Under the Hood**: Uses **Serper (Google) API** and a custom **LinkedIn Guest Scraper** for data acquisition.

---

## 2. Technical Blueprint (HTML → JS → API)

| Frontend Page (`/public`) | Logic Source (`/public/js/pages/`) | Backend Endpoint (`/api/`)                 | Primary Data Source |
| :------------------------ | :--------------------------------- | :----------------------------------------- | :------------------ |
| `scanner.html`            | `scanner.js`                       | `/api/search`, `/api/analyze`              | Semantic Scholar    |
| `explorer.html`           | `explorer.js`                      | `/api/explore`                             | Semantic Scholar    |
| `jobs.html`               | (Inline Script)                    | `/api/jobs/query`, `/api/job-filters`      | Supabase            |
| `companies.html`          | (Inline Script)                    | `/api/companies`, `/api/companies/filters` | Supabase            |
| `local-search.html`       | (Inline Script)                    | `/api/local-researchers/filter`            | Supabase            |
| `profiles.html`           | (Inline Script)                    | `/api/directory/profiles`                  | Supabase            |
| `profile.html`            | (Inline Script)                    | `/api/profile` (GET/PUT)                   | Supabase            |
| `grad-dashboard.html`     | (Inline Script)                    | `/api/grad-projects`                       | Supabase            |
| `linkedin-scraper.html`   | (Inline Script)                    | `/api/admin/linkedin-scrape`               | LinkedIn Guest API  |
| `admin-search.html`       | (Inline Script)                    | `/api/admin/external-search`               | Serper (Google) API |

---

## 3. Global Dependencies & Shared Logic

Every page in the project depends on these core shared files:

1.  **`layout.js`**: The UI Orchestrator.
    - Injects the Navigation Header and Footer.
    - Manages **Authentication State** (LocalStorage `nexus_user`).
    - Handles **Dark/Light Theme** persistence.
2.  **`Pagination.js`**: A reusable class for handling paginated data in `scanner`, `explorer`, and `profiles`.
3.  **`search-handler.js`**: Manages the `SearchSyncManager` utility to sync UI filters to the URL query string without page reloads.

---

## 4. Technical Health & Security Audit

### 🔴 Critical Issues (Bugs & Security)

- **The Approval Paradox**: Admins are created as `is_approved: 0`. If no other admin exists, the first admin can never log in.
- **Duplicate Job Routes**: `index.js` has two `POST /api/jobs/add` routes (one public, one private). This creates "orphaned" jobs with no owner.
- **Hardcoded Secrets**: The Serper API key is hardcoded in the source code. **Must be moved to `.env`**.
- **Privacy Fragility**: Arabic name masking in the public directory (e.g., "Abd El...") relies on simple space-splitting which is prone to errors.

### 🗑️ Redundant/Useless Code

- **`parseCSVRow`**: Found in `utils/parsers.ts`. It is a legacy helper replaced by the `xlsx` library and is currently unused.

---

## 5. Architectural Recommendations

1.  **Extract Inline Scripts**: 90% of the frontend logic is currently inline in HTML files. This should be extracted into the `public/js/pages/` directory for maintainability.
2.  **Modularize `index.js`**: The 1800+ line server file should be split into domain modules: `AcademicModule`, `CareerModule`, `CommunityModule`, and `AdminModule`.
3.  **Implement the "Transformer" Pattern**: Move data masking and privacy logic from the routes into dedicated `Transformer` utilities (e.g., `UserTransformer.toPublic()`).
4.  **Add Caching & Rate Limiting**: Implement Redis caching for heavy Semantic Scholar lookups and rate-limiting on public forms (Feedback/Applications) to prevent spam.

---

## 6. Development Workflow

- **Build**: `npm run build` (Compiles TypeScript to `dist/`).
- **Dev**: `npm run dev` (Backend auto-reload with `tsx`).
- **Database**: Managed via Supabase. Always check RLS (Row Level Security) when adding new tables.
