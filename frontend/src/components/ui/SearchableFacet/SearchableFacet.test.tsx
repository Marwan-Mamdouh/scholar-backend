import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import SearchableFacet from "./SearchableFacet";

function UniversityFilter() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <SearchableFacet
      label="Universities"
      options={[
        { value: "cairo", label: "Cairo University" },
        { value: "ain", label: "Ain Shams University" },
      ]}
      selected={selected}
      onChange={setSelected}
    />
  );
}

describe("SearchableFacet", () => {
  it("keeps selections visible while searching and allows removal while collapsed", async () => {
    const user = userEvent.setup();
    render(<UniversityFilter />);
    await user.click(screen.getByRole("button", { name: "Universities" }));
    await user.click(
      screen.getByRole("checkbox", { name: "Cairo University" }),
    );
    await user.type(
      screen.getByRole("searchbox", { name: "Search universities" }),
      "AIN",
    );
    expect(
      screen.queryByRole("checkbox", { name: "Cairo University" }),
    ).toBeNull();
    expect(
      screen.getByRole("button", { name: "Remove Cairo University" }),
    ).toBeVisible();
    await user.click(
      screen.getByRole("checkbox", { name: "Ain Shams University" }),
    );
    await user.click(screen.getByRole("button", { name: /^Universities\s*2 selected$/ }));
    expect(
      screen.getByRole("button", { name: "Remove Ain Shams University" }),
    ).toBeVisible();
    await user.click(
      screen.getByRole("button", { name: "Remove Cairo University" }),
    );
    expect(
      screen.queryByRole("button", { name: "Remove Cairo University" }),
    ).toBeNull();
    expect(
      screen.getByRole("button", { name: "Remove Ain Shams University" }),
    ).toHaveFocus();
  });
});
