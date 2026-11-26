import clsx from "clsx";
import type { TechnicianApprovalStatus } from "@/lib/types";

// Tailwind needs full class names written out, so each status lists its own
export const statusStyles: Record<
  TechnicianApprovalStatus,
  { label: string; chip: string; dot: string }
> = {
  pending: { label: "Pending", chip: "bg-warning-soft text-warning", dot: "bg-warning" },
  approved: { label: "Approved", chip: "bg-success-soft text-success", dot: "bg-success" },
  rejected: { label: "Rejected", chip: "bg-danger-soft text-danger", dot: "bg-danger" },
  suspended: { label: "Suspended", chip: "bg-champagne text-ink", dot: "bg-brass" },
};

export function StatusChip({ status }: { status: TechnicianApprovalStatus }) {
  const style = statusStyles[status];

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        style.chip
      )}
    >
      <span className={clsx("size-1.5 rounded-full", style.dot)} aria-hidden />
      {style.label}
    </span>
  );
}