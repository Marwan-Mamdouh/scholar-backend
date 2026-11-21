import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResearchYearFilter from "./ResearchYearFilter";
import { fetchResearchYears, type YearRange } from "./researchYears.api";

vi.mock("./researchYears.api", () => ({ fetchResearchYears: vi.fn() }));

function PaperFilter() {
  const [year, setYear] = useState<YearRange>(null);
  return (
    <ResearchYearFilter catalog="papers" value={year} onChange={setYear} />
  );
}

describe("ResearchYearFilter", () => {
  it("sets both bounds, keeps them ordered, and restores the full catalog range", async () => {
    vi.mocked(fetchResearchYears).mockResolvedValueOnce([1997, 2012, 2026]);
    render(<PaperFilter />);
    await userEvent.click(screen.getByRole("button", { name: "Year" }));
    const start = await screen.findByRole("slider", {
      name: "Publication year minimum",
    });
    const end = screen.getByRole("slider", {
      name: "Publication year maximum",
    });
    expect(start).toHaveAttribute("aria-valuetext", "1997");
    expect(end).toHaveAttribute("aria-valuetext", "2026");

    fireEvent.change(end, { target: { value: "1" } });
    expect(screen.getByText("1997–2012")).toBeVisible();
    fireEvent.change(start, { target: { value: "2" } });
    expect(start).toHaveAttribute("aria-valuetext", "2012");
    expect(end).toHaveAttribute("aria-valuetext", "2012");

    await userEvent.click(
      screen.getByRole("button", { name: "Clear year filter" }),
    );
    expect(screen.getByText("1997–2026")).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Clear year filter" }),
    ).toBeNull();
  });

  it("offers a retry on failure and handles a catalog with no dated records", async () => {
    vi.mocked(fetchResearchYears)
      .mockRejectedValueOnce(new Error("Unavailable"))
      .mockResolvedValueOnce([]);
    render(<PaperFilter />);
    await userEvent.click(screen.getByRole("button", { name: "Year" }));
    await userEvent.click(
      await screen.findByRole("button", { name: "Try again" }),
    );
    expect(await screen.findByText("No years available.")).toBeVisible();
  });
});
