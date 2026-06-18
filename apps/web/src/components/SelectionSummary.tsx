import { formatCurrency } from "../lib/pricing";
import type { NormalizedSeat } from "../lib/venue";

type SelectionSummaryProps = {
  maxSelectedSeats: number;
  selectedSeats: NormalizedSeat[];
  subtotal: number;
};

export function SelectionSummary({ maxSelectedSeats, selectedSeats, subtotal }: SelectionSummaryProps) {
  return (
    <aside className="panel">
      <h2>Selected seats</h2>
      <p>
        {selectedSeats.length} of {maxSelectedSeats} selected
      </p>
      {selectedSeats.length === 0 ? (
        <p>No seats selected yet.</p>
      ) : (
        <ul className="selected-seat-list">
          {selectedSeats.map((seat) => (
            <li key={seat.id}>
              <span>
                {seat.sectionName}, row {seat.row}, seat {seat.number}
              </span>
              <strong>{formatCurrency(seat.price)}</strong>
            </li>
          ))}
        </ul>
      )}
      <div className="subtotal-row">
        <span>Subtotal</span>
        <strong>{formatCurrency(subtotal)}</strong>
      </div>
    </aside>
  );
}
