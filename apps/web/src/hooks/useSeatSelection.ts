import { useCallback, useEffect, useMemo, useState } from "react";
import { readStoredSeatIds, writeStoredSeatIds } from "../lib/storage";
import { isSeatSelectable, type NormalizedSeat } from "../lib/venue";

const maxSelectedSeats = 8;

export type SeatSelectionState = {
  canSelectMore: boolean;
  maxSelectedSeats: number;
  removeSeat: (seatId: string) => void;
  selectedSeatIds: string[];
  selectedSeats: NormalizedSeat[];
  subtotal: number;
  toggleSeat: (seat: NormalizedSeat) => void;
};

export function useSeatSelection(seatsById: Map<string, NormalizedSeat>): SeatSelectionState {
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>(() => readStoredSeatIds());

  useEffect(() => {
    const restoredSeatIds = readStoredSeatIds().filter((seatId) => {
      const seat = seatsById.get(seatId);
      return seat ? isSeatSelectable(seat.status) : false;
    });

    setSelectedSeatIds(restoredSeatIds.slice(0, maxSelectedSeats));
  }, [seatsById]);

  useEffect(() => {
    writeStoredSeatIds(selectedSeatIds);
  }, [selectedSeatIds]);

  const selectedSeats = useMemo(
    () =>
      selectedSeatIds.flatMap((seatId) => {
        const seat = seatsById.get(seatId);
        return seat ? [seat] : [];
      }),
    [selectedSeatIds, seatsById]
  );

  const subtotal = useMemo(() => selectedSeats.reduce((total, seat) => total + seat.price, 0), [selectedSeats]);

  const removeSeat = useCallback((seatId: string) => {
    setSelectedSeatIds((currentSeatIds) => currentSeatIds.filter((currentSeatId) => currentSeatId !== seatId));
  }, []);

  const toggleSeat = useCallback((seat: NormalizedSeat) => {
    if (!isSeatSelectable(seat.status)) {
      return;
    }

    setSelectedSeatIds((currentSeatIds) => {
      if (currentSeatIds.includes(seat.id)) {
        return currentSeatIds.filter((seatId) => seatId !== seat.id);
      }

      if (currentSeatIds.length >= maxSelectedSeats) {
        return currentSeatIds;
      }

      return [...currentSeatIds, seat.id];
    });
  }, []);

  return {
    canSelectMore: selectedSeatIds.length < maxSelectedSeats,
    maxSelectedSeats,
    removeSeat,
    selectedSeatIds,
    selectedSeats,
    subtotal,
    toggleSeat
  };
}
