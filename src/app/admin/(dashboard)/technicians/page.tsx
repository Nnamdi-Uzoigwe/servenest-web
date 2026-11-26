import type { Metadata } from "next";
import clsx from "clsx";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Search } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusChip } from "@/components/ui/StatusChip";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { messageFor } from "@/lib/api-errors";
import { timeAgo } from "@/lib/format";
import { requireUser } from "@/lib/session";
import { getTechnicianStats, listTechnicians } from "@/lib/technicians";
import type {
  TechnicianApprovalStatus,
  TechnicianList,
  TechnicianListItem,
  TechnicianStats,
} from "@/lib/types";

export const metadata: Metadata = { title: "Technicians" };

const PAGE_SIZE = 15;
const STATUSES = ["pending", "approved", "rejected", "suspended"] as const;

const TABS: { key: TechnicianApprovalStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "suspended", label: "Suspended" },
];

// The same six columns for the header and every row, from tablets up
const GRID =
  "md:grid md:grid-cols-[minmax(0,2.4fr)_minmax(0,1.6fr)_minmax(0,1.4fr)_6.5rem_6rem_6.5rem] md:items-center md:justify-items-start md:gap-4";

interface LinkParams {
  status?: TechnicianApprovalStatus;
  q?: string;
  sort?: "newest" | "oldest";
  page?: number;
}

