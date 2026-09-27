# Scholar Nexus - API Refactoring & Migration Plan

**Generated:** April 21, 2026  
**Status:** Planning Phase (No Implementation Yet)  
**Objective:** Refactor monolithic `index.js` into modular domain-based structure

---

## Overview

This document outlines a strategic plan to refactor the Scholar Nexus backend by grouping endpoints into domain-specific modules. Each module will be extracted into its own route file for better maintainability, testability, and scalability.

### Current Issues

- **Monolithic Structure:** 1800+ lines in single file
- **Duplicate Routes:** `/api/jobs/add` and `/api/admin/import-job` defined multiple times
- **Mixed Technologies:** SQLite syntax mixed with Supabase
- **Scattered Helpers:** Utility functions embedded throughout
- **No Clear Separation:** Business logic mixed with route handlers

---

## Proposed Module Structure

```
src/
├── modules/
│   ├── auth/                    (Already exists)
│   │   ├── auth.routes.ts
│   │   ├── auth.service.ts
│   │   └── auth.schema.ts
│   ├── jobs/                    (NEW)
│   │   ├── jobs.routes.ts
│   │   ├── jobs.service.ts
│   │   └── jobs.schema.ts
│   ├── researchers/             (NEW)
│   │   ├── local-researchers.routes.ts
│   │   ├── academic-scanner.routes.ts
│   │   └── researchers.service.ts
│   ├── companies/               (NEW)
│   │   ├── companies.routes.ts
│   │   ├── companies.service.ts
│   │   └── companies.schema.ts
│   ├── topics/                  (NEW)
│   │   ├── topics.routes.ts
│   │   ├── topics.service.ts
│   │   └── topics.schema.ts
│   ├── hot-topics/              (NEW)
│   │   ├── hot-topics.routes.ts
│   │   └── hot-topics.service.ts
│   ├── graduation-projects/     (NEW)
│   │   ├── grad-projects.routes.ts
│   │   ├── grad-projects.service.ts
│   │   └── grad-projects.schema.ts
│   ├── scraping/                (NEW)
│   │   ├── scraping.routes.ts
│   │   ├── linkedin.scraper.ts
│   │   ├── serper.proxy.ts
│   │   └── scraping.service.ts
│   ├── feedback/                (NEW)
│   │   ├── feedback.routes.ts
│   │   └── feedback.service.ts
│   ├── profiles/                (NEW)
│   │   ├── profiles.routes.ts
│   │   ├── profiles.service.ts
│   │   └── profiles.schema.ts
│   ├── directory/               (NEW)
│   │   ├── directory.routes.ts
│   │   └── directory.service.ts
│   └── health/                  (NEW)
│       └── health.routes.ts
├── utils/
│   ├── parsers.ts               (NEW - moveCSV/data parsers)
│   ├── extractors.ts            (NEW - extract helpers)
│   ├── validators.ts            (Already exists)
│   └── constants.ts             (NEW - shared constants)
├── middleware/
│   ├── auth.ts                  (Already exists)
│   ├── authorize.ts             (Already exists)
│   ├── error.ts                 (Already exists)
│   ├── logger.ts                (Already exists)
│   └── job-owner.ts             (NEW - specific auth middleware)
└── index.js                     (Simplified entry point)
```

---

## Module Breakdown & Refactoring Order

### **PHASE 1: Foundation & Utilities** (No External Dependencies)

#### 1.1 **Health Check Module**

**File:** `src/modules/health/health.routes.ts`

**Current Endpoints:**

- `GET /api/health` - Health check with config status

**Current Implementation Issues:**

- Basic check - no issues

**Migration Tasks:**

- [x] Extract to dedicated module
- [x] No service layer needed
- [x] Keep as-is, just modularize

**Dependencies:** None

---

#### 1.2 **Parser & Extractor Utilities**

**File:** `src/utils/parsers.ts` & `src/utils/extractors.ts`

**Current Functions:**

- `parseCSVRow(str)` - CSV parsing helper
- `cleanName(name)` - Academic name cleaner
- `extractData(row, type)` - Generic data extractor
- `extractTopField(papers)` - Field extraction from papers
- `getFuzzyValue(row, keywords)` - Fuzzy matching

**Migration Tasks:**

