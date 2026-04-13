# Route Refactoring Plan

The goal of this refactoring is to extract the large `index.js` file into modular controllers based on the domains already scaffolded in the `src/modules` folder.

Below is the mapping of each endpoint to its proposed target controller. Let me know if you want to shift any functionalities around before assigning them to your team.

> [!NOTE]
> - Some Admin-specific routes (like `upload-researchers`) are placed within their respective domains (e.g., `locale.researchers`). We can create a dedicated `AdminController` if you prefer to decouple all admin logic from public resources.
> - There is no `auth` module folder yet, so I suggested creating an `auth` controller for login/registration logic.
> - Ensure all files are converted into ES Modules (e.g., using `export default Controller`) in line with `"type": "module"`.

---

### 1. `auth` Controller (Needs Folder)
Authentication and user management.
- [ ] `POST /api/auth/register` - Create new user & profile
- [ ] `POST /api/auth/login` - Authenticate user
- [ ] `GET /api/auth/logout` - Clear auth cookies

### 2. `profile` Controller
Handles user profile features and the public profile directory.
- [ ] `GET /api/profile` - Fetch current user's profile
- [ ] `PUT /api/profile` - Update user's profile data
- [ ] `POST /api/profile/avatar` - Upload an avatar image
- [ ] `GET /api/directory/profiles` - Get all public profiles with filtering
- [ ] `GET /api/directory/stats` - Get directory statistics

### 3. `locale.researchers` Controller
Local Academic Researchers Database logic.
- [ ] `GET /api/local-researchers/main-topics` - Fetch available topics
- [ ] `GET /api/local-researchers/filter` - Filter functionality
- [ ] `POST /api/local-researchers/analyze` - Deep analyze researcher
- [ ] `POST /api/admin/upload-researchers` - Admin: Bulk upload researchers from excel

### 4. `semantic.scholar` Controller
External API proxy and algorithms dealing with the Semantic Scholar integration.
- [ ] `GET /api/search` - Proxy for Sematic Scholar Search
- [ ] `POST /api/analyze` - Fetch semantic scholar profile data
- [ ] `GET /api/explore` - Explore research topics/recommendations
- [ ] `POST /api/admin/external-search` - Admin: Fetch external data

### 5. `jop` Controller (Consider renaming folder to `job`)
The Job Portal API including the job dashboard, logic, and application.
- [ ] `GET /api/job-filters` - Job location/company filters
- [ ] `POST /api/jobs/query` - Fetch jobs with multi-selection
- [ ] `POST /api/apply` - Submit CV and application
- [ ] `POST /api/jobs/add` - User/Admin posts a job
- [ ] `GET /api/jobs/:id/applicants` - Admin: Fetch applicants for a job
- [ ] `DELETE /api/jobs/:id` - Delete a job listing
- [ ] `POST /api/admin/import-job` - Admin: Import individual job
- [ ] `POST /api/admin/import-jobs-bulk` - Admin: Bulk import jobs from JSON/scraper

### 6. `hot.topics` Controller
Endpoints concerning Hot Topics radar.
- [ ] `GET /api/hottopics` - Fetch hot topics sorted by priority
- [ ] `POST /api/hottopics/add` - Admin: Create new topic
- [ ] `DELETE /api/hottopics/:id` - Admin: Delete topic

### 7. `companies` Controller
Business profiles and company information indexing.
- [ ] `GET /api/companies` - View companies
- [ ] `GET /api/companies/filters` - Fetch distinct company filters
- [ ] `GET /api/companies/analytics` - View companies data analytics
- [ ] `GET /api/admin/all-companies` - Auto-complete options
- [ ] `POST /api/admin/upload-companies` - Admin: Upload companies via excel file

### 8. `grade.project` Controller
Graduation project tracking and dashboarding.
- [ ] `GET /api/grad-projects` - Fetch dashboard projects
- [ ] `POST /api/grad-projects/submit` - Form submission of a new grad project
- [ ] `POST /api/admin/upload-grad-projects` - Admin: Bulk upload graduation projects

### 9. `admin` Controller
General Admin features that don't fit securely within a specific domain.
- [ ] `GET /api/admin/pending-users` - Fetch users pending approval
- [ ] `POST /api/admin/approve-user` - Approve a user account
- [ ] `POST /api/admin/linkedin-scrape` - Specialized LinkedIn scraping feature

### 10. `misc / core` Controller (General utility)
- [ ] `GET /api/health` - Database / Service health diagnostic
- [ ] `POST /api/feedback` - Simple feedback submission

### 11. views / frontend routing (General Router)
*Note: In an API-first approach, it's a good practice to put all UI-serving endpoints in a single `views.js` router or `frontend` controller to decouple them from the main REST business logic.*
- [ ] Serve Core Pages (`/`, `/about`, `/scanner`, `/explorer`, `/hottopics`, `/jobs`, `/local-search`, `/contact`, `/privacy`, `/api-docs`, `/login`)
- [ ] Serve App Pages (`/profiles`, `/profile`, `/grad-form`, `/grad-dashboard`, `/team`)
- [ ] Serve Scraper/Tools (`/linkedin-scraper`, `/digital-ic-tools`, `/analog-ic-tools`, `/general-ic-tools`, `/Docker`, `/tools`)
