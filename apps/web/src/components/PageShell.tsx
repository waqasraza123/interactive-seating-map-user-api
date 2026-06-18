import type { ReactNode } from "react";
import type { VenueSource } from "../hooks/useVenue";

type PageShellProps = {
  children: ReactNode;
  venueSource: VenueSource;
};

export function PageShell({ children, venueSource }: PageShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-5 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1500px] gap-6">
        <header className="max-w-4xl">
          <p className="mb-2 text-sm font-bold uppercase tracking-normal text-slate-500">Take-home assignment</p>
          <h1 className="text-4xl font-black leading-none text-slate-950 sm:text-5xl">Interactive seating map</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Select up to 8 available seats from the venue map.</p>
          <nav className="mt-5 flex flex-wrap gap-2" aria-label="Venue fixture switcher">
            <a
              className={venueSource === "sample" ? activeLinkClassName : inactiveLinkClassName}
              aria-current={venueSource === "sample" ? "page" : undefined}
              href="/"
            >
              Sample venue
            </a>
            <a
              className={venueSource === "large" ? activeLinkClassName : inactiveLinkClassName}
              aria-current={venueSource === "large" ? "page" : undefined}
              href="/?venue=large"
            >
              Large venue
            </a>
          </nav>
        </header>
        {children}
      </div>
    </main>
  );
}

const baseLinkClassName =
  "inline-flex rounded-full border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950";
const activeLinkClassName = `${baseLinkClassName} border-slate-950 bg-slate-950 text-white shadow-sm`;
const inactiveLinkClassName = `${baseLinkClassName} border-slate-300 bg-white text-slate-700 hover:border-slate-500 hover:text-slate-950`;
