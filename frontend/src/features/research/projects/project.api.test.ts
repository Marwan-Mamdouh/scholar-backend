import { beforeEach, describe, expect, it, vi } from "vitest";

const { get } = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock("@/src/lib/api-client", () => ({ api: { get } }));

import { fetchProjects } from "./project.api";
import { makePage, makeProject } from "./project.test-fixtures";

beforeEach(() => get.mockReset());

describe("fetchProjects", () => {
  it("sends only the filters that are set", async () => {
    const page = makePage([makeProject()]);
    get.mockResolvedValue({ data: page });

    await expect(
      fetchProjects({ page: 2, search: "  fpga ", university: "", year: "2025", sponsorship: "sponsored" }),
    ).resolves.toBe(page);

    expect(get).toHaveBeenCalledWith("/projects", {
      params: {
        page: 2,
        limit: 12,
        search: "fpga",
        university: undefined,
        projectField: undefined,
        universities: undefined,
        projectFields: undefined,
        year: "2025",
        sponsorship: "sponsored",
      },
      paramsSerializer: { indexes: null },
      signal: undefined,
    });
  });
  it("sends the inclusive year bounds with the other project filters", async () => {
    get.mockResolvedValue({ data: makePage([]) });
    await fetchProjects({ yearRange: { fromYear: 2022, toYear: 2025 }, universities: ["Cairo", "Ain Shams"] });
    expect(get.mock.calls[0][1].params).toMatchObject({
      fromYear: 2022, toYear: 2025, year: undefined, universities: ["Cairo", "Ain Shams"],
    });
  });

});
