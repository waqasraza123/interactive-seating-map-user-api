import { formatCurrency } from "../lib/pricing";
import type { NormalizedSeat } from "../lib/venue";

type SeatDetailsPanelProps = {
  seat: NormalizedSeat | null;
};

export function SeatDetailsPanel({ seat }: SeatDetailsPanelProps) {
  if (!seat) {
    return (
      <aside className="panel">
        <h2>Seat details</h2>
        <p>Click or focus a seat to view its section, row, price, and status.</p>
      </aside>
    );
  }

  return (
    <aside className="panel">
      <h2>Seat details</h2>
      <dl className="detail-list">
        <div>
          <dt>Section</dt>
          <dd>{seat.sectionName}</dd>
        </div>
        <div>
          <dt>Row</dt>
          <dd>{seat.row}</dd>
        </div>
        <div>
          <dt>Seat</dt>
          <dd>{seat.number}</dd>
        </div>
        <div>
          <dt>Price</dt>
          <dd>{formatCurrency(seat.price)}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{seat.status}</dd>
        </div>
      </dl>
    </aside>
  );
}
