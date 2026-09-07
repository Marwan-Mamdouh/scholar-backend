# AGENTS.md

## Project Overview

Scholar is a Node.js + Express backend for academic discovery, researcher analysis, jobs, companies, community profiles, and graduation project listings. Uses TypeScript, Prisma (PostgreSQL), and Supabase for storage. ESM (`"type": "module"`).

## Development Commands

```bash
# Development
npm run dev              # tsx watch src/index.js

# Build & Production
npm run build            # tsc
npm start                # node dist/src/index.js

# Database
npm run db:generate      # prisma generate (also runs via postinstall after npm ci)
npm run db:push          # prisma db push
npm run db:migrate       # prisma migrate dev
npm run db:deploy        # prisma migrate deploy
npm run db:reset         # prisma migrate reset
npm run db:seed          # tsx prisma/seed.ts
npm run db:studio        # prisma studio

# Testing
npm test                 # vitest
npm run test:coverage    # vitest --coverage

# Vercel
npm run vercel:dev       # npm run build && vercel dev
npm run vercel:deploy    # npm run build && vercel deploy
npm run vercel:prod-on   # npm run build && vercel deploy --prod
```

## Architecture

- **Entry point:** `src/index.js` (Express server, route registration, middleware)
- **Modules:** `src/modules/{feedback,health,publication,researchers,storage,team}/`
- **Middleware:** `src/middlewares/` (auth, validator, error handler, pagination, uploads, logger)
- **Database:** Prisma schema in `src/db/prisma/`, generated client in `src/db/generated/`
- **Auth:** better-auth integration at `src/lib/authentication/auth.ts`, JWT cookie-based
- **Supabase:** Used for file storage (avatars, CVs) via `src/lib/db.ts`
- **Config:** `src/config/env.ts` validates env vars with Zod

## Key Conventions

- **Validation:** Use Zod schemas + `validate()` middleware from `src/middlewares/validator.ts`
- **Typed requests:** `TypedRequest<T>` from `src/types/Request.ts` provides `req.validatedData`
- **Error handling:** Extend `BaseError` from `src/lib/error/BaseError.ts` for custom errors
- **Async routes:** Wrap with `asyncHandler` from `src/lib/async.handler.ts`

## Environment Variables

Required (validated in `src/config/env.ts`):

- `SUPABASE_URL`, `SUPABASE_KEY` - Supabase connection
- `JWT_SECRET` - Auth tokens
- `DATABASE_URL` - PostgreSQL for Prisma

Optional:

- `S2_API_KEY` - Semantic Scholar API
- `SERPER_API_KEY` - Google search proxy
- `SMTP_*` - Email configuration

## Testing

- Framework: Vitest
- Test files: `*.test.ts` co-located with source
- Run single test: `npm test -- -t "test name"`
- CI: GitHub Actions on Node 22.x and 24.x, runs `npm ci && npm run build && npm test`

## Known Quirks

- Legacy `index.js` has many commented-out routes (Supabase-based)
- TypeScript config: `strict: false`, `allowJs: true`, `checkJs: false`
- Prisma schema path: `./src/db/prisma`
- Vercel deployment: exports `app` default, no listener when `VERCEL` env set
- `postinstall` script runs `prisma generate` automatically after `npm ci`
