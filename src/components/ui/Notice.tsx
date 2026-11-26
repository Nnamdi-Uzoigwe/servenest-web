import clsx from "clsx";
import { CircleAlert, Info, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

type Tone = "error" | "info" | "warning";

const STYLES = {
  error: { box: "bg-danger-soft text-danger", Icon: CircleAlert },
  info: { box: "bg-champagne text-ink", Icon: Info },
  warning: { box: "bg-warning-soft text-warning", Icon: TriangleAlert },
} as const;

interface NoticeProps {
  tone?: Tone;
  children: ReactNode;
}

export function Notice({ tone = "error", children }: NoticeProps) {
  const { box, Icon } = STYLES[tone];

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={clsx("flex items-start gap-2.5 rounded-control px-4 py-3 text-sm", box)}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p>{children}</p>
    </div>
  );
}