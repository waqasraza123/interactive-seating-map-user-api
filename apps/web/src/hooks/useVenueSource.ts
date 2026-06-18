import { useMemo } from "react";
import type { VenueSource } from "./useVenue";

export function useVenueSource(): VenueSource {
  return useMemo(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("venue") === "large" ? "large" : "sample";
  }, []);
}
