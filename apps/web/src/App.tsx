import { useMemo, useState, useCallback } from "react";
import { PageShell } from "./components/PageShell";
import { SeatDetailsPanel } from "./components/SeatDetailsPanel";
import { SeatingMap } from "./components/SeatingMap";
import { SelectionSummary } from "./components/SelectionSummary";
import { useSeatSelection } from "./hooks/useSeatSelection";
import { useVenue } from "./hooks/useVenue";
import { useVenueSource } from "./hooks/useVenueSource";
import type { NormalizedSeat } from "./lib/venue";

export function App() {
  const venueSource = useVenueSource();
  const venueState = useVenue(venueSource);

  if (venueState.isLoading) {
    return (
      <PageShell venueSource={venueSource}>
        <section className="status-panel" aria-live="polite">
          Loading venue...
        </section>
      </PageShell>
    );
  }

  if (venueState.error) {
    return (
      <PageShell venueSource={venueSource}>
        <section className="status-panel error" role="alert">
          {venueState.error}
        </section>
      </PageShell>
    );
  }

  if (!venueState.venue) {
    return (
      <PageShell venueSource={venueSource}>
        <section className="status-panel error" role="alert">
          Venue data was empty.
        </section>
      </PageShell>
    );
  }

  return <VenueExperience venue={venueState.venue} venueSource={venueSource} />;
}

type VenueExperienceProps = {
  venue: NonNullable<ReturnType<typeof useVenue>["venue"]>;
  venueSource: ReturnType<typeof useVenueSource>;
};

function VenueExperience({ venue, venueSource }: VenueExperienceProps) {
  const [activeSeat, setActiveSeat] = useState<NormalizedSeat | null>(() => venue.seats[0] ?? null);
  const [isHeatMapEnabled, setIsHeatMapEnabled] = useState(false);
  const selection = useSeatSelection(venue.seatsById);
  const selectedSeatIdSet = useMemo(() => new Set(selection.selectedSeatIds), [selection.selectedSeatIds]);
  const handleSeatFocus = useCallback((seat: NormalizedSeat) => {
    setActiveSeat(seat);
  }, []);
  const handleHeatMapChange = useCallback(() => {
    setIsHeatMapEnabled((currentValue) => !currentValue);
  }, []);

  return (
    <PageShell venueSource={venueSource}>
      <section className="workspace">
        <SeatingMap
          activeSeatId={activeSeat?.id ?? null}
          canSelectMore={selection.canSelectMore}
          isHeatMapEnabled={isHeatMapEnabled}
          onHeatMapChange={handleHeatMapChange}
          onSeatFocus={handleSeatFocus}
          onSeatToggle={selection.toggleSeat}
          selectedSeatIds={selectedSeatIdSet}
          venue={venue}
        />
        <div className="side-panels">
          <SeatDetailsPanel seat={activeSeat} />
          <SelectionSummary
            maxSelectedSeats={selection.maxSelectedSeats}
            selectedSeats={selection.selectedSeats}
            subtotal={selection.subtotal}
          />
        </div>
      </section>
    </PageShell>
  );
}