- [x] Move `parseCSVRow()` to `src/utils/parsers.ts`
- [x] Move `cleanName()` to `src/utils/extractors.ts`
- [x] Move `extractData()` to `src/utils/extractors.ts`
- [x] Move `extractTopField()` to `src/utils/extractors.ts`
- [x] Move `getFuzzyValue()` to `src/utils/extractors.ts`
- [x] Create unit tests for all parsers
- [x] Document parameter/return types with JSDoc

**Dependencies:** None

---

### **PHASE 2: Core Modules** (Auth Depends On)

#### 2.1 **Feedback Module** (Simplest - Highest Priority)

**File:** `src/modules/feedback/`

**Current Endpoints:**

- `POST /api/feedback` - Submit user feedback

**Current Implementation:**

- Simple single endpoint
- Direct database insert

**Migration Tasks:**

- [x] Create `feedback.routes.ts` with route definition
- [x] Create `feedback.service.ts` with business logic
- [x] Extract database layer
- [x] Validate required fields (name, email, message)
- [ ] Add rate limiting middleware

**Tests Needed:**

- [x] Valid feedback submission
- [x] Missing required fields
- [x] Database error handling

**Dependencies:**

- Supabase client (global)

---

#### 2.2 **Hot Topics Module**

**File:** `src/modules/hot-topics/`

**Current Endpoints:**

- `GET /api/hottopics` - List all hot topics (ordered by priority)
- `POST /api/hottopics/add` - Create new hot topic (admin only)
- `DELETE /api/hottopics/:id` - Delete hot topic (admin only)

**Current Implementation Issues:**

- Admin middleware used (`isAdmin`)
- Basic CRUD operations

**Migration Tasks:**

- [ ] Create `hot-topics.routes.ts`
- [ ] Create `hot-topics.service.ts`
- [ ] Implement proper authorization (admin check)
- [ ] Add input validation for POST
- [ ] Implement soft delete or archive pattern
- [ ] Add pagination support to GET (future enhancement)

**Tests Needed:**

- [ ] Fetch all topics
- [ ] Create new topic (with admin)
- [ ] Prevent creation without admin role
- [ ] Delete topic (with admin)
- [ ] Prevent deletion without admin role

**Dependencies:**

- Supabase client
- isAdmin middleware

---

### **PHASE 3: Data Import & Upload Modules** (Mid Complexity)

#### 3.1 **Local Researchers Module**

**File:** `src/modules/researchers/local-researchers.routes.ts`

**Current Endpoints:**

- `POST /api/admin/upload-researchers` - Upload Excel with researchers
- `GET /api/local-researchers/main-topics` - Get distinct topics
- `GET /api/local-researchers/filter` - Filter researchers by multiple criteria
- `POST /api/local-researchers/analyze` - Analyze single researcher (hybrid: local DB + S2 API)

**Current Implementation Issues:**

- Excel parsing with special ID extraction
- Deduplication logic in endpoint
- Hybrid search (local + Semantic Scholar)
- Complex name cleaning for academic titles

**Migration Tasks:**

- [ ] Create `local-researchers.routes.ts`
- [ ] Create `researchers.service.ts` with:
  - [ ] `uploadResearchersFromExcel(buffer, clearDb)`
  - [ ] `getMainTopics()`
  - [ ] `filterResearchers(filters)`
  - [ ] `analyzeResearcher(id)`
- [ ] Extract scholar ID detection logic to utility
- [ ] Implement deduplication as service method
- [ ] Add transaction support for batch inserts
- [ ] Handle Semantic Scholar API failures gracefully

**Tests Needed:**

- [ ] Upload valid Excel file
- [ ] Extract Semantic Scholar ID from URL
- [ ] Extract Google Scholar ID from URL
- [ ] Deduplication on duplicate uploads
- [ ] Filter by multiple criteria
- [ ] Smart name search fallback when ID unavailable
- [ ] Collaboration extraction from papers

**Dependencies:**

- xlsx library
- axios (for S2 API)
- Supabase client
- cleanName utility
- isAdmin middleware

**⚠️ ISSUE FOUND:**

- No unit tests for Excel parsing logic
- S2 API error handling incomplete

---

#### 3.2 **Companies Module**

**File:** `src/modules/companies/`

**Current Endpoints:**

- `POST /api/admin/upload-companies` - Upload Excel with company data (with Glassdoor & link mining)
- `GET /api/companies` - Search/filter companies
- `GET /api/companies/filters` - Get available filter options
- `GET /api/companies/analytics` - Jobs timeline & hiring patterns

**Current Implementation Issues:**

