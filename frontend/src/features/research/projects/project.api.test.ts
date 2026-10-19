import { beforeEach, describe, expect, it, vi } from "vitest";

const { get } = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock("@/src/lib/api-client", () => ({ api: { get } }));

import { fetchProjectFacets, fetchProjects } from "./project.api";
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
        year: "2025",
        sponsorship: "sponsored",
      },
      signal: undefined,
    });
  });
});

describe("fetchProjectFacets", () => {
  it("builds dropdown options from the latest 100 projects", async () => {
    get.mockResolvedValue({
      data: makePage([
        makeProject({ university: "Cairo University", domains: ["VLSI"] }),
        makeProject({ university: "Ain Shams University", domains: ["Antennas"] }),
      ]),
    });

    await expect(fetchProjectFacets()).resolves.toEqual({
      universities: ["Ain Shams University", "Cairo University"],
      fields: ["Antennas", "VLSI"],
      years: ["2025"],
    });
    expect(get.mock.calls[0][1].params).toMatchObject({ page: 1, limit: 100 });
  });
});
