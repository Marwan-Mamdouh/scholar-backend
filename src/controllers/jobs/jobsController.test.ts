import { beforeEach, describe, expect, it, vi } from "vitest";
import { db } from "../../db/db_config.js";
import { getJobsController } from "./jobsController.js";

vi.mock("../../db/db_config.js", () => ({
    db: { job: { findMany: vi.fn(), count: vi.fn() } },
}));

async function listJobs(query: Record<string, string>) {
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    await getJobsController({ query }, res);
    return res;
}

describe("jobs listing", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(db.job.findMany).mockResolvedValue([]);
        vi.mocked(db.job.count).mockResolvedValue(0);
    });

    it("keeps keyword search when filtering by company name", async () => {
        const res = await listJobs({ search: "FPGA", company: "Siemens", country: "Egypt" });
        const { where } = vi.mocked(db.job.findMany).mock.calls[0][0];

        expect(where.OR).toEqual(expect.arrayContaining([
            { title: { contains: "FPGA", mode: "insensitive" } },
            { requirements: { contains: "FPGA", mode: "insensitive" } },
        ]));
        expect(where.AND).toEqual([{ OR: [{ company: { name: { contains: "Siemens", mode: "insensitive" } } }] }]);
        expect(where.branch).toEqual({ country: { contains: "Egypt", mode: "insensitive" } });
        expect(db.job.count).toHaveBeenCalledWith({ where });
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("supports company ID matching alongside keyword search", async () => {
        await listJobs({ search: "Analog", company: "42" });
        const { where } = vi.mocked(db.job.findMany).mock.calls[0][0];

        expect(where.OR).toEqual(expect.arrayContaining([
            { title: { contains: "Analog", mode: "insensitive" } },
        ]));
        expect(where.AND).toEqual([{ OR: [
            { companyId: 42 },
            { company: { name: { contains: "42", mode: "insensitive" } } },
        ] }]);
    });

    it("falls back from an unsupported sort field to the actual posted date field", async () => {
        await listJobs({ sortBy: "createdAt", sortOrder: "desc", page: "2", limit: "12" });
        expect(db.job.findMany).toHaveBeenCalledWith(expect.objectContaining({
            orderBy: { postedAt: "desc" }, take: 12, skip: 12,
        }));
    });
});
