# Prisma ORM Migration Plan

This document outlines the plan to replace the direct `supabase-js` database client with **Prisma ORM** in the Scholar Nexus project. Prisma will provide better type safety, more intuitive queries, and a robust schema-first approach to database management.

---

## 1. Supabase Usage Confirmation

The `supabase` client is currently used in the following areas:

### Core Configuration

- **`src/lib/db.ts`**: The central export point for the `supabase` client.
- **`src/index.js`**: Initializes the client and uses it in legacy routes (Jobs, Companies, Grad Projects, etc.).
- **`src/config/env.ts`**: Manages Supabase-related environment variables (`SUPABASE_URL`, `SUPABASE_KEY`).

### Domain Services

- **`src/modules/auth/auth.service.ts`**: Manages `users` and `profiles` tables (Registration, Login, Profile Sync).
- **`src/modules/researchers/researchers.service.ts`**: Handles `academic_researchers` table and uses a Database RPC (`get_unique_researchers`).
- **`src/modules/feedback/feedback.service.ts`**: Handles the `feedback` table.
- **`src/modules/storage/storage.service.ts`**: Handles file storage (CVs and avatars) via `supabase.storage`.

### Monitoring & Testing

- **`src/modules/health/health.routes.ts`**: Checks Supabase configuration and connectivity.
- **`src/modules/researchers/__tests__/researchers.service.test.ts`**: Mocks the `supabase` client for unit testing.

---

## 2. Proposed Prisma Schema (`schema.prisma`)

Based on current table usage, the schema will include the following models:

- **`User`**: Authentication credentials, role, approval status.
- **`Profile`**: Extended user data (biographical, educational, skills as JSON).
- **`Job`**: Job postings, owner relationships, metadata.
- **`Application`**: Links users to jobs with CV paths.
- **`Researcher`**: Academic researcher data for local search.
- **`Company`**: Directory of companies with branch data (JSON).
- **`GradProject`**: Student graduation projects.
- **`HotTopic`**: Trending research topics.
- **`Feedback`**: User-submitted feedback.

---

## 3. Migration Strategy

### Step 1: Initialization

- Install Prisma dependencies: `prisma`, `@prisma/client`.
- Initialize Prisma: `npx prisma init`.
- Configure `DATABASE_URL` in `.env` (pointing to the Supabase Postgres instance).

### Step 2: Schema Definition

- Map existing Supabase tables to Prisma models.
- **Note on JSON columns**: Tables like `profiles` and `companies` heavily use JSONB. Prisma handles these with the `Json` type.
- **Note on Relationships**: Define explicit relations (e.g., `User` 1:1 `Profile`, `User` 1:N `Job`).

### Step 3: Prisma Client Setup

- Create `src/lib/prisma.ts` to export a singleton Prisma instance.
- Update `src/lib/db.ts` to (temporarily) coexist with Prisma or eventually be replaced.

### Step 4: Incremental Refactoring

1.  **Auth Module**: Migrate `users` and `profiles` logic first as they are foundational.
2.  **Feedback Module**: A simple module to verify the setup.
3.  **Researchers Module**: Migrate local search and handle the `get_unique_researchers` RPC (using `prisma.$queryRaw`).
4.  **Legacy Routes**: Refactor the remaining logic in `src/index.js` (Jobs, Companies, etc.) as they are moved into modular services.

---

## 4. Special Considerations

### Supabase Storage

Prisma is an ORM for database records, not file storage. We have two options:

- **Option A (Recommended)**: Keep a minimal `supabase` client in `src/modules/storage/storage.service.ts` purely for interacting with the Storage buckets.
- **Option B**: Move to a standard S3-compatible client if a total decoupling from Supabase is desired.

### Database RPCs

The `get_unique_researchers` RPC is a specialized PostgreSQL function. Prisma can call this via:

```typescript
await prisma.$queryRaw`SELECT * FROM get_unique_researchers(...)`;
```

### Views

The project uses views like `unique_main_topics`. Prisma supports views via the `previewFeatures = ["views"]` flag.

---

## 5. Next Steps

1.  Confirm database connection strings for the Supabase Postgres instance.
2.  Run `npx prisma db pull` to introspect the existing schema (optional but recommended to ensure accuracy).
3.  Generate the Prisma Client and start refactoring.
