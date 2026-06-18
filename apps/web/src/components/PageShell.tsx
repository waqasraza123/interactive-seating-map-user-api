import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <main className="page-shell">
      <header className="page-header">
        <p className="eyebrow">Take-home assignment</p>
        <h1>Interactive seating map</h1>
        <p>Select up to 8 available seats from the venue map.</p>
      </header>
      {children}
    </main>
  );
}
