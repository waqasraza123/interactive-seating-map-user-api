import type { SeatStatus, VenueFixture, VenueSeat, VenueSection } from "@interactive-seating-map/shared";
import { PRICE_BY_TIER } from "./pricing";

export type NormalizedSeat = VenueSeat & {
  price: number;
  sectionId: string;
  sectionName: string;
};

export type NormalizedVenue = {
  fixture: VenueFixture;
  seats: NormalizedSeat[];
  seatsById: Map<string, NormalizedSeat>;
};

const selectableStatuses = new Set<SeatStatus>(["available"]);

export function isSeatSelectable(status: SeatStatus): boolean {
  return selectableStatuses.has(status);
}

export function normalizeVenue(fixture: VenueFixture): NormalizedVenue {
  const seats = fixture.sections.flatMap((section) =>
    section.seats.map((seat) => ({
      ...seat,
      price: PRICE_BY_TIER[seat.priceTier],
      sectionId: section.id,
      sectionName: section.name
    }))
  );

  return {
    fixture,
    seats,
    seatsById: new Map(seats.map((seat) => [seat.id, seat]))
  };
}

export function parseVenueFixture(value: unknown): VenueFixture {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.name !== "string") {
    throw new Error("Venue fixture is missing required venue fields.");
  }

  if (!isRecord(value.map) || typeof value.map.width !== "number" || typeof value.map.height !== "number") {
    throw new Error("Venue fixture is missing map dimensions.");
  }

  if (!Array.isArray(value.sections)) {
    throw new Error("Venue fixture sections must be an array.");
  }

  const sections = value.sections.map(parseVenueSection);

  return {
    id: value.id,
    map: {
      height: value.map.height,
      width: value.map.width
    },
    name: value.name,
    sections
  };
}

function parseVenueSection(value: unknown): VenueSection {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.name !== "string" || !Array.isArray(value.seats)) {
    throw new Error("Venue section is invalid.");
  }

  return {
    id: value.id,
    name: value.name,
    seats: value.seats.map(parseVenueSeat)
  };
}

function parseVenueSeat(value: unknown): VenueSeat {
  if (!isRecord(value)) {
    throw new Error("Venue seat is invalid.");
  }

  const seat = value as Partial<VenueSeat>;

  if (
    typeof seat.id !== "string" ||
    typeof seat.row !== "string" ||
    typeof seat.number !== "number" ||
    typeof seat.x !== "number" ||
    typeof seat.y !== "number" ||
    !isSeatStatus(seat.status) ||
    !isPriceTier(seat.priceTier)
  ) {
    throw new Error("Venue seat is missing required fields.");
  }

  return {
    id: seat.id,
    number: seat.number,
    priceTier: seat.priceTier,
    row: seat.row,
    status: seat.status,
    x: seat.x,
    y: seat.y
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSeatStatus(value: unknown): value is SeatStatus {
  return value === "available" || value === "held" || value === "reserved" || value === "sold";
}

function isPriceTier(value: unknown): value is VenueSeat["priceTier"] {
  return value === "standard" || value === "premium" || value === "vip";
}