- Complex Excel parsing with hyperlink mining
- Location parsing with region logic
- Batch insert logic (100 items/batch)
- Logo URL generation hardcoded

**Migration Tasks:**

- [ ] Create `companies.routes.ts`
- [ ] Create `companies.service.ts` with:
  - [ ] `uploadCompaniesFromExcel(buffer, clearDb)`
  - [ ] `searchCompanies(filters)`
  - [ ] `getAvailableFilters()`
  - [ ] `getCompanyAnalytics(name)`
- [ ] Extract hyperlink mining logic to utility
- [ ] Implement location parsing as separate service
- [ ] Optimize batch insert with configurable batch size
- [ ] Move logo URL generation to config
- [ ] Extract branch parsing logic

**Tests Needed:**

- [ ] Upload valid Excel with hidden links
- [ ] Extract LinkedIn URLs from hyperlinks
- [ ] Extract Glassdoor URLs from hyperlinks
- [ ] Parse location with country/state/city
- [ ] Deduplication by company name
- [ ] Batch insert handling
- [ ] Search by multiple criteria (country, category, size)
- [ ] Company analytics timeline calculation

**Dependencies:**

- xlsx library
- Supabase client
- isAdmin middleware

**⚠️ ISSUE FOUND:**

- Multiple Excel sheets with region names - need documentation
- Batch size hardcoded to 100
- Logo URL generation doesn't validate domain

---

#### 3.3 **Graduation Projects Module**

**File:** `src/modules/graduation-projects/`

**Current Endpoints:**

- `POST /api/grad-projects/submit` - Submit new graduation project
- `GET /api/grad-projects` - Get all projects (dashboard)
- `POST /api/admin/upload-grad-projects` - Bulk upload from Excel

**Current Implementation Issues:**

- Domain stored as JSON string, needs parsing on retrieval
- Sponsored field stored as boolean, converted to "Yes"/"No" on retrieval
- Inconsistent field naming (grad_year vs gradYear)
- Bulk upload assumes specific Excel column names

**Migration Tasks:**

- [ ] Create `grad-projects.routes.ts`
- [ ] Create `grad-projects.service.ts` with:
  - [ ] `submitProject(projectData)`
  - [ ] `getAllProjects(filters?)` - with pagination
  - [ ] `bulkUploadFromExcel(buffer)`
- [ ] Create `grad-projects.schema.ts` with Zod validation
- [ ] Implement proper domain field handling (array vs string)
- [ ] Extract CSV column mapping to configuration
- [ ] Add input validation for all fields
- [ ] Implement pagination on dashboard endpoint

**Tests Needed:**

- [ ] Submit valid project
- [ ] Validate required fields
- [ ] Parse domain JSON correctly
- [ ] Handle Excel upload with column mapping
- [ ] Convert "Yes"/"No" to boolean correctly
- [ ] Pagination on GET all projects
- [ ] Timestamp handling on bulk upload

**Dependencies:**

- xlsx library
- Supabase client
- Zod (validation)

**⚠️ ISSUE FOUND:**

- Column names in Excel not documented
- Sponsored field type inconsistency
- No pagination on dashboard (scalability issue)

---

### **PHASE 4: Job Portal System** (Complex - High Priority)

#### 4.1 **Jobs Management Module**

**File:** `src/modules/jobs/`

**Current Endpoints:**

- `GET /api/job-filters` - Get available filters (countries, companies, tracks)
- `POST /api/jobs/query` - Search jobs with multi-select filters
- `POST /api/jobs/add` - Add new job (**DUPLICATE ROUTE - 2 implementations**)
- `DELETE /api/jobs/:id` - Delete job (with authorization)
- `GET /api/jobs/:id/applicants` - Get applicants for job (with authorization)
- `POST /api/apply` - Submit job application with CV

**Current Implementation Issues:**

- **CRITICAL:** `/api/jobs/add` defined twice with different auth:
  1. Line ~917: With `isAuthenticated` middleware
  2. Line ~937: Without authentication (public)
- Authorization checks mixed (sometimes admin, sometimes owner)
- CV upload to Supabase storage with public URL
- Multi-country filtering via array
- CSV parsing helper unused

**Migration Tasks:**

