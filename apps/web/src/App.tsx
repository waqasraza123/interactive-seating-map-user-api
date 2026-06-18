import { useCallback, useEffect, useMemo, useState } from "react";
import { PageShell } from "./components/PageShell";
import { SeatDetailsPanel } from "./components/SeatDetailsPanel";
import { SeatingMap } from "./components/SeatingMap";
import { SelectionSummary } from "./components/SelectionSummary";
import { useSeatSelection } from "./hooks/useSeatSelection";
import { useVenue } from "./hooks/useVenue";
import { useVenueSource } from "./hooks/useVenueSource";
import { isSeatSelectable, type NormalizedSeat } from "./lib/venue";

export function App() {
  const venueSource = useVenueSource();
  const venueState = useVenue(venueSource);

  if (venueState.isLoading) {
    return (
      <PageShell venueSource={venueSource}>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" aria-live="polite">
          Loading venue...
        </section>
      </PageShell>
    );
  }

  if (venueState.error) {
    return (
      <PageShell venueSource={venueSource}>
        <section className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-800 shadow-sm" role="alert">
          {venueState.error}
        </section>
      </PageShell>
    );
  }

  if (!venueState.venue) {
    return (
      <PageShell venueSource={venueSource}>
        <section className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-800 shadow-sm" role="alert">
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
  const [isLimitWarningVisible, setIsLimitWarningVisible] = useState(false);
  const selection = useSeatSelection(venue.seatsById);
  const selectedSeatIdSet = useMemo(() => new Set(selection.selectedSeatIds), [selection.selectedSeatIds]);

  useEffect(() => {
    if (selection.canSelectMore) {
      setIsLimitWarningVisible(false);
    }
  }, [selection.canSelectMore]);

  const handleSeatFocus = useCallback((seat: NormalizedSeat) => {
    setActiveSeat(seat);
  }, []);

  const handleHeatMapChange = useCallback(() => {
    setIsHeatMapEnabled((currentValue) => !currentValue);
  }, []);

  const handleSeatToggle = useCallback(
    (seat: NormalizedSeat) => {
      const isSelected = selectedSeatIdSet.has(seat.id);

      if (isSeatSelectable(seat.status) && !isSelected && !selection.canSelectMore) {
        setIsLimitWarningVisible(true);
        return;
      }

      setIsLimitWarningVisible(false);
      selection.toggleSeat(seat);
    },
    [selectedSeatIdSet, selection]
  );

  const handleSeatRemove = useCallback(
    (seatId: string) => {
      setIsLimitWarningVisible(false);
      selection.removeSeat(seatId);
    },
    [selection]
  );

  return (
    <PageShell venueSource={venueSource}>
      <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <SeatingMap
          activeSeatId={activeSeat?.id ?? null}
          canSelectMore={selection.canSelectMore}
          isHeatMapEnabled={isHeatMapEnabled}
          onHeatMapChange={handleHeatMapChange}
          onSeatFocus={handleSeatFocus}
          onSeatToggle={handleSeatToggle}
          selectedSeatIds={selectedSeatIdSet}
          venue={venue}
        />
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-1">
          <SeatDetailsPanel seat={activeSeat} />
          <SelectionSummary
            isLimitWarningVisible={isLimitWarningVisible}
            maxSelectedSeats={selection.maxSelectedSeats}
            onSeatRemove={handleSeatRemove}
            selectedSeats={selection.selectedSeats}
            subtotal={selection.subtotal}
          />
        </div>
      </section>
    </PageShell>
  );
}
