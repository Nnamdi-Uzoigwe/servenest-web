import clsx from "clsx";
import { CircleAlert, Info } from "lucide-react";
import type { ReactNode } from "react";

interface NoticeProps {
  tone?: "error" | "info";
  children: ReactNode;
}

export function Notice({ tone = "error", children }: NoticeProps) {
  const Icon = tone === "error" ? CircleAlert : Info;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={clsx(
        "flex items-start gap-2.5 rounded-control px-4 py-3 text-sm",
        tone === "error" ? "bg-danger-soft text-danger" : "bg-champagne text-ink"
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p>{children}</p>
    </div>
  );
}