- [ ] **RESOLVE DUPLICATE ROUTE:** Keep authenticated version, remove public version
- [ ] Create `jobs.routes.ts` with all job endpoints
- [ ] Create `jobs.service.ts` with:
  - [ ] `getAvailableFilters()`
  - [ ] `searchJobs(filters)`
  - [ ] `createJob(jobData, userId)`
  - [ ] `deleteJob(jobId, userId, userRole)`
  - [ ] `getJobApplicants(jobId, userId, userRole)`
  - [ ] `submitApplication(application, cvFile)`
- [ ] Create `jobs.schema.ts` with Zod validation
- [ ] Create `jobs.middleware.ts` with owner/editor check
- [ ] Implement proper owner-based authorization
- [ ] Handle CV file uploads to Supabase storage
- [ ] Add pagination to search results
- [ ] Implement sorting options (newest, most relevant, salary)

**Tests Needed:**

- [ ] Get filters (countries, companies, tracks)
- [ ] Search with single filter
- [ ] Search with multiple countries
- [ ] Search with keyword
- [ ] Create job (authenticated user)
- [ ] Prevent job creation (anonymous)
- [ ] Delete job (owner)
- [ ] Prevent deletion (non-owner)
- [ ] Get applicants (job owner)
- [ ] Prevent viewing applicants (non-owner)
- [ ] Submit application with CV
- [ ] CV file upload to Supabase

**Dependencies:**

- Supabase client (storage + database)
- axios (not directly, but used in broader context)
- isAuthenticated middleware
- Custom job owner middleware

**⚠️ CRITICAL ISSUES:**

- **DUPLICATE ROUTE:** Must resolve immediately
- Authorization inconsistency
- No input validation schema
- CV URL generation assumes public bucket

---

### **PHASE 5: Research & Academic APIs** (API Dependent - Medium Complexity)

#### 5.1 **Academic Scanner Module** (Semantic Scholar Integration)

**File:** `src/modules/researchers/academic-scanner.routes.ts`

**Current Endpoints:**

- `GET /api/search` - Search researchers on Semantic Scholar
- `POST /api/analyze` - Deep analysis of single researcher

**Current Implementation Issues:**

- Direct S2 API calls in handler
- No error handling for S2 API failures
- Field extraction logic could be optimized
- Collaboration deduplication logic repeated in multiple places

**Migration Tasks:**

- [ ] Create `academic-scanner.routes.ts`
- [ ] Create `academic-scanner.service.ts` with:
  - [ ] `searchResearchers(query, pagination)`
  - [ ] `analyzeResearcherById(authorId)`
  - [ ] `extractCollaborators(papers, authorId)`
- [ ] Extract S2 API calls to dedicated service
- [ ] Implement proper error handling with retry logic
- [ ] Add API rate limiting
- [ ] Cache popular searches (Redis or in-memory)
- [ ] Validate authorId format

**Tests Needed:**

- [ ] Search valid researcher name
- [ ] Handle empty search results
- [ ] Parse author fields correctly
- [ ] Extract collaborators from papers
- [ ] Handle S2 API rate limiting
- [ ] Analyze researcher with valid ID
- [ ] Handle researcher not found

**Dependencies:**

- axios
- Semantic Scholar API key
- extractTopField utility
- S2 error handling

**⚠️ ISSUE FOUND:**

- No retry logic for API failures
- No rate limiting on searches
- Collaboration extraction duplicated in multiple endpoints

---

#### 5.2 **Topic Explorer Module** (Paper Recommendations)

**File:** `src/modules/topics/topics.routes.ts`

**Current Endpoints:**

- `GET /api/explore` - Paper search/recommendations via Semantic Scholar

**Current Implementation Issues:**

- Mode switching logic in handler
- CorpusId vs paperId handling
- Year filtering logic could be clearer

**Migration Tasks:**

- [ ] Create `topics.routes.ts`
- [ ] Create `topics.service.ts` with:
  - [ ] `recommendPapers(paperId, pagination)`
  - [ ] `searchPapers(query, filters)`
  - [ ] `handlePaperId(paperId)` - normalize ID format
- [ ] Extract mode-based logic to separate methods
- [ ] Improve error messages
- [ ] Add input validation
- [ ] Implement caching strategy

**Tests Needed:**

- [ ] Recommend papers for valid paperId
- [ ] Search papers by query
- [ ] Filter by year
- [ ] Handle invalid paperId
- [ ] Handle S2 API errors

**Dependencies:**

- axios
- Semantic Scholar API key

**⚠️ ISSUE FOUND:**

- Mode switching via query param is fragile
- No input validation on paperId

