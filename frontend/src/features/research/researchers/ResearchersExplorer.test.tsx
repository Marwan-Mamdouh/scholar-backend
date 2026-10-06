import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { useSyncExternalStore } from "react";

// Next.js syncs useSearchParams with window.history.pushState; emulate that here.
const { urlStore } = vi.hoisted(() => {
  const listeners = new Set<() => void>();
  return {
    urlStore: {
      subscribe(listener: () => void) {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      snapshot: () => window.location.search,
      emit: () => listeners.forEach((listener) => listener()),
    },
  };
});

vi.mock("next/navigation", () => ({
  useSearchParams: () =>
    new URLSearchParams(useSyncExternalStore(urlStore.subscribe, urlStore.snapshot)),
}));
vi.mock("next/dynamic", () => ({ default: () => () => null }));

const { fetchResearcher, fetchScholarProfile } = vi.hoisted(() => ({
  fetchResearcher: vi.fn(),
  fetchScholarProfile: vi.fn(),
}));
vi.mock("./researcher.api", () => ({ fetchResearcher, fetchScholarProfile }));

import ResearchersExplorer, { parseResearcherId } from "./ResearchersExplorer";
import { RESEARCHERS, makeScholarProfile } from "./researcher.test-fixtures";

const originalPushState = window.history.pushState.bind(window.history);

function setUrl(search: string) {
  act(() => {
    originalPushState(null, "", `/research${search}`);
    urlStore.emit();
  });
}

/** Let the 250ms exit run, then commit the swapped-in view. */
function finishTransition() {
  act(() => vi.advanceTimersByTime(300));
}

beforeEach(() => {
  vi.useFakeTimers();
  setUrl("?tab=researchers");
  vi.spyOn(window.history, "pushState").mockImplementation((data, unused, url) => {
    originalPushState(data, unused, url);
    urlStore.emit();
  });
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  fetchResearcher.mockReset();
  fetchScholarProfile.mockReset().mockResolvedValue(makeScholarProfile());
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

const viewProfile = (name: string) =>
  fireEvent.click(
    within(screen.getByRole("article", { name })).getByRole("button", { name: "View Profile" }),
  );

describe("parseResearcherId", () => {
  it("accepts positive integers only", () => {
    expect(parseResearcherId("12")).toBe(12);
    for (const value of [null, "", "0", "-3", "1.5", "abc", "12abc"]) {
      expect(parseResearcherId(value)).toBeNull();
    }
  });
});

describe("ResearchersExplorer", () => {
  it("renders a card per researcher", () => {
    render(<ResearchersExplorer researchers={RESEARCHERS} />);
    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(screen.getByPlaceholderText("Search by Researcher Name")).toBeInTheDocument();
  });

  it("opens the clicked researcher's profile and keeps other params", () => {
    render(<ResearchersExplorer researchers={RESEARCHERS} />);

    viewProfile("Sarah El-Ghandour");
    expect(window.location.search).toBe("?tab=researchers&researcher=2");
    // grid stays mounted (animating out) until the exit finishes
    expect(screen.getAllByRole("article")).toHaveLength(3);

    finishTransition();
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.getByRole("heading", { level: 2, name: "Sarah El-Ghandour" })).toBeInTheDocument();
    // row came from the grid, so no extra request for it
    expect(fetchResearcher).not.toHaveBeenCalled();
    expect(fetchScholarProfile).toHaveBeenCalledWith(RESEARCHERS[1], expect.any(AbortSignal));
  });

  it("opens the correct profile for every card", () => {
    render(<ResearchersExplorer researchers={RESEARCHERS} />);

    for (const researcher of RESEARCHERS) {
      const name = `${researcher.firstName} ${researcher.lastName}`;
      viewProfile(name);
      finishTransition();
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(name);

      fireEvent.click(screen.getByRole("button", { name: "Back to list" }));
      finishTransition();
      expect(screen.getAllByRole("article")).toHaveLength(3);
    }
    expect(window.location.search).toBe("?tab=researchers");
  });

  it("applies symmetric enter/exit motion classes", () => {
    const { container } = render(<ResearchersExplorer researchers={RESEARCHERS} />);
    const view = () => container.querySelector("[class*='transition-[opacity,translate]']")!;

    expect(view().className).toContain("starting:-translate-x-6");
    viewProfile("Raghied Atta");
    expect(view().className).toContain("-translate-x-6 ");
    expect(view()).toHaveAttribute("aria-busy", "true");

    finishTransition();
    expect(view().className).toContain("starting:translate-x-6");
    fireEvent.click(screen.getByRole("button", { name: "Back to list" }));
    expect(view().className).toMatch(/(^|\s)translate-x-6(\s|$)/);
  });

  it("settles on the last researcher when switching rapidly", () => {
    render(<ResearchersExplorer researchers={RESEARCHERS} />);

    viewProfile("Raghied Atta");
    act(() => vi.advanceTimersByTime(100));
    setUrl("?tab=researchers&researcher=3");
    finishTransition();

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Omar Morsi");
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(1);
  });

  it("returns to the grid when the browser goes back mid-exit", () => {
    render(<ResearchersExplorer researchers={RESEARCHERS} />);

    viewProfile("Raghied Atta");
    setUrl("?tab=researchers");
    finishTransition();
    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(screen.queryByRole("button", { name: "Back to list" })).toBeNull();
  });

  it("restores the profile from the URL on refresh, fetching the row by id", async () => {
    setUrl("?tab=researchers&researcher=42");
    fetchResearcher.mockResolvedValue({ ...RESEARCHERS[1], id: 42 });
    render(<ResearchersExplorer researchers={RESEARCHERS} />);

    expect(screen.queryAllByRole("article")).toHaveLength(0);
    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });
    expect(fetchResearcher).toHaveBeenCalledWith(42, expect.any(AbortSignal));
    expect(screen.getByRole("heading", { level: 2, name: "Sarah El-Ghandour" })).toBeInTheDocument();
  });

  it("ignores a malformed researcher param", () => {
    setUrl("?tab=researchers&researcher=abc");
    render(<ResearchersExplorer researchers={RESEARCHERS} />);
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });

  it("shows the list error but still opens profiles by URL", () => {
    render(<ResearchersExplorer researchers={[]} error="Failed to fetch researchers" />);
    expect(screen.getByText("Researchers Are Unavailable")).toBeInTheDocument();
    expect(screen.getByText("Failed to fetch researchers")).toBeInTheDocument();

    fetchResearcher.mockReturnValue(new Promise(() => {}));
    setUrl("?tab=researchers&researcher=5");
    finishTransition();
    expect(screen.getByText("Loading researcher…")).toBeInTheDocument();
  });

  it("falls back to the existing empty state when there are no researchers", () => {
    render(<ResearchersExplorer researchers={[]} />);
    expect(screen.getByText("Find What You're Looking For")).toBeInTheDocument();
  });
});
