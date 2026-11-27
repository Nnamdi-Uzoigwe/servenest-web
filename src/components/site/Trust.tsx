const POINTS = [
  {
    title: "Technicians are approved before they take a job.",
    text: "A person at ServeNest reviews every application, ID and certificate. Until then, a technician cannot see or accept any job.",
  },
  {
    title: "Payments are checked on the server.",
    text: "A payment only counts once the backend has verified it with Paystack, so what a phone screen shows is never the proof.",
  },
  {
    title: "Every important admin action is recorded.",
    text: "Approvals, suspensions and payouts are written to an audit log, with who did it and when.",
  },
  {
    title: "People only see their own work.",
    text: "Customers see only their own bookings, and technicians see only the jobs assigned to them.",
  },
];

export function Trust() {
  return (
    <section className="bg-ink text-champagne">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <h2 className="max-w-md text-4xl font-bold leading-tight tracking-tight">
          Built so people can trust it
        </h2>

        <ul className="divide-y divide-ink-lift border-y border-ink-lift">
          {POINTS.map((point) => (
            <li key={point.title} className="py-6">
              <h3 className="text-xl font-semibold">{point.title}</h3>
              <p className="mt-2 max-w-xl text-champagne/75">{point.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}