---

### **PHASE 6: Scraping & Data Collection** (Complex - External APIs)

#### 6.1 **Job Scraping Module**

**File:** `src/modules/scraping/`

**Current Endpoints:**

- `POST /api/admin/external-search` - Serper API proxy (Google search for LinkedIn jobs)
- `POST /api/admin/linkedin-scrape` - Direct LinkedIn scraper (guest API)
- `POST /api/admin/import-jobs-bulk` - Bulk import jobs from scraper results
- `GET /api/admin/all-companies` - Autocomplete for company names

**Current Implementation Issues:**

- **DUPLICATE:** `/api/admin/import-job` defined multiple times
- Serper API key hardcoded in endpoint
- LinkedIn scraper uses cheerio but could fail if HTML structure changes
- Company filtering logic mixed with scraping
- No deduplication check before import

**Migration Tasks:**

- [ ] Create `scraping.routes.ts`
- [ ] Create `scraping.service.ts` with:
  - [ ] `searchJobsViaSerper(query, location)`
  - [ ] `scrapeLinkdedInJobs(query, location)`
  - [ ] `importJobsBulk(jobs, userId)`
  - [ ] `getCompanyAutocomplete()`
- [ ] Create `serper.proxy.ts` for Serper API integration
- [ ] Create `linkedin.scraper.ts` for LinkedIn scraping
- [ ] Extract API keys to environment variables
- [ ] Implement result deduplication
- [ ] Add error handling for scraping failures
- [ ] Implement retry logic with exponential backoff
- [ ] Add logging for debugging

**Tests Needed:**

- [ ] Search jobs via Serper
- [ ] Parse Serper results
- [ ] Scrape LinkedIn jobs
- [ ] Parse LinkedIn HTML
- [ ] Filter jobs by company match
- [ ] Bulk import non-duplicate jobs
- [ ] Prevent duplicate job imports
- [ ] Company autocomplete

**Dependencies:**

- axios
- cheerio
- Serper API key
- Supabase client
- isAdmin middleware

**⚠️ CRITICAL ISSUES:**

- **DUPLICATE ROUTES:** Multiple `/api/admin/import-job` definitions
- **HARDCODED API KEY:** Serper API key in endpoint
- LinkedIn scraper fragile to HTML changes
- No deduplication before import

---

### **PHASE 7: User Management & Profiles** (Authorization Required)

#### 7.1 **Directory & Profiles Module**

**File:** `src/modules/profiles/` & `src/modules/directory/`

**Current Endpoints (Profiles):**

- `GET /api/profile` - Get authenticated user's full profile
- `PUT /api/profile` - Update user profile
- `POST /api/profile/avatar` - Upload avatar image

**Current Endpoints (Directory):**

- `GET /api/directory/profiles` - Public profile directory with privacy masking
- `GET /api/directory/stats` - Directory statistics

**Current Implementation Issues:**

- Name masking logic in directory endpoint (Arabic name handling)
- Profile data sync between users and profiles tables
- Avatar upload to Supabase storage
- Privacy concerns - email masking done in endpoint
- No pagination on directory

**Migration Tasks:**

**Profiles Module:**

- [ ] Create `profiles.routes.ts`
- [ ] Create `profiles.service.ts` with:
  - [ ] `getUserProfile(userId)`
  - [ ] `updateUserProfile(userId, profileData)`
  - [ ] `uploadAvatar(userId, file)`
- [ ] Create `profiles.schema.ts` with validation
- [ ] Extract user sync logic (users ↔ profiles table)
- [ ] Implement avatar URL generation
- [ ] Handle skills array properly (JSONB)
- [ ] Add experience/project fields properly

**Directory Module:**

- [ ] Create `directory.routes.ts`
- [ ] Create `directory.service.ts` with:
  - [ ] `getPublicProfiles(filters, pagination)`
  - [ ] `getDirectoryStats()`
- [ ] Extract privacy masking logic to utility function
- [ ] Implement compound Arabic name handling
- [ ] Add pagination to profile listing
- [ ] Optimize stats queries (group by university, role, skill)

**Tests Needed:**

**Profiles:**

- [ ] Get user profile (authenticated)
- [ ] Update profile fields
- [ ] Sync profile data to users table
- [ ] Upload avatar
- [ ] Parse skills array from string
- [ ] Handle graduation_project JSON field

**Directory:**

