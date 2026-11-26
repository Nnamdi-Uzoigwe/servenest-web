"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/components/shell/nav";

interface NavLinksProps {
  pendingCount: number;
  // Lets the phone drawer close itself when a link is chosen
  onNavigate?: () => void;
}

export function NavLinks({ pendingCount, onNavigate }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="space-y-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        const badge = href === "/admin/technicians" ? pendingCount : 0;

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "flex h-11 items-center gap-3 rounded-control px-3 text-sm font-medium transition-colors",
              active
                ? "bg-champagne text-ink"
                : "text-champagne/80 hover:bg-ink-lift hover:text-champagne"
            )}
          >
            <Icon className="size-5 shrink-0" aria-hidden />
            <span className="flex-1">{label}</span>
            {badge > 0 ? (
              <span
                aria-label={`${badge} pending`}
                className={clsx(
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  active ? "bg-ink text-champagne" : "bg-champagne text-ink"
                )}
              >
                {badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}