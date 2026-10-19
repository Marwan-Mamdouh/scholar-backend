import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import ProjectCard from "./ProjectCard";
import { toProjectSummary } from "./project.utils";
import { makeProject } from "./project.test-fixtures";
import type { ProjectSummary } from "./project.type";

describe("ProjectCard", () => {
  it("renders every row from the design when data is complete", () => {
    const project = toProjectSummary(makeProject({ domains: ["Microwave", "Antennas", "RF", "5G"] }));
    render(<ProjectCard project={project} />);
    const card = within(screen.getByRole("article", { name: project.title }));

    expect(card.getByRole("heading", { name: project.title })).toHaveClass("line-clamp-3");
    expect(card.getByText("2025")).toBeInTheDocument();
    expect(card.getByText("Cairo University")).toBeInTheDocument();
    expect(
      within(card.getByRole("list", { name: "Project fields" }))
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual(["Microwave", "Antennas", "RF"]);
    expect(card.getByText("Supervisor")).toBeInTheDocument();
    expect(card.getByText("Dr. Abd El Rahman Abo Taleb")).toBeInTheDocument();
    expect(
      within(card.getByRole("list", { name: "Mentors" }))
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual(["Eng. Nour El Deen El Hout", "Eng. Sara Nassef"]);
    expect(card.getByText("Sponsored By Siemens EDA")).toBeInTheDocument();

    const link = card.getByRole("link", { name: /View project/ });
    expect(link).toHaveAttribute("href", "https://example.com/fpga-riscv");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("omits optional rows entirely when data is missing", () => {
    const minimal: ProjectSummary = { id: 9, title: "Untitled project", fields: [], mentors: [] };
    render(<ProjectCard project={minimal} />);
    const card = screen.getByRole("article", { name: "Untitled project" });

    expect(screen.queryByText("Supervisor")).toBeNull();
    expect(screen.queryByText("Mentors")).toBeNull();
    expect(screen.queryByText(/Sponsored By/)).toBeNull();
    expect(screen.queryByRole("list", { name: "Project fields" })).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
    expect(card.textContent).not.toMatch(/undefined|null|N\/A/);
  });
});