- [ ] List public profiles
- [ ] Filter by role
- [ ] Filter by university
- [ ] Filter by skill
- [ ] Mask sensitive data (email, phone)
- [ ] Handle Arabic name masking
- [ ] Get directory stats
- [ ] Stats show correct breakdown

**Dependencies:**

- Supabase client
- isAuthenticated middleware

**⚠️ ISSUE FOUND:**

- Privacy masking logic needs to be consistent
- No pagination on directory endpoint
- Arabic name handling is fragile

---

#### 7.2 **User Management Module**

**File:** `src/modules/admin/user-management.routes.ts`

**Current Endpoints:**

- `GET /api/admin/pending-users` - List unapproved users
- `POST /api/admin/approve-user` - Approve user registration

**Current Implementation Issues:**

- No middleware check (should be admin-only)
- Simple CRUD, good for this phase

**Migration Tasks:**

- [ ] Create `user-management.routes.ts`
- [ ] Add isAdmin middleware to both endpoints
- [ ] Create `user-management.service.ts`
- [ ] Add email notification on approval (future)
- [ ] Add rejection functionality

**Tests Needed:**

- [ ] Get pending users (admin only)
- [ ] Prevent access without admin role
- [ ] Approve user
- [ ] User status updates

**Dependencies:**

- Supabase client
- isAdmin middleware

---

### **PHASE 8: Frontend Routes** (Static Files - Lowest Priority)

#### 8.1 **Frontend Routes Module**

**File:** `src/routes/frontend.routes.ts`

**Current Endpoints:**

- `GET /` - index.html
- `GET /scanner` - scanner.html
- `GET /explorer` - explorer.html
- `GET /hottopics` - hottopics.html
- `GET /jobs` - jobs.html
- `GET /about` - about.html
- `GET /api-docs` - api-docs.html
- `GET /privacy` - privacy.html
- `GET /contact` - contact.html
- `GET /login` - login.html
- `GET /local-search` - local-search.html
- `GET /team` - team.html
- `GET /grad-form` - grad-form.html
- `GET /grad-dashboard` - grad-dashboard.html
- `GET /linkedin-scraper` - linkedin-scraper.html
- `GET /profiles` - profiles.html
- `GET /profile` - profile.html
- `GET /digital-ic-tools` - ic-tools.html
- `GET /analog-ic-tools` - open-source-analog-tools.html
- `GET /general-ic-tools` - open-source-general-tools.html
- `GET /Docker` - Docker.html
- `GET /tools` - tools.html

**Migration Tasks:**

- [ ] Move all frontend routes to dedicated module
- [ ] Use route prefix approach
- [ ] Keep static file serving as-is
- [ ] Consider combining with express.static middleware

**Dependencies:** None

---

## Implementation Timeline

### **Sprint 1 (Week 1-2):** Foundation

- [x] Utilities (parsers, extractors)
- [ ] Middleware improvements (job owner check)
- [x] Health module

### **Sprint 2 (Week 3-4):** Simple Modules

- [x] Feedback module
- [ ] Hot topics module
- [ ] Directory stats module

### **Sprint 3 (Week 5-6):** Data Import

- [ ] Local researchers module
- [ ] Companies module
- [ ] Graduation projects module

### **Sprint 4 (Week 7-9):** Core System

- [ ] **CRITICAL:** Jobs module (resolve duplicate routes)
- [ ] Comprehensive job testing
- [ ] Authorization middleware

### **Sprint 5 (Week 10-11):** Research APIs

- [ ] Academic scanner module
- [ ] Topic explorer module
- [ ] Caching strategy

### **Sprint 6 (Week 12-13):** Scraping System

- [ ] **CRITICAL:** Scraping module (resolve duplicate imports)
- [ ] Serper integration
- [ ] LinkedIn scraper improvements

### **Sprint 7 (Week 14-15):** User Management

- [ ] Profiles module
- [ ] Directory module
- [ ] User management module

### **Sprint 8 (Week 16):** Frontend & Polish

- [ ] Frontend routes module
- [ ] Integration testing
- [ ] Performance optimization

---

## Critical Issues to Resolve Before Implementation

### 🔴 **HIGH PRIORITY**

1. **Duplicate Routes:**
   - `/api/jobs/add` - two different implementations (lines ~917 & ~937)
   - `/api/admin/import-job` - appears in multiple sections
   - **ACTION:** Consolidate into single implementation with clear authorization

