const STEPS = [
  {
    title: "Request",
    text: "A customer picks a service, describes the problem, adds photos and chooses a time.",
  },
  {
    title: "Quote",
    text: "Your team reviews the request and sends a priced quote. The customer accepts or declines it.",
  },
  {
    title: "Payment",
    text: "The customer pays through Paystack. The payment is verified on the server before the job is confirmed.",
  },
  {
    title: "Assignment",
    text: "A dispatcher assigns an available, approved technician. Double bookings are blocked.",
  },
  {
    title: "The job",
    text: "The technician accepts, heads out, arrives, starts and finishes, and the customer sees each change as it happens.",
  },
  {
    title: "Proof",
    text: "Before and after photos and notes are attached to the job, so your team can review the work.",
  },
  {
    title: "Review",
    text: "The customer rates the technician and leaves feedback. Payouts go through admin approval.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-12 lg:self-start">
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-ink">
            How a job works
          </h2>
          <p className="mt-4 max-w-md text-lg text-muted">
            From the first request to the final review, the customer, the technician and your team
            all follow the same job.
          </p>
          <p className="mt-4 max-w-md text-sm text-muted">
            Some of these stages are still being built.{" "}
            <a href="#progress" className="font-medium text-ink underline underline-offset-4">
              See where we are.
            </a>
          </p>
        </div>

        <ol>
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative flex gap-5 pb-10 last:pb-0">
              {i < STEPS.length - 1 ? (
                <span className="absolute bottom-0 left-4.75 top-10 w-0.5 bg-line" aria-hidden />
              ) : null}

              <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full bg-ink text-sm font-semibold text-champagne">
                {i + 1}
              </span>

              <div className="pt-1.5">
                <h3 className="text-xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-1 max-w-xl text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}