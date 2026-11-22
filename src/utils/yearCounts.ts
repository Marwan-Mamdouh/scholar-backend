import type { RequestHandler } from "express";
import asyncHandler from "../lib/async.handler.js";

interface YearCount {
    year: number;
    count: number;
}

interface CachedYearCounts {
    expiresAt: number;
    body: { success: true; data: number[]; counts: YearCount[] };
}

const CACHE_MS = 60_000;

export function yearCountsHandler(load: () => Promise<YearCount[]>): RequestHandler {
    let cached: CachedYearCounts | undefined;
    let pending: Promise<CachedYearCounts> | undefined;

    function refresh() {
        return load()
            .then(counts => {
                cached = {
                    expiresAt: Date.now() + CACHE_MS,
                    body: { success: true, data: counts.map(({ year }) => year), counts },
                };
                return cached;
            })
            .finally(() => { pending = undefined; });
    }

    return asyncHandler(async (_req, res) => {
        const current = cached && cached.expiresAt > Date.now()
            ? cached
            : await (pending ??= refresh());
        const maxAge = Math.max(0, Math.floor((current.expiresAt - Date.now()) / 1000));
        res.set("Cache-Control", `public, max-age=${maxAge}`).json(current.body);
    });
}
