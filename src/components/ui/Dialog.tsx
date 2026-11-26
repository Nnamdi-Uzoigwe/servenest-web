"use client";

import clsx from "clsx";
import { useEffect, useRef, type ReactNode } from "react";

const SIZES = { md: "max-w-lg", lg: "max-w-4xl" } as const;

interface DialogProps {
  open: boolean;
  onClose: () => void;
  label: string;
  size?: keyof typeof SIZES;
  children: ReactNode;
}

// Built on the browser's own dialog element, which already traps focus and closes on Escape.
// Children are only mounted while it is open, so forms inside start fresh each time.
export function Dialog({ open, onClose, label, size = "md", children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onClick={(e) => {
        // A click on the dimmed area is a click on the dialog element itself
        if (e.target === e.currentTarget) onClose();
      }}
      className={clsx(
        "m-auto max-h-[90dvh] w-[calc(100%-2rem)] overflow-auto rounded-sheet bg-white p-0 text-body backdrop:bg-ink-deep/60",
        SIZES[size]
      )}
    >
      {open ? children : null}
    </dialog>
  );
}