2. **Hardcoded API Keys:**
   - Serper API key in endpoint (line ~1419)
   - **ACTION:** Move to environment variables

3. **Authorization Inconsistency:**
   - `isAdmin` middleware used for both authorization checks
   - Job owner check mixed with admin check
   - **ACTION:** Create separate middleware (`isAdmin`, `isJobOwner`, `isAuthenticated`)

### 🟠 **MEDIUM PRIORITY**

4. **Mixed Technology Stack:**
   - SQLite syntax (`db.run()`) in import-job route
   - Supabase syntax elsewhere
   - **ACTION:** Ensure all use Supabase

5. **Missing Input Validation:**
   - No schema validation (should use Zod)
   - No type checking on complex objects
   - **ACTION:** Add schemas to all modules

6. **Scalability Issues:**
   - Pagination missing on dashboard endpoints
   - No result limiting on searches
   - **ACTION:** Implement pagination/limiting everywhere

7. **Fragile Parsing Logic:**
   - LinkedIn scraper depends on HTML structure (changes break it)
   - Excel column mapping hardcoded
   - **ACTION:** Make parsers configurable, add tests

### 🟡 **LOW PRIORITY**

8. **Error Handling:**
   - Some endpoints don't handle API failures gracefully
   - **ACTION:** Add try-catch with proper error messages

9. **Unused Code:**
   - `parseCSVRow()` helper not used anywhere
   - **ACTION:** Delete or document usage

10. **Documentation:**
    - No JSDoc comments on functions
    - Excel column requirements not documented
    - **ACTION:** Add comprehensive documentation

---

## Testing Strategy

Each module should have:

- ✅ Unit tests for service layer
- ✅ Integration tests for routes
- ✅ Error scenario tests
- ✅ Authorization tests

**Test Files Location:**

```
tests/
├── unit/
│   ├── parsers.test.ts
│   ├── extractors.test.ts
│   ├── jobs.service.test.ts
│   └── ...
├── integration/
│   ├── jobs.routes.test.ts
│   ├── researchers.routes.test.ts
│   └── ...
└── e2e/
    └── full-workflow.test.ts
```

---

## Database Considerations

### Tables Used:

1. `jobs` - Job postings
2. `applications` - Job applications
3. `academic_researchers` - Local researcher database
4. `hot_topics` - Trending research topics
5. `companies` - Company directory
6. `graduation_projects` - Student projects
7. `users` - User accounts
8. `profiles` - Extended user profiles
9. `feedback` - User feedback

### Storage Buckets (Supabase):

1. `cv-uploads` - Job application CVs
2. `avatars` - User profile pictures

### Migrations Needed:

- [ ] Verify all table structures match usage
- [ ] Add missing indexes for search performance
- [ ] Add RLS policies for security
- [ ] Create migration for any schema changes

---

## Configuration & Environment

**New Environment Variables Needed:**

```env
# APIs
S2_API_KEY=xxx              # Semantic Scholar
SERPER_API_KEY=xxx         # Job scraping
GEMINI_API_KEY=xxx         # (Currently unused)

# Database
SUPABASE_URL=xxx
SUPABASE_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Server
PORT=3000
NODE_ENV=development

# Optional
REDIS_URL=xxx              # For caching (future)
LOG_LEVEL=debug            # For logging control
```

---

## Success Metrics

- ✅ All endpoints grouped by domain
- ✅ No duplicate routes
- ✅ >80% test coverage
- ✅ All modules independently testable
- ✅ Clear error handling
- ✅ Documentation complete
- ✅ No hardcoded secrets
- ✅ Performance baseline established

---

## Notes for Implementation

1. **Keep index.js Simple:** After modularization, it should be <100 lines, mostly imports and middleware setup
2. **Error Handling:** Create custom error classes for different scenarios
3. **Logging:** Use structured logging (Winston/Pino) instead of console.log
4. **API Documentation:** Keep swagger/OpenAPI docs in sync with routes
5. **Database Transactions:** Consider transaction support for batch operations
6. **Rate Limiting:** Implement per-endpoint rate limiting especially for public APIs
7. **Caching:** Consider Redis for expensive operations (S2 searches, scraping)

---

## Post-Migration Tasks

- [ ] Update API documentation
- [ ] Update deployment scripts
- [ ] Performance profiling & optimization
- [ ] Security audit
- [ ] Load testing
- [ ] Frontend integration testing
- [ ] Monitoring setup
