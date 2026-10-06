import { beforeEach, describe, expect, it, vi } from "vitest";

const { get, post } = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }));
vi.mock("@/src/lib/api-client", () => ({ api: { get, post } }));

import {
  fetchResearcher,
  fetchResearchers,
  fetchScholarProfile,
  resolveScholarAuthorId,
} from "./researcher.api";
import { COLLABORATORS, makeResearcher, makeScholarAuthor } from "./researcher.test-fixtures";

beforeEach(() => {
  get.mockReset();
  post.mockReset();
});

describe("fetchResearchers", () => {
  it("requests GET /researchers with page and limit", async () => {
    const page = { success: true, data: [], pagination: { total: 0, page: 1, limit: 12, totalPages: 0 } };
    get.mockResolvedValue({ data: page });

    await expect(fetchResearchers({ page: 2 })).resolves.toBe(page);
    expect(get).toHaveBeenCalledWith("/researchers", {
      params: { page: 2, limit: 12 },
      signal: undefined,
    });
  });
});

describe("fetchResearcher", () => {
  it("unwraps the { data } envelope of GET /researchers/:id", async () => {
    const researcher = makeResearcher({ id: 7 });
    get.mockResolvedValue({ data: { success: true, data: researcher } });

    await expect(fetchResearcher(7)).resolves.toBe(researcher);
    expect(get).toHaveBeenCalledWith("/researchers/7", { signal: undefined });
  });
});

describe("resolveScholarAuthorId", () => {
  it("uses a numeric scholarId as the Semantic Scholar id without searching", async () => {
    await expect(
      resolveScholarAuthorId(makeResearcher({ scholarId: " 145053999 " })),
    ).resolves.toBe("145053999");
    expect(get).not.toHaveBeenCalled();
  });

  it("searches by cleaned name otherwise and takes the top hit", async () => {
    get.mockResolvedValue({ data: { success: true, total: 1, authors: [{ authorId: "42" }] } });

    await expect(
      resolveScholarAuthorId(makeResearcher({ firstName: "Dr. Raghied", scholarId: "AbC" })),
    ).resolves.toBe("42");
    expect(get).toHaveBeenCalledWith("/search", {
      params: { query: "Raghied Atta", limit: 1 },
      signal: undefined,
    });
  });

  it("returns null when the search has no match", async () => {
    get.mockResolvedValue({ data: { success: true, total: 0, authors: [] } });
    await expect(resolveScholarAuthorId(makeResearcher())).resolves.toBeNull();
  });
});

describe("fetchScholarProfile", () => {
  it("posts the resolved id to /analyze and maps the result", async () => {
    post.mockResolvedValue({
      data: { author: makeScholarAuthor(), collaborators: COLLABORATORS },
    });
    const controller = new AbortController();

    const profile = await fetchScholarProfile(
      makeResearcher({ scholarId: "145053999" }),
      controller.signal,
    );

    expect(post).toHaveBeenCalledWith(
      "/analyze",
      { authorId: "145053999" },
      { signal: controller.signal },
    );
    expect(profile?.stats).toEqual({ hIndex: 9, publications: 37, citations: 321 });
    expect(profile?.coAuthors[0].name).toBe("G. Reed");
  });

  it("returns null without calling /analyze when no author matches", async () => {
    get.mockResolvedValue({ data: { success: true, total: 0, authors: [] } });
    await expect(fetchScholarProfile(makeResearcher())).resolves.toBeNull();
    expect(post).not.toHaveBeenCalled();
  });
});
