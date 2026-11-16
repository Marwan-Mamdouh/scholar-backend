import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/dynamic", () => ({ default: () => () => null }));
const { fetchProjects } = vi.hoisted(() => ({ fetchProjects: vi.fn() }));
vi.mock("./project.api", () => ({ fetchProjects, PROJECTS_PAGE_SIZE: 12 }));

import ProjectsExplorer from "./ProjectsExplorer";
import { makePage, makeProject, makeProjects } from "./project.test-fixtures";
import type { ProjectFacets } from "./project.type";

const FACETS: ProjectFacets = {
  universities: ["Ain Shams University", "Cairo University"],
  fields: ["Antennas", "Microwave"],
  years: ["2025", "2024"],
};

const cards = () => screen.queryAllByRole("article");
const lastQuery = () => fetchProjects.mock.calls.at(-1)?.[0];

beforeEach(() => {
  // mockClear, not mockReset: after mockReset, Vitest 4.1 surfaces a handled
  // rejection from this mock as a test failure. Each test sets its own response.
  fetchProjects.mockClear();
  fetchProjects.mockImplementation(() => new Promise(() => {}));
});

describe("ProjectsExplorer", () => {
  it("renders the server's first page without refetching", () => {
    render(<ProjectsExplorer initialPage={makePage(makeProjects(3), 31)} facets={FACETS} />);

    expect(cards()).toHaveLength(3);
    expect(screen.getByText("Showing").textContent).toContain("31");
    expect(fetchProjects).not.toHaveBeenCalled();
  });

  it("lists the facet options in each dropdown", () => {
    render(<ProjectsExplorer initialPage={makePage([])} facets={FACETS} />);

    const options = (name: string) =>
      within(screen.getByRole("combobox", { name })).getAllByRole("option").map((o) => o.textContent);
    expect(options("University")).toEqual(["University", "Ain Shams University", "Cairo University"]);
    expect(options("Project Field")).toEqual(["Project Field", "Antennas", "Microwave"]);
    expect(options("Year")).toEqual(["Year", "2025", "2024"]);
    expect(options("Sponsorship")).toEqual(["Sponsorship", "Sponsored", "Not sponsored"]);
  });

  it("refetches page 1 with the selected filters", async () => {
    const user = userEvent.setup();
    fetchProjects.mockResolvedValue(makePage([makeProject({ id: 50, projectTitle: "Antenna array" })], 1));
    render(<ProjectsExplorer initialPage={makePage(makeProjects(3), 31)} facets={FACETS} />);

    await user.selectOptions(screen.getByRole("combobox", { name: "University" }), "Cairo University");
    await user.selectOptions(screen.getByRole("combobox", { name: "Sponsorship" }), "sponsored");

    await waitFor(() => expect(cards()).toHaveLength(1));
    expect(lastQuery()).toMatchObject({
      page: 1,
      limit: 12,
      university: "Cairo University",
      sponsorship: "sponsored",
    });
    expect(screen.getByRole("article", { name: "Antenna array" })).toBeInTheDocument();
    expect(screen.getByText("Showing").textContent).toContain("1");
  });

  it("debounces the search before calling the API", async () => {
    const user = userEvent.setup();
    fetchProjects.mockResolvedValue(makePage([makeProject()], 1));
    render(<ProjectsExplorer initialPage={makePage(makeProjects(3), 3)} facets={FACETS} />);

    await user.type(screen.getByRole("searchbox", { name: "Search projects" }), "fpga");
    expect(fetchProjects).not.toHaveBeenCalled();

    await waitFor(() => expect(fetchProjects).toHaveBeenCalledTimes(1));
    expect(lastQuery()).toMatchObject({ search: "fpga", page: 1 });
  });

  it("appends the next page with Load More and hides it at the end", async () => {
    const user = userEvent.setup();
    fetchProjects.mockResolvedValue(makePage(makeProjects(2, 13), 14, 2));
    render(<ProjectsExplorer initialPage={makePage(makeProjects(12), 14)} facets={FACETS} />);

    await user.click(screen.getByRole("button", { name: "Load More" }));

    await waitFor(() => expect(cards()).toHaveLength(14));
    expect(lastQuery()).toMatchObject({ page: 2 });
    expect(screen.getByRole("article", { name: "Project 1" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Project 14" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Load More" })).toBeNull();
  });

  it("shows an empty state with Clear filters when nothing matches", async () => {
    const user = userEvent.setup();
    fetchProjects
      .mockResolvedValueOnce(makePage([], 0))
      .mockResolvedValueOnce(makePage(makeProjects(2), 2));
    render(<ProjectsExplorer initialPage={makePage(makeProjects(2), 2)} facets={FACETS} />);

    await user.selectOptions(screen.getByRole("combobox", { name: "Year" }), "2024");
    expect(await screen.findByText("No projects match these filters.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    await waitFor(() => expect(cards()).toHaveLength(2));
    expect(screen.getByRole("combobox", { name: "Year" })).toHaveValue("");
  });

  it("says when no projects exist at all", () => {
    render(<ProjectsExplorer initialPage={makePage([], 0)} facets={FACETS} />);
    expect(screen.getByText("No graduation projects have been posted yet.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Clear filters" })).toBeNull();
  });

  it("shows the server error and retries on Try again", async () => {
    const user = userEvent.setup();
    fetchProjects.mockResolvedValue(makePage(makeProjects(2), 2));
    render(
      <ProjectsExplorer initialPage={null} facets={FACETS} initialError="Failed to fetch projects" />,
    );

    expect(screen.getByText("Couldn't load projects")).toBeInTheDocument();
    expect(screen.getByText("Failed to fetch projects")).toBeInTheDocument();
    expect(screen.queryByText("Showing")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Try again" }));
    await waitFor(() => expect(cards()).toHaveLength(2));
  });

  it("keeps the current cards when a filter request fails, then shows the error", async () => {
    const user = userEvent.setup();
    fetchProjects.mockImplementation(() => Promise.reject(new Error("Network down")));
    render(<ProjectsExplorer initialPage={makePage(makeProjects(2), 2)} facets={FACETS} />);

    await user.selectOptions(screen.getByRole("combobox", { name: "Year" }), "2025");
    expect(await screen.findByText("Network down")).toBeInTheDocument();
  });
});
