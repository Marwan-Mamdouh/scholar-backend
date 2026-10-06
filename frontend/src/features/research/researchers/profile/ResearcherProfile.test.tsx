import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { fetchResearcher, fetchScholarProfile } = vi.hoisted(() => ({
  fetchResearcher: vi.fn(),
  fetchScholarProfile: vi.fn(),
}));
vi.mock("../researcher.api", () => ({ fetchResearcher, fetchScholarProfile }));

import ResearcherProfile from "./ResearcherProfile";
import { FIELD_COLORS, OTHER_COLOR } from "./FieldsDonut";
import {
  RESEARCHERS,
  makeResearcher,
  makeScholarProfile,
} from "../researcher.test-fixtures";
import type { ScholarProfile } from "../researcher.type";

const RAGHIED = RESEARCHERS[0];

function renderProfile(
  profile: ScholarProfile | null = makeScholarProfile(),
  researcher = RAGHIED,
) {
  fetchScholarProfile.mockResolvedValue(profile);
  const onBack = vi.fn();
  render(<ResearcherProfile id={researcher.id} initialResearcher={researcher} onBack={onBack} />);
  return { onBack, user: userEvent.setup() };
}

const papersList = () => screen.getByRole("list", { name: "Papers" });
const paperTitles = () =>
  within(papersList())
    .getAllByRole("listitem")
    .map((item) => item.querySelector("a, span.font-semibold")?.textContent);

beforeEach(() => {
  fetchResearcher.mockReset();
  fetchScholarProfile.mockReset();
});

