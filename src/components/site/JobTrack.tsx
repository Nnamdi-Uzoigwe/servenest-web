import type { CSSProperties } from "react";

// The six stages every job goes through, as defined in the product spec
const STOPS = ["Assigned", "Accepted", "On the way", "Arrived", "Work started", "Work completed"];

const order = (i: number) => ({ "--i": i }) as CSSProperties;

const dot =
  "job-dot relative z-10 size-4 shrink-0 rounded-full border-2 border-champagne bg-champagne";

export function JobTrack() {
  return (
    <>
      {/* Phones: a vertical track */}
      <ol aria-label="The six stages of every job" className="ml-1 md:hidden">
        {STOPS.map((label, i) => (
          <li
            key={label}
            style={order(i)}
            className="relative flex items-center gap-4 pb-6 last:pb-0"
          >
            <span className={dot} />
            {i < STOPS.length - 1 ? (
              <span
                className="job-line-y absolute bottom-0 left-1.75 top-4 w-0.5 origin-top bg-champagne"
                aria-hidden
              />
            ) : null}
            <span className="job-label text-base text-champagne">{label}</span>
          </li>
        ))}
      </ol>

      {/* Tablets and up: a horizontal track */}
      <ol aria-label="The six stages of every job" className="hidden md:grid md:grid-cols-6">
        {STOPS.map((label, i) => (
          <li key={label} style={order(i)}>
            <div className="flex items-center">
              <span className={dot} />
              {i < STOPS.length - 1 ? (
                <span className="job-line h-0.5 flex-1 origin-left bg-champagne" aria-hidden />
              ) : null}
            </div>
            <p className="job-label mt-3 pr-2 text-sm text-champagne">{label}</p>
          </li>
        ))}
      </ol>
    </>
  );
}