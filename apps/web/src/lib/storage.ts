const selectedSeatsStorageKey = "interactive-seating-map:selected-seat-ids";

export function readStoredSeatIds(): string[] {
  const rawValue = window.localStorage.getItem(selectedSeatsStorageKey);

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue: unknown = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter((value): value is string => typeof value === "string");
  } catch {
    return [];
  }
}

export function writeStoredSeatIds(seatIds: readonly string[]): void {
  window.localStorage.setItem(selectedSeatsStorageKey, JSON.stringify(seatIds));
}
