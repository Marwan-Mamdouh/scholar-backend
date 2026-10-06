import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResearcherCard from "./ResearcherCard";
import type { ResearcherSummary } from "./researcher.type";

const FULL: ResearcherSummary = {
  id: 2,
  name: "Dr. Sarah El-Ghandour",
  initials: "SE",
  position: "Associate Professor of AI, School of Sciences",
  university: "American University in Cairo",
  universityAbbr: "AUC",
  bio: "Specializing in Natural Language Processing for Arabic dialects.",
  stats: { publications: 89, citations: 3200, hIndex: 28 },
  tags: ["NLP", "Machine Learning", "Arabic", "Speech"],
};

const MINIMAL: ResearcherSummary = { id: 3, name: "Omar Morsi", initials: "OM", tags: [] };

describe("ResearcherCard", () => {
  it("renders every row when data is complete", () => {
    render(<ResearcherCard researcher={FULL} onViewProfile={() => {}} />);
    const card = screen.getByRole("article", { name: FULL.name });

    expect(within(card).getByText("SE")).toBeInTheDocument();
    expect(within(card).getByText("AUC")).toBeInTheDocument();
    expect(within(card).getByRole("heading", { name: FULL.name })).toBeInTheDocument();
    expect(within(card).getByText(FULL.position!)).toBeInTheDocument();
    expect(within(card).getByText(FULL.university!)).toBeInTheDocument();
    expect(within(card).getByText(FULL.bio!)).toHaveClass("line-clamp-2");

    const metrics = within(card).getByRole("list", { name: "Research metrics" });
    expect(within(metrics).getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "Pubs: 89",
      "Citations: 3.2k",
      "h-index: 28",
    ]);
  });

  it("shows at most three topic chips", () => {
    render(<ResearcherCard researcher={FULL} onViewProfile={() => {}} />);
    const topics = screen.getByRole("list", { name: "Research topics" });
    expect(within(topics).getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "NLP",
      "Machine Learning",
      "Arabic",
    ]);
  });

  it("omits optional rows entirely instead of rendering placeholders", () => {
    render(<ResearcherCard researcher={MINIMAL} onViewProfile={() => {}} />);
    const card = screen.getByRole("article", { name: "Omar Morsi" });

    expect(screen.queryByRole("list", { name: "Research metrics" })).toBeNull();
    expect(screen.queryByRole("list", { name: "Research topics" })).toBeNull();
    expect(screen.queryByLabelText("University")).toBeNull();
    expect(screen.queryByLabelText("Institution")).toBeNull();
    expect(card.textContent).not.toMatch(/N\/A|undefined|null/);
    // avatar, name, bookmark and the button are all that remain
    expect(within(card).getByRole("button", { name: "View Profile" })).toBeInTheDocument();
  });

  it("toggles the bookmark between outline and filled", async () => {
    const user = userEvent.setup();
    render(<ResearcherCard researcher={FULL} onViewProfile={() => {}} />);

    const save = screen.getByRole("button", { name: `Save ${FULL.name}` });
    expect(save).toHaveAttribute("aria-pressed", "false");
    expect(save.querySelector("svg")).toHaveAttribute("fill", "none");

    await user.click(save);
    const saved = screen.getByRole("button", { name: `Remove ${FULL.name} from saved` });
    expect(saved).toHaveAttribute("aria-pressed", "true");
    expect(saved.querySelector("svg")).toHaveAttribute("fill", "currentColor");

    await user.click(saved);
    expect(screen.getByRole("button", { name: `Save ${FULL.name}` })).toBeInTheDocument();
  });

  it("starts bookmarked when the record says so", () => {
    render(<ResearcherCard researcher={{ ...FULL, bookmarked: true }} onViewProfile={() => {}} />);
    expect(screen.getByRole("button", { pressed: true })).toBeInTheDocument();
  });

  it("calls onViewProfile with the researcher id", async () => {
    const user = userEvent.setup();
    const onViewProfile = vi.fn();
    render(<ResearcherCard researcher={FULL} onViewProfile={onViewProfile} />);

    await user.click(screen.getByRole("button", { name: "View Profile" }));
    expect(onViewProfile).toHaveBeenCalledWith(2);
  });
});
