import type { Request, Response } from "express";
import { afterEach, describe, expect, it, vi } from "vitest";
import { yearCountsHandler } from "./yearCounts.js";

function response() {
    return { set: vi.fn().mockReturnThis(), json: vi.fn() };
}

const req = {} as Request;

afterEach(() => vi.useRealTimers());

describe("yearCountsHandler", () => {
    it("shares one aggregation across concurrent requests and refreshes the cache on expiry", async () => {
        vi.useFakeTimers();
        const counts = [{ year: 2024, count: 3 }, { year: 2026, count: 200_000 }];
        let finish: (value: typeof counts) => void;
        const load = vi.fn()
            .mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }))
            .mockResolvedValue(counts);
        const handler = yearCountsHandler(load);
        const next = vi.fn();

        const responses = Array.from({ length: 30 }, response);
        const pending = responses.map(res => handler(req, res as unknown as Response, next));
        expect(load).toHaveBeenCalledTimes(1);
        finish(counts);
        await Promise.all(pending);

        for (const res of responses) {
            expect(res.json).toHaveBeenCalledWith({ success: true, data: [2024, 2026], counts });
            expect(res.set).toHaveBeenCalledWith("Cache-Control", "public, max-age=60");
        }
        expect(next).not.toHaveBeenCalled();

        vi.advanceTimersByTime(30_000);
        const cached = response();
        await handler(req, cached as unknown as Response, next);
        expect(load).toHaveBeenCalledTimes(1);
        expect(cached.set).toHaveBeenCalledWith("Cache-Control", "public, max-age=30");

        vi.advanceTimersByTime(30_000);
        await handler(req, response() as unknown as Response, next);
        expect(load).toHaveBeenCalledTimes(2);
    });

    it("retries failed loads instead of caching the error", async () => {
        const error = new Error("Unavailable");
        const load = vi.fn().mockRejectedValueOnce(error).mockResolvedValueOnce([]);
        const handler = yearCountsHandler(load);
        const next = vi.fn();
        const failed = response();
        await handler(req, failed as unknown as Response, next);
        expect(next).toHaveBeenCalledWith(error);
        expect(failed.set).not.toHaveBeenCalled();

        const retry = response();
        await handler(req, retry as unknown as Response, next);
        expect(retry.json).toHaveBeenCalledWith({ success: true, data: [], counts: [] });
    });
});
