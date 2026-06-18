import { memo, useCallback, type KeyboardEvent } from "react";
import { formatCurrency } from "../lib/pricing";
import { isSeatSelectable, type NormalizedVenue, type NormalizedSeat } from "../lib/venue";

type SeatingMapProps = {
  activeSeatId: string | null;
  canSelectMore: boolean;
  onSeatFocus: (seat: NormalizedSeat) => void;
  onSeatToggle: (seat: NormalizedSeat) => void;
  selectedSeatIds: Set<string>;
  venue: NormalizedVenue;
};

type SeatMarkerProps = {
  canSelectMore: boolean;
  isActive: boolean;
  isSelected: boolean;
  onSeatFocus: (seat: NormalizedSeat) => void;
  onSeatToggle: (seat: NormalizedSeat) => void;
  seat: NormalizedSeat;
};

export function SeatingMap({
  activeSeatId,
  canSelectMore,
  onSeatFocus,
  onSeatToggle,
  selectedSeatIds,
  venue
}: SeatingMapProps) {
  return (
    <section className="map-panel" aria-label={`${venue.fixture.name} seating map`}>
      <div className="map-scroller">
        <svg
          className="seat-map"
          role="img"
          viewBox={`0 0 ${venue.fixture.map.width} ${venue.fixture.map.height}`}
          aria-labelledby="seat-map-title seat-map-description"
        >
          <title id="seat-map-title">{venue.fixture.name}</title>
          <desc id="seat-map-description">Interactive map of available, held, reserved, and sold event seats.</desc>
          <rect className="stage" x="270" y="42" width="360" height="70" rx="12" />
          <text className="stage-label" x="450" y="86" textAnchor="middle">
            Stage
          </text>
          {venue.fixture.sections.map((section) => (
            <text key={section.id} className="section-label" x={section.seats[0]?.x ?? 80} y={(section.seats[0]?.y ?? 0) - 38}>
              {section.name}
            </text>
          ))}
          {venue.seats.map((seat) => (
            <SeatMarker
              key={seat.id}
              canSelectMore={canSelectMore}
              isActive={activeSeatId === seat.id}
              isSelected={selectedSeatIds.has(seat.id)}
              onSeatFocus={onSeatFocus}
              onSeatToggle={onSeatToggle}
              seat={seat}
            />
          ))}
        </svg>
      </div>
      <div className="legend" aria-label="Seat status legend">
        <span><span className="legend-dot available" />Available</span>
        <span><span className="legend-dot selected" />Selected</span>
        <span><span className="legend-dot held" />Held</span>
        <span><span className="legend-dot reserved" />Reserved</span>
        <span><span className="legend-dot sold" />Sold</span>
      </div>
    </section>
  );
}

const SeatMarker = memo(function SeatMarker({
  canSelectMore,
  isActive,
  isSelected,
  onSeatFocus,
  onSeatToggle,
  seat
}: SeatMarkerProps) {
  const isSelectable = isSeatSelectable(seat.status);
  const isDisabled = !isSelectable;
  const isSelectionBlocked = isSelectable && !isSelected && !canSelectMore;

  const handleToggle = useCallback(() => {
    onSeatFocus(seat);
    onSeatToggle(seat);
  }, [onSeatFocus, onSeatToggle, seat]);

  const handleFocus = useCallback(() => {
    onSeatFocus(seat);
  }, [onSeatFocus, seat]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<SVGCircleElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleToggle();
      }
    },
    [handleToggle]
  );

  return (
    <circle
      tabIndex={0}
      role="button"
      aria-label={`${seat.sectionName}, row ${seat.row}, seat ${seat.number}, ${formatCurrency(seat.price)}, ${seat.status}`}
      aria-pressed={isSelected}
      aria-disabled={isDisabled || isSelectionBlocked}
      className={`seat ${seat.status}${isSelected ? " selected" : ""}${isActive ? " active" : ""}`}
      cx={seat.x}
      cy={seat.y}
      r="15"
      onClick={handleToggle}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
    />
  );
});
