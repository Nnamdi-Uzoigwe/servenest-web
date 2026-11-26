import type { Metadata } from "next";
import clsx from "clsx";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { statusStyles } from "@/components/ui/StatusChip";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { messageFor } from "@/lib/api-errors";
import { timeAgo } from "@/lib/format";
import { requireUser } from "@/lib/session";
import { getTechnicianStats, listTechnicians } from "@/lib/technicians";
import type {
  TechnicianApprovalStatus,
  TechnicianListItem,
  TechnicianStats,
} from "@/lib/types";

export const metadata: Metadata = { title: "Overview" };

const LEDGER: {
  key: TechnicianApprovalStatus | "total";
  label: string;
  href: string;
}[] = [
  { key: "pending", label: "Pending", href: "/admin/technicians?status=pending" },
  { key: "approved", label: "Approved", href: "/admin/technicians?status=approved" },
  { key: "rejected", label: "Rejected", href: "/admin/technicians?status=rejected" },
  { key: "suspended", label: "Suspended", href: "/admin/technicians?status=suspended" },
  { key: "total", label: "All technicians", href: "/admin/technicians" },
];

function Ledger({ stats }: { stats: TechnicianStats }) {
  return (
    <section
      aria-label="Technicians by status"
      className="grid grid-cols-2 gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-5"
    >
      {LEDGER.map((item) => {
        const value = stats[item.key];
        const dot = item.key === "total" ? null : statusStyles[item.key].dot;

        return (
          <Link
            key={item.key}
            href={item.href}
            className={clsx(
              "bg-white px-5 py-4 transition-colors hover:bg-paper",
              item.key === "total" && "col-span-2 sm:col-span-1"
            )}
          >
            <p className="flex items-center gap-2 text-sm text-muted">
              {dot ? <span className={clsx("size-2 rounded-full", dot)} aria-hidden /> : null}
              {item.label}
            </p>
            <p
              className={clsx(
                "mt-1 text-3xl font-bold tracking-tight",
                item.key === "pending" && value > 0 ? "text-warning" : "text-ink"
              )}
            >
              {value}
            </p>
          </Link>
        );
      })}
    </section>
  );
}

function QueueRow({ item }: { item: TechnicianListItem }) {
  const hasId = item.documents.some((doc) => doc.type === "id_card");
  const firstArea = item.workingLocations[0];
  const moreAreas = item.workingLocations.length - 1;

  return (
    <li>
      <Link
        href={`/admin/technicians/${item._id}`}
        className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-paper"
      >
        <UserAvatar name={item.user.fullName} url={item.user.avatar?.url} size={44} />

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-ink">{item.user.fullName}</p>
          <p className="truncate text-sm text-muted">{item.specializations.join(", ")}</p>
          <p className="truncate text-sm text-subtle">
            {firstArea ? `${firstArea.city}, ${firstArea.state}` : "No area added"}
            {moreAreas > 0 ? ` and ${moreAreas} more` : ""}
          </p>
        </div>

        <div className="hidden text-right sm:block">
          <span
            className={clsx(
              "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
              hasId ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
            )}
          >
            {hasId ? "ID uploaded" : "No ID yet"}
          </span>
          <p className="mt-1 text-xs text-subtle">Applied {timeAgo(item.createdAt)}</p>
        </div>

        <ChevronRight className="size-5 shrink-0 text-subtle" aria-hidden />
      </Link>
    </li>
  );
}

function Queue({ items, total }: { items: TechnicianListItem[]; total: number }) {
  return (
    <section
      aria-labelledby="queue-title"
      className="overflow-hidden rounded-panel border border-line bg-white"
    >
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <div>
          <h2 id="queue-title" className="text-lg font-semibold text-ink">
            Waiting for review
          </h2>
          <p className="text-sm text-muted">
            {total === 0
              ? "Nothing is waiting right now."
              : `${total} ${total === 1 ? "application needs" : "applications need"} a decision.`}
          </p>
        </div>

        {total > 0 ? (
          <Link
            href="/admin/technicians?status=pending"
            className="text-sm font-semibold text-ink underline underline-offset-4"
          >
            View all
          </Link>
        ) : null}
      </div>

      {items.length > 0 ? (
        <ul className="divide-y divide-line">
          {items.map((item) => (
            <QueueRow key={item._id} item={item} />
          ))}
        </ul>
      ) : (
        <div className="px-5 py-12">
          <p className="font-semibold text-ink">All caught up</p>
          <p className="mt-1 max-w-md text-sm text-muted">
            New technician applications will show up here as soon as someone submits one.
          </p>
        </div>
      )}
    </section>
  );
}

export default async function DashboardHome() {
  // A layout does not run again when you move between pages, so every page checks for itself
  const user = await requireUser();

  let stats: TechnicianStats | null = null;
  let pending: TechnicianListItem[] = [];
  let error = "";

  try {
    const [s, list] = await Promise.all([
      getTechnicianStats(),
      listTechnicians({ status: "pending", limit: 5 }),
    ]);
    stats = s;
    pending = list.items;
  } catch (err) {
    error = messageFor(err);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user.fullName.split(" ")[0]}`}
        description="Here is what needs your attention."
      />

      {error ? <Notice>{error}</Notice> : null}

      {stats ? (
        <>
          <Ledger stats={stats} />
          <Queue items={pending} total={stats.pending} />
        </>
      ) : null}
    </div>
  );
}