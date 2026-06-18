import { useEffect, useState } from "react";
import { normalizeVenue, parseVenueFixture, type NormalizedVenue } from "../lib/venue";

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

export function useVenue(): VenueState {
  const [venue, setVenue] = useState<NormalizedVenue | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();

    async function loadVenue(): Promise<void> {
      try {
        const response = await fetch("/venue.json", {
          signal: abortController.signal
        });

        if (!response.ok) {
          throw new Error(`Venue request failed with status ${response.status}.`);
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
  }, []);

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
