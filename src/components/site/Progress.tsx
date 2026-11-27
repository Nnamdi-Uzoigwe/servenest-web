import { buttonClasses } from "@/components/ui/Button";
import { X_URL } from "@/lib/site";

type Status = "built" | "next" | "later";

// Update the status of a phase here as the build moves forward
const PHASES: { title: string; status: Status; text: string }[] = [
  {
    title: "Foundation",
    status: "built",
    text: "Accounts and roles, onboarding for customers and technicians, email verification, technician approval and the admin dashboard.",
  },
  {
    title: "Core booking",
    status: "next",
    text: "The service catalogue, booking requests, quotes, booking history and booking management for your team.",
  },
  {
    title: "Technician operations",
    status: "later",
    text: "The technician dashboard, job assignment and acceptance, status updates, job photos and the dispatch screen.",
  },
  {
    title: "Payments and notifications",
    status: "later",
    text: "Paystack payments with server verification, earnings and payouts, push notifications and live updates.",
  },
  {
    title: "Advanced features",
    status: "later",
    text: "Technician location tracking, reviews, analytics, reports and final polish.",
  },
];

// Tailwind needs full class names written out, so each status lists its own
const STYLES: Record<Status, { label: string; rule: string; chip: string }> = {
  built: { label: "Built", rule: "border-ink", chip: "bg-success-soft text-success" },
  next: { label: "Next", rule: "border-brass", chip: "bg-warning-soft text-warning" },
  later: { label: "Later", rule: "border-line", chip: "bg-field text-muted" },
};

export function Progress() {
  return (
    <section id="progress" className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-ink">
              Where we are
            </h2>
            <p className="mt-4 max-w-xl text-lg text-muted">
              ServeNest is being built in public, one phase at a time. This is what is done and
              what comes next.
            </p>
          </div>

          {X_URL ? (
            <a
              href={X_URL}
              target="_blank"
              rel="noreferrer"
              className={buttonClasses({ variant: "primary", size: "sm" })}
            >
              Follow the build on X
            </a>
          ) : null}
        </div>

        <ol className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {PHASES.map((phase, i) => {
            const style = STYLES[phase.status];

            return (
              <li key={phase.title} className={`border-t-4 pt-5 ${style.rule}`}>
                <p className="text-sm text-muted">Phase {i + 1}</p>
                <h3 className="mt-1 text-lg font-semibold text-ink">{phase.title}</h3>
                <p className="mt-2 text-sm text-muted">{phase.text}</p>
                <span
                  className={`mt-4 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${style.chip}`}
                >
                  {style.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}