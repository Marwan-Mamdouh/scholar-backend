# Problems Found in Scholar Nexus

## 1. Authentication Redundancy

- **Duplicate Middlewares**: `isAdmin` and `isAuthenticated` are redefined in `src/index.js` while already existing in `src/middlewares/`.
- **Hardcoded Secrets**: Duplicated `JWT_SECRET` fallback in `src/index.js` and `src/config/env.ts`.

## 2. Functional & Security Bugs

- **Undefined `db` variable**: Line 840 in `src/index.js` (SQLite legacy) uses `db.run()`, but `db` is not defined. This will crash the server on that endpoint.
- **Duplicate Job Routes**: `POST /api/jobs/add` is defined twice (Lines 457 and 472). The second one is public, which is a security risk.

## 3. Implementation Inconsistencies

- **Mixed File Extensions**: `src/index.js` imports `.ts` middlewares using `.js` extensions.
- **Anonymous Database Check**: The database availability check at Line 102 is anonymous and should be named/extracted.
- **Fragile Data Masking**: Line 1530 uses a simplistic space-splitting method for Arabic name masking which is error-prone.
