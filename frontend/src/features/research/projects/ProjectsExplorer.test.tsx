import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";

const { fetchResearchYears } = vi.hoisted(() => ({ fetchResearchYears: vi.fn() }));
vi.mock("../researchYears.api", () => ({ fetchResearchYears }));

vi.mock("next/dynamic", () => ({ default: () => () => null }));
const { fetchProjects } = vi.hoisted(() => ({ fetchProjects: vi.fn() }));
vi.mock("./project.api", () => ({ fetchProjects, PROJECTS_PAGE_SIZE: 12 }));

import ProjectsExplorer from "./ProjectsExplorer";
import { makePage, makeProject, makeProjects } from "./project.test-fixtures";
import type { ProjectFacets } from "./project.type";

const FACETS: ProjectFacets = {
  universities: ["Ain Shams University", "Cairo University"],
  fields: ["Antennas", "Microwave"],
};

vi.mock("@/src/components/catalog/CatalogFacetLoader", () => ({
  default: ({ children }: { children: (facets: ProjectFacets) => ReactNode }) => children(FACETS),
}));

const cards = () => screen.queryAllByRole("article");
const lastQuery = () => fetchProjects.mock.calls.at(-1)?.[0];

beforeEach(() => {
  // mockClear, not mockReset: after mockReset, Vitest 4.1 surfaces a handled
  // rejection from this mock as a test failure. Each test sets its own response.
  fetchResearchYears.mockReset().mockImplementation(() => new Promise(() => {}));
  fetchProjects.mockClear();
  fetchProjects.mockImplementation(() => new Promise(() => {}));
});