function href({ status, q, sort, page }: LinkParams) {
  const sp = new URLSearchParams();
  if (status) sp.set("status", status);
  if (q) sp.set("q", q);
  if (sort) sp.set("sort", sort);
  if (page && page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return `/admin/technicians${qs ? `?${qs}` : ""}`;
}

function pick(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function Row({ item }: { item: TechnicianListItem }) {
  const hasId = item.documents.some((doc) => doc.type === "id_card");
  const area = item.workingLocations[0];
  const moreAreas = item.workingLocations.length - 1;

  return (
    <li>
      <Link
        href={`/admin/technicians/${item._id}`}
        className={clsx("block px-5 py-4 transition-colors hover:bg-paper", GRID)}
      >
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar name={item.user.fullName} url={item.user.avatar?.url} size={40} />
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">{item.user.fullName}</p>
            <p className="truncate text-sm text-muted">{item.user.email}</p>
          </div>
        </div>

        <p className="mt-2 w-full truncate text-sm text-body md:mt-0">
          {item.specializations.join(", ")}
        </p>

        <p className="hidden w-full truncate text-sm text-muted md:block">
          {area ? `${area.city}, ${area.state}` : "No area"}
          {moreAreas > 0 ? ` +${moreAreas}` : ""}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 md:mt-0 md:contents">
          <span
            className={clsx(
              "rounded-full px-2.5 py-1 text-xs font-medium",
              hasId ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
            )}
          >
            {hasId ? "ID uploaded" : "No ID"}
          </span>
          <span className="hidden text-sm text-muted md:block">{timeAgo(item.createdAt)}</span>
          <StatusChip status={item.approvalStatus} />
        </div>
      </Link>
    </li>
  );
}

export default async function TechniciansPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireUser();
  const sp = await searchParams;

  const status = STATUSES.find((s) => s === pick(sp.status));
  const q = pick(sp.q)?.trim().slice(0, 100) || undefined;
  const page = Math.max(1, Math.floor(Number(pick(sp.page))) || 1);

  const requested = pick(sp.sort);
  const explicitSort = requested === "oldest" || requested === "newest" ? requested : undefined;
  // The pending tab is a queue, so the longest waiting application comes first
  const sort = explicitSort ?? (status === "pending" ? "oldest" : "newest");

  let stats: TechnicianStats | null = null;
  let list: TechnicianList | null = null;
  let error = "";

  try {
    [stats, list] = await Promise.all([
      getTechnicianStats(),
      listTechnicians({ status, search: q, sort, page, limit: PAGE_SIZE }),
    ]);
  } catch (err) {
    error = messageFor(err);
  }

  // The page number was past the end, for example after the last item on it was decided
  if (list && list.items.length === 0 && page > 1) {
    redirect(href({ status, q, sort: explicitSort, page: 1 }));
  }

  const total = list?.pagination.total ?? 0;
  const pages = list?.pagination.pages ?? 1;
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const otherSort = sort === "oldest" ? "newest" : "oldest";

  return (
    <div className="space-y-6">
      <PageHeader title="Technicians" description="Review applications and manage accounts." />

      {error ? <Notice>{error}</Notice> : null}

      {stats && list ? (
        <>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line">
            <nav aria-label="Filter by status" className="-mb-px flex gap-1 overflow-x-auto">
              {TABS.map((tab) => {
                const active = (tab.key === "all" && !status) || tab.key === status;
                const count = stats[tab.key === "all" ? "total" : tab.key];

                return (
                  <Link
                    key={tab.key}
                    href={href({
                      status: tab.key === "all" ? undefined : tab.key,
                      q,
                      sort: explicitSort,
                    })}
                    aria-current={active ? "page" : undefined}
                    className={clsx(
                      "flex items-center gap-2 whitespace-nowrap border-b-2 px-3 pb-3 text-sm font-medium transition-colors",
                      active
                        ? "border-ink text-ink"
                        : "border-transparent text-muted hover:text-ink"
                    )}
                  >
                    {tab.label}
                    <span
                      className={clsx(
                        "rounded-full px-2 py-0.5 text-xs",
                        active ? "bg-ink text-champagne" : "bg-field text-muted"
                      )}
                    >
                      {count}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <form action="/admin/technicians" method="get" className="mb-3 flex gap-2">
              {status ? <input type="hidden" name="status" value={status} /> : null}
              {explicitSort ? <input type="hidden" name="sort" value={explicitSort} /> : null}

              <label htmlFor="search" className="sr-only">
                Search technicians
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle"
                  aria-hidden
                />
                <input
                  id="search"
                  name="q"
                  type="search"
                  defaultValue={q}
                  placeholder="Name, email or phone"
                  className="h-10 w-56 rounded-control border-2 border-transparent bg-field pl-9 pr-3 text-sm outline-none placeholder:text-subtle focus:border-ink focus:bg-white sm:w-64"
                />
              </div>
              <button type="submit" className={buttonClasses({ variant: "primary", size: "sm" })}>
                Search
              </button>
            </form>
          </div>

          {list.items.length > 0 ? (
            <>
              <div className="flex items-center justify-between text-sm text-muted">
                <p>
                  {total} {total === 1 ? "technician" : "technicians"}
                  {q ? ` matching "${q}"` : ""}
                </p>
                <Link
                  href={href({ status, q, sort: otherSort })}
                  className="font-medium text-ink underline underline-offset-4"
                >
                  {sort === "oldest" ? "Show newest first" : "Show oldest first"}
                </Link>
              </div>

              <section className="overflow-hidden rounded-panel border border-line bg-white">
                <div
                  className={clsx(
                    "hidden border-b border-line bg-paper px-5 py-3 text-xs font-medium text-muted",
                    GRID
                  )}
                >
                  <span>Technician</span>
                  <span>Services</span>
                  <span>Areas</span>
                  <span>Documents</span>
                  <span>Applied</span>
                  <span>Status</span>
                </div>

                <ul className="divide-y divide-line">
                  {list.items.map((item) => (
                    <Row key={item._id} item={item} />
                  ))}
                </ul>
              </section>

              {pages > 1 ? (
                <nav aria-label="Pagination" className="flex items-center justify-between">
                  <p className="text-sm text-muted">
                    Showing {from} to {to} of {total}
                  </p>
                  <div className="flex gap-2">
                    {page > 1 ? (
                      <Link
                        href={href({ status, q, sort: explicitSort, page: page - 1 })}
                        className={buttonClasses({ variant: "outline", size: "sm" })}
                      >
                        Previous
                      </Link>
                    ) : null}
                    {page < pages ? (
                      <Link
                        href={href({ status, q, sort: explicitSort, page: page + 1 })}
                        className={buttonClasses({ variant: "outline", size: "sm" })}
                      >
                        Next
                      </Link>
                    ) : null}
                  </div>
                </nav>
              ) : null}
            </>
          ) : stats.total === 0 ? (
            <div className="rounded-panel border border-line px-6 py-14">
              <p className="font-semibold text-ink">No technicians yet</p>
              <p className="mt-1 max-w-md text-sm text-muted">
                Applications appear here once technicians sign up in the mobile app.
              </p>
            </div>
          ) : (
            <div className="rounded-panel border border-line px-6 py-14">
              <p className="font-semibold text-ink">No technicians match</p>
              <p className="mt-1 max-w-md text-sm text-muted">
                Try a different name, email or phone number, or look at another status.
              </p>
              <Link
                href="/admin/technicians"
                className="mt-4 inline-block text-sm font-semibold text-ink underline underline-offset-4"
              >
                Clear filters
              </Link>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}