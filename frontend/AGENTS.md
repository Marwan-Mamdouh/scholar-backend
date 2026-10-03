<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Scholar Frontend — Agent Guide

## Stack & toolchain (verify in `package.json`)
- Next.js 16 (App Router), React 19, TypeScript (strict). Package manager: **npm**, Node 20+.
- **Tailwind CSS 4, CSS-first config.** There is NO `tailwind.config.js`; theme tokens are defined in `src/app/globals.css` via `@theme`. Do not create a tailwind config file.
- **React Compiler is enabled** (`reactCompiler: true` in `next.config.ts`) — components are auto-memoized; avoid manual `useMemo`/`React.memo` unless profiling demands it.

## Commands
- `npm run dev` — dev server at http://localhost:3000
- `npm run build` — production build (also type-checks via Next)
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`)
- **No test suite, no `typecheck` script, and no CI workflows exist.** For a standalone type check use `npx tsc --noEmit`.

## Backend dependency (corrects stale README)
- Data features call a **separate backend** through `NEXT_PUBLIC_API_URL` (default `http://localhost:4000/api`) — see `src/lib/api-client.ts`. Set this in `.env` for live data.
- The README's `.env` example lists different/stale variable names (e.g. `NEXT_PUBLIC_APP_URL`, `DEV_DB`, `SUPABASE_*`); the only var the code actually reads is `NEXT_PUBLIC_API_URL`. Trust the code, not that example.
- `Prisma`, `Supabase`, and `Better Auth` are **not** dependencies of this repo — ignore README/architecture claims about them for the frontend.

## Code layout conventions (observed in `src/`)
- **Feature-Sliced Design.** Domain code lives in `src/features/<domain>/` and is imported through that folder's `index.ts` barrel (e.g. `import { X } from "@/src/features/home"`). Keep `src/app/` pages thin: compose feature components, no business/data logic.
- **Import alias quirk:** `tsconfig` maps `@/*` to repo root, and the codebase imports via the `@/src/...` prefix (e.g. `@/src/features/...`, `@/src/components/...`). Match this in new code — not bare `@/features`.
- `src/components/ui/` holds shared dumb UI primitives (Button, Card, Badge, Input, Accordion…). Domain-specific components go under `src/features/<domain>/components/`. (Exception: `src/components/auth/AuthShell.tsx` exists — match existing placement when editing auth layout.)
- `src/lib/api-client.ts` is the single `fetch`-based wrapper (`apiGet`/`apiPost`). Feature API code lives in `src/features/<domain>/.../*.api.ts` and uses it.

## Branch / PR conventions (from README)
- Branches: `feature/*`, `fix/*`, `docs/*`.
- Atomic conventional commits; PRs should contain multiple focused commits, not one squashed commit.
- PRs require a Figma comparison table for UI changes (see `.github/pull_request_template.md`).
- Type-of-change labels in PRs: `feat`, `fix`, `refactor`, `chore`, `qa`.

## Tooling notes
- Figma MCP is configured in `opencode.json` and reads a **gitignored** `figma-api-key` file — never commit it.
- Better Auth MCP server (`https://mcp.better-auth.com/mcp`) is also configured; use it for auth-related lookups.
- `app.architecture.md` describes the *intended* layout but is partly aspirational (Redux/axios/Prisma). Trust `package.json` and `src/` over that doc.
- `next.config.ts` sets `allowedDevOrigins: ['192.168.100.200']` — expected for the maintainer's LAN; do not remove or widen without asking.
