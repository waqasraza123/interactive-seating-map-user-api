import { useEffect, useState } from "react";
import { normalizeVenue, parseVenueFixture, type NormalizedVenue } from "../lib/venue";

export type VenueSource = "large" | "sample";

type VenueState =
  | {
      error: null;
      isLoading: true;
      venue: null;
    }
  | {
      error: string;
      isLoading: false;
      venue: null;
    }
  | {
      error: null;
      isLoading: false;
      venue: NormalizedVenue;
    };

const missingLargeVenueMessage = "Large venue fixture is missing. Run `pnpm fixture:large`, then reload `/?venue=large`.";

export function useVenue(source: VenueSource): VenueState {
  const [venue, setVenue] = useState<NormalizedVenue | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();

    async function loadVenue(): Promise<void> {
      try {
        const venuePath = source === "large" ? "/venue-large.json" : "/venue.json";
        const response = await fetch(venuePath, {
          signal: abortController.signal
        });

        if (!response.ok) {
          throw new Error(`Venue request failed with status ${response.status}.`);
        }

        const contentType = response.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {
          if (source === "large") {
            throw new Error(missingLargeVenueMessage);
          }

          throw new Error("Venue request did not return JSON.");
        }

        setVenue(normalizeVenue(parseVenueFixture(await response.json())));
        setError(null);
      } catch (loadError) {
        if (!abortController.signal.aborted) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load venue.");
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadVenue();

    return () => {
      abortController.abort();
    };
  }, [source]);

  if (isLoading) {
    return {
      error: null,
      isLoading: true,
      venue: null
    };
  }

  if (error) {
    return {
      error,
      isLoading: false,
      venue: null
    };
  }

  if (!venue) {
    return {
      error: "Venue data was empty.",
      isLoading: false,
      venue: null
    };
  }

  return {
    error: null,
    isLoading: false,
    venue
  };
}
