import { memo, useCallback, useMemo, type KeyboardEvent, type MouseEvent, type FocusEvent } from "react";
import { formatCurrency } from "../lib/pricing";
import { isSeatSelectable, type NormalizedVenue, type NormalizedSeat } from "../lib/venue";

type SeatingMapProps = {
  activeSeatId: string | null;
  canSelectMore: boolean;
  isHeatMapEnabled: boolean;
  onHeatMapChange: () => void;
  onSeatFocus: (seat: NormalizedSeat) => void;
  onSeatToggle: (seat: NormalizedSeat) => void;
  selectedSeatIds: Set<string>;
  venue: NormalizedVenue;
};

type SeatMarkerProps = {
  isBlocked: boolean;
  isActive: boolean;
  isHeatMapEnabled: boolean;
  isSelected: boolean;
  seat: NormalizedSeat;
};

export function SeatingMap({
  activeSeatId,
  canSelectMore,
  isHeatMapEnabled,
  onHeatMapChange,
  onSeatFocus,
  onSeatToggle,
  selectedSeatIds,
  venue
}: SeatingMapProps) {
  const activeSeatIndex = useMemo(() => {
    if (!activeSeatId) {
      return 0;
    }

    const seatIndex = venue.seats.findIndex((seat) => seat.id === activeSeatId);
    return seatIndex >= 0 ? seatIndex : 0;
  }, [activeSeatId, venue.seats]);

  const focusSeat = useCallback(
    (seat: NormalizedSeat) => {
      onSeatFocus(seat);
      // Wait for React to commit the new roving tabIndex before moving DOM focus.
      requestAnimationFrame(() => {
        document.querySelector<SVGCircleElement>(`[data-seat-id="${seat.id}"]`)?.focus();
      });
    },
    [onSeatFocus]
  );

  const findEventSeat = useCallback(
    (eventTarget: EventTarget | null): NormalizedSeat | null => {
      if (!(eventTarget instanceof SVGElement)) {
        return null;
      }

      const seatId = eventTarget.dataset.seatId;
      return seatId ? (venue.seatsById.get(seatId) ?? null) : null;
    },
    [venue.seatsById]
  );

  const handleSeatClick = useCallback(
    (event: MouseEvent<SVGSVGElement>) => {
      const seat = findEventSeat(event.target);

      if (!seat) {
        return;
      }

      onSeatFocus(seat);
      onSeatToggle(seat);
    },
    [findEventSeat, onSeatFocus, onSeatToggle]
  );

  const handleSeatFocus = useCallback(
    (event: FocusEvent<SVGSVGElement>) => {
      const seat = findEventSeat(event.target);

      if (seat) {
        onSeatFocus(seat);
      }
    },
    [findEventSeat, onSeatFocus]
  );

  const handleSeatKeyDown = useCallback(
    (event: KeyboardEvent<SVGSVGElement>) => {
      const seat = findEventSeat(event.target);

      if (!seat) {
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSeatToggle(seat);
        return;
      }

      const nextSeatIndex = getNextSeatIndex(event.key, activeSeatIndex, venue.seats.length);

      if (nextSeatIndex === activeSeatIndex) {
        return;
      }

      const nextSeat = venue.seats[nextSeatIndex];

      if (!nextSeat) {
        return;
      }

      event.preventDefault();
      focusSeat(nextSeat);
    },
    [activeSeatIndex, findEventSeat, focusSeat, onSeatToggle, venue.seats]
  );

  return (
    <section
      className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
      aria-label={`${venue.fixture.name} seating map`}
    >
      <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600" aria-live="polite">
            {venue.seats.length.toLocaleString()} seats loaded. Use arrow keys to move focus across seats.
          </p>
          <p className="mt-1 text-xs text-slate-500">Blue seats are available; green seats are selected.</p>
        </div>
        <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input className="size-4 accent-slate-950" type="checkbox" checked={isHeatMapEnabled} onChange={onHeatMapChange} />
          <span>Price heat map</span>
        </label>
      </div>
      <div className="overflow-auto p-3 [-webkit-overflow-scrolling:touch] sm:p-4">
        <svg
          className="seat-map"
          role="img"
          viewBox={`0 0 ${venue.fixture.map.width} ${venue.fixture.map.height}`}
          aria-labelledby="seat-map-title seat-map-description"
          onClick={handleSeatClick}
          onFocus={handleSeatFocus}
          onKeyDown={handleSeatKeyDown}
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
              isBlocked={isSeatSelectable(seat.status) && !selectedSeatIds.has(seat.id) && !canSelectMore}
              isActive={activeSeatId === seat.id}
              isHeatMapEnabled={isHeatMapEnabled}
              isSelected={selectedSeatIds.has(seat.id)}
              seat={seat}
            />
          ))}
        </svg>
      </div>
      <div
        className="flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-200 px-4 py-3 text-sm text-slate-600"
        aria-label="Seat status legend"
      >
        <span className="inline-flex items-center gap-2">
          <span className="legend-dot available" />
          Available
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="legend-dot selected" />
          Selected
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="legend-dot held" />
          Held
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="legend-dot reserved" />
          Reserved
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="legend-dot sold" />
          Sold
        </span>
      </div>
    </section>
  );
}

const SeatMarker = memo(function SeatMarker({ isBlocked, isActive, isHeatMapEnabled, isSelected, seat }: SeatMarkerProps) {
  const isSelectable = isSeatSelectable(seat.status);
  const isDisabled = !isSelectable;
  const tabIndex = isActive ? 0 : -1;
  const limitClassName = isBlocked ? " limit-reached" : "";

  return (
    <circle
      tabIndex={tabIndex}
      role="button"
      data-seat-id={seat.id}
      aria-label={`${seat.sectionName}, row ${seat.row}, seat ${seat.number}, ${formatCurrency(seat.price)}, ${seat.status}${isBlocked ? ", selection limit reached" : ""}`}
      aria-pressed={isSelected}
      aria-disabled={isDisabled || isBlocked}
      className={`seat ${seat.status}${isSelected ? " selected" : ""}${isActive ? " active" : ""}${isHeatMapEnabled ? ` tier-${seat.priceTier}` : ""}${limitClassName}`}
      cx={seat.x}
      cy={seat.y}
      r={isActive ? 17 : 13}
    />
  );
});

function getNextSeatIndex(key: string, currentIndex: number, seatCount: number): number {
  if (seatCount === 0) {
    return currentIndex;
  }

  if (key === "ArrowRight" || key === "ArrowDown") {
    return Math.min(currentIndex + 1, seatCount - 1);
  }

  if (key === "ArrowLeft" || key === "ArrowUp") {
    return Math.max(currentIndex - 1, 0);
  }

  if (key === "Home") {
    return 0;
  }

  if (key === "End") {
    return seatCount - 1;
  }

  return currentIndex;
}
