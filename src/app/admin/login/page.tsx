import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/admin/login/LoginForm";
import { safeNext } from "@/lib/safe-next";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Sign in" };

const NOTICES: Record<string, { tone: "error" | "info"; text: string }> = {
  signedout: { tone: "info", text: "You have been signed out." },
  expired: { tone: "info", text: "Your session ended. Please sign in again." },
  forbidden: { tone: "error", text: "This account cannot use the dashboard." },
  unavailable: {
    tone: "error",
    text: "We cannot reach the server right now. Try again in a moment.",
  },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reason?: string }>;
}) {
  const [{ next, reason }, session] = await Promise.all([searchParams, getSession()]);
  const target = safeNext(next);

  // Already signed in
  if (session.ok) redirect(target);

  return (
    <main className="grid min-h-dvh lg:grid-cols-[5fr_6fr]">
      <aside className="hidden flex-col justify-between bg-ink p-12 text-champagne lg:flex">
        <p className="text-lg font-semibold">ServeNest</p>

        <div>
          <h2 className="max-w-md text-4xl font-bold leading-tight tracking-tight">
            Run every job from one place.
          </h2>
          <p className="mt-4 max-w-md text-champagne/75">
            Review technicians, assign work and keep every booking moving.
          </p>
        </div>

        <p className="text-sm text-champagne/60">Staff access only</p>
      </aside>

      <section className="flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          <p className="text-lg font-semibold text-ink lg:hidden">ServeNest</p>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-ink lg:mt-0">Sign in</h1>
          <p className="mt-2 text-muted">Use your ServeNest staff account.</p>

          <div className="mt-8">
            <LoginForm next={target} notice={reason ? NOTICES[reason] : undefined} />
          </div>

          <Link
            href="/"
            className="mt-8 inline-block text-sm text-muted underline underline-offset-4 hover:text-ink"
          >
            Back to the site
          </Link>
        </div>
      </section>
    </main>
  );
}