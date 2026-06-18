import { formatCurrency } from "../lib/pricing";
import type { NormalizedSeat } from "../lib/venue";

type SelectionSummaryProps = {
  isLimitWarningVisible: boolean;
  maxSelectedSeats: number;
  onSeatRemove: (seatId: string) => void;
  selectedSeats: NormalizedSeat[];
  subtotal: number;
};

export function SelectionSummary({
  isLimitWarningVisible,
  maxSelectedSeats,
  onSeatRemove,
  selectedSeats,
  subtotal
}: SelectionSummaryProps) {
  const progressPercentage = (selectedSeats.length / maxSelectedSeats) * 100;

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Selected seats</h2>
          <p className="mt-1 text-sm text-slate-500">
            {selectedSeats.length} / {maxSelectedSeats} selected
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">{selectedSeats.length}</span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
        <div
          className="h-full rounded-full bg-emerald-500 transition-[width] duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      {isLimitWarningVisible ? (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900" role="status">
          Selection limit reached. Remove a seat before choosing another.
        </p>
      ) : null}
      {selectedSeats.length === 0 ? (
        <p className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
          No seats selected yet.
        </p>
      ) : (
        <ul className="mt-5 grid gap-3">
          {selectedSeats.map((seat) => (
            <li
              className="animate-selected-seat-item rounded-lg border border-emerald-100 bg-emerald-50 p-3 shadow-sm transition duration-200 hover:border-emerald-200"
              key={seat.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="block text-sm font-bold text-slate-950">
                    {seat.sectionName}, row {seat.row}, seat {seat.number}
                  </span>
                  <strong className="mt-1 block text-sm text-emerald-700">{formatCurrency(seat.price)}</strong>
                </div>
                <button
                  className="rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-xs font-bold text-emerald-700 transition hover:border-emerald-400 hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                  type="button"
                  aria-label={`Remove ${seat.sectionName}, row ${seat.row}, seat ${seat.number}`}
                  onClick={() => {
                    onSeatRemove(seat.id);
                  }}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-5 rounded-lg bg-slate-950 p-4 text-white">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-slate-300">Subtotal</span>
          <strong className="text-2xl font-black">{formatCurrency(subtotal)}</strong>
        </div>
      </div>
    </aside>
  );
}
