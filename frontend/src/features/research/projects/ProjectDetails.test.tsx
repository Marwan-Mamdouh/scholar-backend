import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useCatalogDetail } from "@/src/hooks/useCatalogDetail";
import ProjectDetails from "./ProjectDetails";
import { makeProject } from "./project.test-fixtures";
import type { GraduationProject } from "./project.type";

vi.mock("@/src/hooks/useCatalogDetail", () => ({ useCatalogDetail: vi.fn() }));

function renderProject(project: GraduationProject) {
  vi.mocked(useCatalogDetail).mockReturnValue({
    data: project,
    loading: false,
    error: undefined,
    notFound: false,
    reload: vi.fn(),
  });
  render(<ProjectDetails id={String(project.id)} />);
}

describe("ProjectDetails", () => {
  it("shows the fields omitted from the card and the external documentation action", () => {
    const project = makeProject({
      domains: ["Microwave", "Antennas", "RF", "5G"],
    });
    renderProject(project);

    expect(
      screen.getByRole("heading", { level: 1, name: project.projectTitle }),
    ).toBeVisible();
    expect(screen.getByText("5 students")).toBeVisible();
    expect(screen.getByText(project.faculty!)).toBeVisible();
    expect(screen.getByText(project.industry!)).toBeVisible();
    expect(
      within(screen.getByRole("list", { name: "Project fields" })).getAllByRole(
        "listitem",
      ),
    ).toHaveLength(4);
    const link = screen.getByRole("link", { name: /View documentation/ });
    expect(link).toHaveAttribute("href", project.documentationLink);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it.each([null, "javascript:void(0)", "drive/folder"])(
    "shows project information when the documentation URL is %s",
    (documentationLink) => {
      renderProject(makeProject({ documentationLink, noOfStudents: 1 }));

      expect(screen.getByText("1 student")).toBeVisible();
      expect(
        screen.queryByRole("link", { name: /View documentation/ }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Back to projects" }),
      ).toHaveAttribute("href", "/research?tab=projects");
    },
  );
});