describe("ProjectsExplorer", () => {
  it("renders the server's first page without refetching", () => {
    render(<ProjectsExplorer initialPage={makePage(makeProjects(3), 31)} />);

    expect(cards()).toHaveLength(3);
    expect(screen.getByText("Showing").textContent).toContain("31");
    expect(fetchProjects).not.toHaveBeenCalled();
  });

  it("shows searchable checkboxes and keeps the sponsorship dropdown", () => {
    render(<ProjectsExplorer initialPage={makePage([])} />);

    fireEvent.click(screen.getByRole("button", { name: "University" }));
    expect(screen.getByRole("checkbox", { name: "Cairo University" })).toBeVisible();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search university" }), {
      target: { value: "ain" },
    });
    expect(screen.getByRole("checkbox", { name: "Ain Shams University" })).toBeVisible();
    expect(screen.queryByRole("checkbox", { name: "Cairo University" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Sponsorship" }));
    expect(within(screen.getByRole("combobox", { name: "Sponsorship" })).getAllByRole("option").map((option) => option.textContent))
      .toEqual(["Sponsorship", "Sponsored", "Not sponsored"]);
  });

  it("refetches page 1 with the selected filters", async () => {
    const user = userEvent.setup();
    fetchProjects.mockResolvedValue(makePage([makeProject({ id: 50, projectTitle: "Antenna array" })], 1));
    render(<ProjectsExplorer initialPage={makePage(makeProjects(3), 31)} />);

    await user.click(screen.getByRole("button", { name: "University" }));
    await user.click(screen.getByRole("checkbox", { name: "Cairo University" }));
    await user.click(screen.getByRole("checkbox", { name: "Ain Shams University" }));
    await user.click(screen.getByRole("button", { name: "Sponsorship" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Sponsorship" }), "sponsored");

    await waitFor(() => expect(cards()).toHaveLength(1));
    expect(lastQuery()).toMatchObject({
      page: 1,
      limit: 12,
      universities: ["Cairo University", "Ain Shams University"],
      sponsorship: "sponsored",
    });
    expect(screen.getByRole("article", { name: "Antenna array" })).toBeInTheDocument();
    expect(screen.getByText("Showing").textContent).toContain("1");
  });

  it("debounces the search before calling the API", async () => {
    const user = userEvent.setup();
    fetchProjects.mockResolvedValue(makePage([makeProject()], 1));
    render(<ProjectsExplorer initialPage={makePage(makeProjects(3), 3)} />);

    await user.type(screen.getByRole("searchbox", { name: "Search projects" }), "fpga");
    expect(fetchProjects).not.toHaveBeenCalled();

    await waitFor(() => expect(fetchProjects).toHaveBeenCalledTimes(1));
    expect(lastQuery()).toMatchObject({ search: "fpga", page: 1 });
  });

  it("appends the next page with Load More and hides it at the end", async () => {
    const user = userEvent.setup();
    fetchProjects.mockResolvedValue(makePage(makeProjects(2, 13), 14, 2));
    render(<ProjectsExplorer initialPage={makePage(makeProjects(12), 14)} />);

    await user.click(screen.getByRole("button", { name: "Load More" }));

    await waitFor(() => expect(cards()).toHaveLength(14));
    expect(lastQuery()).toMatchObject({ page: 2 });
    expect(screen.getByRole("article", { name: "Project 1" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Project 14" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Load More" })).toBeNull();
  });

  it("returns to page one when a year is cleared after loading more projects", async () => {
    const user = userEvent.setup();
    fetchResearchYears.mockResolvedValue({ years: [2024, 2026], counts: [] });
    fetchProjects
      .mockResolvedValueOnce(makePage(makeProjects(2, 13), 14, 2))
      .mockResolvedValueOnce(makePage(makeProjects(1, 20), 1))
      .mockResolvedValueOnce(makePage(makeProjects(12), 14));
    render(<ProjectsExplorer initialPage={makePage(makeProjects(12), 14)} />);
    await user.click(screen.getByRole("button", { name: "Load More" }));
    await waitFor(() => expect(cards()).toHaveLength(14));
    await user.click(screen.getByRole("button", { name: "Year" }));
    fireEvent.change(await screen.findByRole("slider", { name: "Project year minimum" }), { target: { value: "1" } });
    await waitFor(() => expect(cards()).toHaveLength(1));
    await user.click(screen.getByRole("button", { name: "Clear year filter" }));
    await waitFor(() => expect(cards()).toHaveLength(12));
    expect(lastQuery()).toMatchObject({ page: 1, yearRange: null });
  });

  it("shows an empty state with Clear filters when nothing matches", async () => {
    const user = userEvent.setup();
    fetchResearchYears.mockResolvedValue({ years: [2024, 2025], counts: [] });
    fetchProjects
      .mockResolvedValueOnce(makePage([], 0))
      .mockResolvedValueOnce(makePage(makeProjects(2), 2));
    render(<ProjectsExplorer initialPage={makePage(makeProjects(2), 2)} />);

    await user.click(screen.getByRole("button", { name: "Year" }));
    const slider = await screen.findByRole("slider", { name: "Project year maximum" });
    fireEvent.change(slider, { target: { value: "0" } });
    expect(await screen.findByText("No projects match these filters.")).toBeInTheDocument();
    expect(lastQuery()).toMatchObject({ yearRange: { fromYear: 2024, toYear: 2024 }, page: 1 });

    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    await waitFor(() => expect(cards()).toHaveLength(2));
    expect(slider).toHaveAttribute("aria-valuetext", "2025");
  });

  it("says when no projects exist at all", () => {
    render(<ProjectsExplorer initialPage={makePage([], 0)} />);
    expect(screen.getByText("No graduation projects have been posted yet.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Clear filters" })).toBeNull();
  });

  it("shows the server error and retries on Try again", async () => {
    const user = userEvent.setup();
    fetchProjects.mockResolvedValue(makePage(makeProjects(2), 2));
    render(
      <ProjectsExplorer initialPage={null} initialError="Failed to fetch projects" />,
    );

    expect(screen.getByText("Couldn't load projects")).toBeInTheDocument();
    expect(screen.getByText("Failed to fetch projects")).toBeInTheDocument();
    expect(screen.queryByText("Showing")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Try again" }));
    await waitFor(() => expect(cards()).toHaveLength(2));
  });

  it("keeps the current cards when a filter request fails, then shows the error", async () => {
    const user = userEvent.setup();
    fetchResearchYears.mockResolvedValue({ years: [2024, 2025], counts: [] });
    fetchProjects.mockImplementation(() => Promise.reject(new Error("Network down")));
    render(<ProjectsExplorer initialPage={makePage(makeProjects(2), 2)} />);

    await user.click(screen.getByRole("button", { name: "Year" }));
    fireEvent.change(await screen.findByRole("slider", { name: "Project year minimum" }), { target: { value: "1" } });
    expect(await screen.findByText("Network down")).toBeInTheDocument();
  });
});
