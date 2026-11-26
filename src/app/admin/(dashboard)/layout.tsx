import { logoutAction } from "@/app/admin/(dashboard)/actions";
import { requireUser } from "@/lib/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="min-h-dvh bg-white">
      <header className="flex items-center justify-between bg-ink px-6 py-3 text-champagne">
        <span className="font-semibold">ServeNest Admin</span>

        <div className="flex items-center gap-4 text-sm">
          <span>
            {user.fullName} <span className="text-champagne/70">({user.role})</span>
          </span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-control bg-champagne px-4 py-2 font-semibold text-ink transition-colors hover:bg-champagne-deep"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {children}
    </div>
  );
}