describe("ResearcherProfile header", () => {
  it("renders the researcher's header, stats and links", async () => {
    renderProfile();

    expect(screen.getByRole("heading", { level: 2, name: "Raghied Atta" })).toBeInTheDocument();
    expect(screen.getByText("RA")).toBeInTheDocument();
    // institution is the placeholder "Unknown" → graceful fallback label
    expect(screen.getByText("Unknown Institution")).toBeInTheDocument();
    expect(screen.getByText("VLSI")).toBeInTheDocument();
    expect(screen.getByText("Micro-electronics / MEMs")).toBeInTheDocument();

    expect(await screen.findByText("321")).toBeInTheDocument();
    const stats = screen.getAllByRole("definition").slice(0, 3);
    expect(stats.map((node) => node.textContent)).toEqual(["9", "37", "321"]);
    // two accents only: H-Index + Papers share primary, Citations uses accent
    expect(stats.map((node) => node.className.match(/text-(primary|accent)-300/)?.[0])).toEqual([
      "text-primary-300",
      "text-primary-300",
      "text-accent-300",
    ]);

    expect(screen.getByRole("link", { name: /Google Scholar/ })).toHaveAttribute(
      "href",
      "https://scholar.google.com/citations?user=AbCdEf123",
    );
    expect(screen.getByRole("link", { name: /Semantic Scholar/ })).toHaveAttribute(
      "href",
      "https://www.semanticscholar.org/author/145053999",
    );
  });

  it("omits the field tag and interests when absent and uses the real institution", async () => {
    renderProfile(makeScholarProfile({ primaryField: null }), RESEARCHERS[2]);

    expect(screen.getByText("Alexandria University")).toBeInTheDocument();
    expect(screen.queryByText("Unknown Institution")).toBeNull();
    expect(screen.queryByText(/Interests:/)).toBeNull();
    await screen.findByText("321");
    expect(screen.queryByText("Materials Science")).toBeNull();
  });

  it("falls back to the Semantic Scholar primary field when the DB has none", async () => {
    renderProfile(makeScholarProfile(), makeResearcher({ mainTopic: null, subtopics: null }));
    expect(await screen.findByText("Materials Science")).toBeInTheDocument();
  });

  it("fetches the researcher by id when no row is passed in (page refresh)", async () => {
    fetchResearcher.mockResolvedValue(RESEARCHERS[1]);
    fetchScholarProfile.mockResolvedValue(makeScholarProfile());
    render(<ResearcherProfile id={2} onBack={() => {}} />);

    expect(screen.getByText("Loading researcher…")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Sarah El-Ghandour" })).toBeInTheDocument();
    expect(fetchResearcher).toHaveBeenCalledWith(2, expect.any(AbortSignal));
  });

  it("shows an error when the researcher can't be loaded", async () => {
    fetchResearcher.mockRejectedValue(new Error("Researcher not found"));
    render(<ResearcherProfile id={999} onBack={() => {}} />);

    expect(await screen.findByText("Researcher unavailable")).toBeInTheDocument();
    expect(screen.getByText("Researcher not found")).toBeInTheDocument();
    expect(fetchScholarProfile).not.toHaveBeenCalled();
  });

  it("calls onBack from the Back to list control", async () => {
    const { onBack, user } = renderProfile();
    await user.click(screen.getByRole("button", { name: "Back to list" }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});

describe("ResearcherProfile tabs", () => {
  it("defaults to Papers and switches tabs without leaving old content behind", async () => {
    const { user } = renderProfile();
    await screen.findByText("321");

    expect(screen.getByRole("tab", { name: "Papers" })).toHaveAttribute("aria-selected", "true");
    expect(papersList()).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Co-Authors" }));
    expect(screen.getByRole("tab", { name: "Co-Authors" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Papers" })).toHaveAttribute("aria-selected", "false");
    expect(screen.queryByRole("list", { name: "Papers" })).toBeNull();
    expect(screen.getByRole("list", { name: "Co-authors" })).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Analytics" }));
    expect(screen.queryByRole("list", { name: "Co-authors" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Fields of Study" })).toBeInTheDocument();
  });

  it("supports arrow-key navigation between tabs", async () => {
    const { user } = renderProfile();
    await screen.findByText("321");

    screen.getByRole("tab", { name: "Papers" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Co-Authors" })).toHaveFocus();
    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Analytics" })).toHaveAttribute("aria-selected", "true");
  });

  it("shows a loading state in the tab while Semantic Scholar data loads", () => {
    fetchScholarProfile.mockReturnValue(new Promise(() => {}));
    render(<ResearcherProfile id={1} initialResearcher={RAGHIED} onBack={() => {}} />);
    expect(screen.getByText("Loading publication data…")).toBeInTheDocument();
  });

  it("shows a quiet message when no Semantic Scholar author matches", async () => {
    renderProfile(null);
    expect(await screen.findByText("No Semantic Scholar profile found")).toBeInTheDocument();
    // no stats row without metrics
    expect(screen.queryByText("H-Index")).toBeNull();
  });

  it("shows the API error when Semantic Scholar fails", async () => {
    fetchScholarProfile.mockRejectedValue(new Error("Analysis Failed"));
    render(<ResearcherProfile id={1} initialResearcher={RAGHIED} onBack={() => {}} />);
    expect(await screen.findByText("Publication data is unavailable")).toBeInTheDocument();
    expect(screen.getByText("Analysis Failed")).toBeInTheDocument();
  });
});

describe("Papers tab", () => {
  it("lists newest papers first, five at a time, with Load More", async () => {
    const { user } = renderProfile();
    await screen.findByText("321");

    expect(paperTitles()).toHaveLength(5);
    expect(paperTitles()[0]).toBe("Performance enhancement of conical solar stills");

    await user.click(screen.getByRole("button", { name: "Load More" }));
    expect(paperTitles()).toHaveLength(7);
    // undated paper sinks to the bottom
    expect(paperTitles().at(-1)).toBe("Low power VLSI adder architectures");
    expect(screen.queryByRole("button", { name: "Load More" })).toBeNull();
  });

  it("renders year, venue and citation badge per row", async () => {
    renderProfile();
    await screen.findByText("321");

    const first = within(papersList()).getAllByRole("listitem")[0];
    expect(within(first).getByText("2026")).toBeInTheDocument();
    expect(within(first).getByText("Journal 1")).toBeInTheDocument();
    expect(within(first).getByLabelText("4 citations")).toBeInTheDocument();
    expect(within(first).getByRole("link")).toHaveAttribute(
      "href",
      "https://www.semanticscholar.org/paper/p1",
    );
  });

  it("filters by title", async () => {
    const { user } = renderProfile();
    await screen.findByText("321");

    await user.type(screen.getByRole("searchbox", { name: "Search papers by title" }), "fiber");
    expect(paperTitles()).toEqual([
      "Multimode optical fiber strain monitoring for smart infrastructures",
      "Photonic crystal fiber sensor design",
    ]);

    await user.clear(screen.getByRole("searchbox"));
    await user.type(screen.getByRole("searchbox"), "graphene");
    expect(screen.getByText("No matching papers")).toBeInTheDocument();
  });

  it("sorts oldest first and by citations", async () => {
    const { user } = renderProfile();
    await screen.findByText("321");

    await user.selectOptions(screen.getByRole("combobox", { name: "Sort papers" }), "oldest");
    expect(paperTitles()[0]).toBe("Photonic crystal fiber sensor design");

    await user.selectOptions(screen.getByRole("combobox", { name: "Sort papers" }), "cited");
    expect(paperTitles().slice(0, 2)).toEqual([
      "Photonic crystal fiber sensor design",
      "Nano-Materials-Based Printed Glucose Sensor",
    ]);
  });

  it("shows an empty state when the researcher has no papers", async () => {
    renderProfile(makeScholarProfile({ papers: [] }, []));
    expect(await screen.findByText("No papers yet")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Load More" })).toBeNull();
  });
});

describe("Co-Authors tab", () => {
  it("lists chips largest collaboration first with Semantic Scholar links", async () => {
    const { user } = renderProfile();
    await screen.findByText("321");
    await user.click(screen.getByRole("tab", { name: "Co-Authors" }));

    const chips = within(screen.getByRole("list", { name: "Co-authors" })).getAllByRole("link");
    expect(chips.map((chip) => chip.textContent)).toEqual([
      "G. Reed(7)",
      "G. Ensell(6)",
      "A. Evans(3)",
    ]);
    expect(chips[0]).toHaveAttribute("href", "https://www.semanticscholar.org/author/10");
    expect(chips[0]).toHaveAttribute("target", "_blank");
  });

  it("shows an empty state with no co-authors", async () => {
    const { user } = renderProfile(makeScholarProfile({}, []));
    await screen.findByText("321");
    await user.click(screen.getByRole("tab", { name: "Co-Authors" }));
    expect(screen.getByText("No co-authors found")).toBeInTheDocument();
  });
});

describe("Analytics tab", () => {
  it("draws one donut segment per field, matching the legend", async () => {
    const { user } = renderProfile();
    await screen.findByText("321");
    await user.click(screen.getByRole("tab", { name: "Analytics" }));

    const legend = within(screen.getByRole("list", { name: "Fields of study legend" }))
      .getAllByRole("listitem")
      .map((item) => item.textContent);
    expect(legend).toEqual([
      "Materials Science43%",
      "Engineering29%",
      "Computer Science14%",
      "Medicine14%",
    ]);

    const segments = screen.getAllByTestId("donut-segment");
    expect(segments).toHaveLength(4);
    expect(segments.map((segment) => segment.getAttribute("stroke"))).toEqual(
      FIELD_COLORS.slice(0, 4),
    );
  });

  it("restates the header stats with the same two accents", async () => {
    const { user } = renderProfile();
    await screen.findByText("321");
    await user.click(screen.getByRole("tab", { name: "Analytics" }));

    const recap = within(screen.getByRole("region", { name: "Metrics summary" }));
    expect(recap.getAllByRole("definition").map((node) => node.textContent)).toEqual([
      "9",
      "321",
      "37",
    ]);
    expect(recap.getByText("321")).toHaveClass("text-accent-300");
    expect(recap.getByText("9")).toHaveClass("text-primary-300");
  });

  it("colours the folded 'Other' slice neutral", async () => {
    const fields = ["A", "B", "C", "D", "E", "F"].map((field, index) => ({
      paperId: String(index),
      title: field,
      year: 2020,
      venue: null,
      citationCount: 0,
      fieldsOfStudy: [field],
    }));
    const { user } = renderProfile(makeScholarProfile({ papers: fields }));
    await screen.findByText("321");
    await user.click(screen.getByRole("tab", { name: "Analytics" }));

    const segments = screen.getAllByTestId("donut-segment");
    expect(segments.at(-1)).toHaveAttribute("stroke", OTHER_COLOR);
  });

  it("shows an empty state when no paper has fields of study", async () => {
    const { user } = renderProfile(
      makeScholarProfile({
        papers: [{ paperId: "x", title: "T", year: 2020, venue: null, citationCount: 0, fieldsOfStudy: null }],
      }),
    );
    await screen.findByText("321");
    await user.click(screen.getByRole("tab", { name: "Analytics" }));

    expect(screen.getByText("No field data")).toBeInTheDocument();
    expect(screen.queryAllByTestId("donut-segment")).toHaveLength(0);
    // the stat recap still renders
    await waitFor(() =>
      expect(screen.getByRole("region", { name: "Metrics summary" })).toBeInTheDocument(),
    );
  });
});
