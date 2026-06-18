import type { VenueFixture } from "@interactive-seating-map/shared";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "../src/App";

const fixture: VenueFixture = {
  id: "test-venue",
  map: {
    height: 400,
    width: 600
  },
  name: "Test Hall",
  sections: [
    {
      id: "section-a",
      name: "Section A",
      seats: [
        {
          id: "a-1",
          number: 1,
          priceTier: "vip",
          row: "A",
          status: "available",
          x: 100,
          y: 120
        },
        {
          id: "a-2",
          number: 2,
          priceTier: "premium",
          row: "A",
          status: "sold",
          x: 140,
          y: 120
        },
        ...Array.from({ length: 8 }, (_, index) => ({
          id: `a-${index + 3}`,
          number: index + 3,
          priceTier: "standard" as const,
          row: "A",
          status: "available" as const,
          x: 180 + index * 40,
          y: 120
        }))
      ]
    }
  ]
};

function mockVenueFetch(): void {
  vi.stubGlobal(
    "fetch",
    vi.fn(
      async () =>
        new Response(JSON.stringify(fixture), {
          headers: {
            "content-type": "application/json"
          }
        })
    )
  );
}

async function renderApp() {
  render(<App />);
  await screen.findByText("10 seats loaded. Use arrow keys to move focus across seats.");
}

function getSelectedSeatsPanel(): HTMLElement {
  const panel = screen.getByRole("heading", { name: "Selected seats" }).closest("aside");

  if (!(panel instanceof HTMLElement)) {
    throw new Error("Selected seats panel was not found.");
  }

  return panel;
}

describe("App", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.pushState(null, "", "/");
    mockVenueFetch();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it("renders successfully", async () => {
    await renderApp();

    expect(screen.getByRole("heading", { name: "Interactive seating map" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Test Hall seating map" })).toBeInTheDocument();
  });

  it("renders venue seats", async () => {
    await renderApp();

    expect(screen.getByRole("button", { name: /Section A, row A, seat 1, \$125, available/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Section A, row A, seat 2, \$85, sold/ })).toBeInTheDocument();
  });

  it("selects an available seat", async () => {
    const user = userEvent.setup();
    await renderApp();

    const seat = screen.getByRole("button", { name: /Section A, row A, seat 1, \$125, available/ });
    await user.click(seat);

    expect(seat).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("1 / 8 selected")).toBeInTheDocument();
  });

  it("does not select unavailable seats", async () => {
    const user = userEvent.setup();
    await renderApp();

    const soldSeat = screen.getByRole("button", { name: /Section A, row A, seat 2, \$85, sold/ });
    await user.click(soldSeat);

    expect(soldSeat).toHaveAttribute("aria-pressed", "false");
    expect(soldSeat).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByText("0 / 8 selected")).toBeInTheDocument();
  });

  it("updates the selected summary and subtotal", async () => {
    const user = userEvent.setup();
    await renderApp();

    await user.click(screen.getByRole("button", { name: /Section A, row A, seat 1, \$125, available/ }));
    await user.click(screen.getByRole("button", { name: /Section A, row A, seat 3, \$55, available/ }));

    const panel = getSelectedSeatsPanel();
    expect(within(panel).getByText("2 / 8 selected")).toBeInTheDocument();
    expect(within(panel).getByText("Section A, row A, seat 1")).toBeInTheDocument();
    expect(within(panel).getByText("Section A, row A, seat 3")).toBeInTheDocument();
    expect(within(panel).getByText("$180")).toBeInTheDocument();

    const firstRemoveButton = within(panel).getAllByRole("button", { name: /Remove Section A, row A, seat 1/ })[0];

    if (!firstRemoveButton) {
      throw new Error("Remove button was not found.");
    }

    await user.click(firstRemoveButton);

    expect(within(panel).getByText("1 / 8 selected")).toBeInTheDocument();
    expect(within(panel).queryByText("Section A, row A, seat 1")).not.toBeInTheDocument();
    expect(within(panel).getAllByText("$55")).toHaveLength(2);
  });

  it("shows a limit warning when selecting more than eight seats", async () => {
    const user = userEvent.setup();
    await renderApp();

    for (const seatNumber of [1, 3, 4, 5, 6, 7, 8, 9]) {
      await user.click(screen.getByRole("button", { name: new RegExp(`Section A, row A, seat ${seatNumber}, .* available`) }));
    }

    await user.click(screen.getByRole("button", { name: /Section A, row A, seat 10, \$55, available/ }));

    expect(screen.getByRole("status")).toHaveTextContent("Selection limit reached. Remove a seat before choosing another.");
    expect(screen.getByText("8 / 8 selected")).toBeInTheDocument();
  });
});
