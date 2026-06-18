import { formatCurrency } from "../lib/pricing";
import type { NormalizedSeat } from "../lib/venue";

type SeatDetailsPanelProps = {
  seat: NormalizedSeat | null;
};

export function SeatDetailsPanel({ seat }: SeatDetailsPanelProps) {
  if (!seat) {
    return (
      <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Seat details</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">Click or focus a seat to view its section, row, price, and status.</p>
      </aside>
    );
  }

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Seat details</h2>
          <p className="mt-1 text-sm text-slate-500">Focused seat</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold capitalize text-slate-700">{seat.status}</span>
      </div>
      <dl className="mt-5 grid gap-3">
        <DetailRow label="Section" value={seat.sectionName} />
        <DetailRow label="Row" value={seat.row} />
        <DetailRow label="Seat" value={String(seat.number)} />
        <DetailRow label="Price" value={formatCurrency(seat.price)} />
      </dl>
    </aside>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="m-0 text-sm font-bold text-slate-950">{value}</dd>
    </div>
  );
}
