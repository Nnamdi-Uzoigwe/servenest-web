import clsx from "clsx";
import { formatDateTime } from "@/lib/format";
import type { AuditLogItem } from "@/lib/types";

const ACTIONS: Record<string, { label: string; dot: string }> = {
  "technician.approved": { label: "Approved", dot: "bg-success" },
  "technician.rejected": { label: "Rejected", dot: "bg-danger" },
  "technician.suspended": { label: "Suspended", dot: "bg-brass" },
  "technician.reactivated": { label: "Reactivated", dot: "bg-success" },
  "technician.resubmitted": { label: "Resubmitted the application", dot: "bg-warning" },
};

interface Event {
  id: string;
  label: string;
  dot: string;
  by: string;
  at: string;
  reason?: string;
}

export function History({ items, appliedAt }: { items: AuditLogItem[]; appliedAt: string }) {
  // The API returns newest first, and the application itself is the oldest event
  const events: Event[] = [
    ...items.map((item) => ({
      id: item._id,
      label: ACTIONS[item.action]?.label ?? item.action,
      dot: ACTIONS[item.action]?.dot ?? "bg-subtle",
      by: item.actor?.fullName ?? "Unknown",
      at: item.createdAt,
      reason: item.metadata?.reason,
    })),
    { id: "applied", label: "Applied", dot: "bg-subtle", by: "the technician", at: appliedAt },
  ];

  return (
    <ol>
      {events.map((event, i) => (
        <li key={event.id} className="relative pb-6 pl-7 last:pb-0">
          {i < events.length - 1 ? (
            <span className="absolute bottom-0 left-1.25 top-5 w-0.5 bg-line" aria-hidden />
          ) : null}
          <span
            className={clsx("absolute left-0 top-1.5 size-3 rounded-full", event.dot)}
            aria-hidden
          />

          <p className="text-body">
            <span className="font-medium text-ink">{event.label}</span>{" "}
            <span className="text-muted">by {event.by}</span>
          </p>
          <p className="text-sm text-subtle">{formatDateTime(event.at)}</p>

          {event.reason ? (
            <blockquote className="mt-2 border-l-2 border-champagne-deep pl-3 text-sm text-body">
              {event.reason}
            </blockquote>
          ) : null}
        </li>
      ))}
    </ol>
  );
}