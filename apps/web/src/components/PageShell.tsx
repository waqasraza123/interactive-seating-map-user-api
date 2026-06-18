import type { ReactNode } from "react";
import type { VenueSource } from "../hooks/useVenue";

type PageShellProps = {
  children: ReactNode;
  venueSource: VenueSource;
};

export function PageShell({ children, venueSource }: PageShellProps) {
  return (
    <main className="page-shell">
      <header className="page-header">
        <p className="eyebrow">Take-home assignment</p>
        <h1>Interactive seating map</h1>
        <p>Select up to 8 available seats from the venue map.</p>
        <nav className="venue-switcher" aria-label="Venue fixture switcher">
          <a aria-current={venueSource === "sample" ? "page" : undefined} href="/">
            Sample venue
          </a>
          <a aria-current={venueSource === "large" ? "page" : undefined} href="/?venue=large">
            Large venue
          </a>
        </nav>
      </header>
      {children}
    </main>
  );
}
