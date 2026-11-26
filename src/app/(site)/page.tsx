import Link from "next/link";
import { env } from "@/lib/env";

async function checkApi(): Promise<{ ok: boolean; detail: string }> {
  try {
    const res = await fetch(`${env.API_URL}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return { ok: false, detail: `The API answered with HTTP ${res.status}` };

    const json = (await res.json()) as { db?: string };
    return json.db === "connected"
      ? { ok: true, detail: "API reachable, database connected" }
      : { ok: false, detail: "API reachable, but the database is not connected" };
  } catch {
    return { ok: false, detail: "Cannot reach the API. Is the backend running?" };
  }
}

// Tailwind needs full class names written out, so each swatch lists its own
const swatches = [
  { name: "ink", className: "bg-ink" },
  { name: "ink-deep", className: "bg-ink-deep" },
  { name: "ink-lift", className: "bg-ink-lift" },
  { name: "champagne", className: "bg-champagne" },
  { name: "champagne-deep", className: "bg-champagne-deep" },
  { name: "paper", className: "bg-paper border border-line" },
  { name: "field", className: "bg-field" },
  { name: "brass", className: "bg-brass" },
];

const linkClass =
  "inline-flex h-11 items-center rounded-control bg-champagne px-5 text-sm font-semibold text-ink hover:bg-champagne-deep";

export default async function SetupCheck() {
  const api = await checkApi();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-lg font-semibold text-ink">ServeNest</p>
      <h1 className="mt-6 text-5xl font-bold tracking-tight text-ink">Setup check</h1>
      <p className="mt-3 max-w-xl text-muted">
        This page is temporary. It confirms the theme, the font and the connection to the API.
        The landing page replaces it in step 8e.
      </p>

      <span
        className={`mt-6 inline-flex rounded-full px-4 py-1.5 text-sm font-medium ${
          api.ok ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
        }`}
      >
        {api.detail}
      </span>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Type (Poppins only)</h2>
        <div className="mt-4 space-y-2 border-l-2 border-champagne-deep pl-5">
          <p className="text-4xl font-bold tracking-tight">Home services, done properly.</p>
          <p className="text-2xl font-semibold">Technician approvals</p>
          <p className="text-base">Body text at the regular weight for reading.</p>
          <p className="text-sm text-muted">Small supporting text in the muted color.</p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Colors</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {swatches.map((s) => (
            <div key={s.name}>
              <div className={`h-16 rounded-panel ${s.className}`} />
              <p className="mt-2 text-sm text-muted">{s.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Routes</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin" className={linkClass}>
            /admin
          </Link>
          <Link href="/admin/login" className={linkClass}>
            /admin/login
          </Link>
          <Link href="/admin/technicians" className={linkClass}>
            /admin/technicians
          </Link>
        </div>
      </section>
    </main>
  );
}