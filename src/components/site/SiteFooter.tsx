import Link from "next/link";
import { X_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-ink-deep text-champagne">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xl font-bold">ServeNest</p>
          <p className="mt-2 text-sm text-champagne/70">Home services, done properly.</p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <a href="#how-it-works" className="text-champagne/80 hover:text-champagne">
            How it works
          </a>
          <a href="#progress" className="text-champagne/80 hover:text-champagne">
            Progress
          </a>
          {X_URL ? (
            <a
              href={X_URL}
              target="_blank"
              rel="noreferrer"
              className="text-champagne/80 hover:text-champagne"
            >
              Follow on X
            </a>
          ) : null}
          <Link href="/admin" className="text-champagne/80 hover:text-champagne">
            Admin sign in
          </Link>
        </nav>
      </div>

      <div className="mx-auto max-w-6xl border-t border-ink px-6 py-5 text-xs text-champagne/60">
        &copy; {new Date().getFullYear()} ServeNest
      </div>
    </footer>
  );
}