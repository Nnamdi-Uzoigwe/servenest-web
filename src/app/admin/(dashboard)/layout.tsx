import { AccountMenu } from "@/components/shell/AccountMenu";
import { MobileNav } from "@/components/shell/MobileNav";
import { NavLinks } from "@/components/shell/NavLinks";
import { Wordmark } from "@/components/shell/Wordmark";
import { requireUser } from "@/lib/session";
import { getTechnicianStats } from "@/lib/technicians";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // The badge is a nice to have, so a failed request just hides it
  const [user, pending] = await Promise.all([
    requireUser(),
    getTechnicianStats()
      .then((stats) => stats.pending)
      .catch(() => 0),
  ]);

  return (
    <div className="min-h-dvh bg-white lg:pl-64">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-ink focus:px-4 focus:py-2 focus:text-champagne"
      >
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-ink p-5 text-champagne lg:flex">
        <Wordmark />

        <div className="mt-10">
          <NavLinks pendingCount={pending} />
        </div>

        <p className="mt-auto text-xs text-champagne/60">
          Signed in as {user.role === "admin" ? "an administrator" : "a dispatcher"}
        </p>
      </aside>

      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur sm:px-8">
        <div className="flex items-center gap-2">
          <MobileNav pendingCount={pending} />
          <span className="text-lg font-bold text-ink lg:hidden">ServeNest</span>
        </div>

        <AccountMenu
          name={user.fullName}
          email={user.email}
          role={user.role}
          avatarUrl={user.avatar?.url}
        />
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        {children}
      </main>
    </div>
  );
}