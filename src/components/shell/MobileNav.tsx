"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLinks } from "@/components/shell/NavLinks";
import { Wordmark } from "@/components/shell/Wordmark";

export function MobileNav({ pendingCount }: { pendingCount: number }) {
  const [open, setOpen] = useState(false);

  // Escape closes the drawer, and the page behind it stops scrolling while it is open
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="grid size-11 place-items-center rounded-control text-ink hover:bg-champagne lg:hidden"
      >
        <Menu className="size-6" aria-hidden />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-deep/60" onClick={() => setOpen(false)} aria-hidden />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-ink p-5 text-champagne"
          >
            <div className="mb-8 flex items-start justify-between">
              <Wordmark />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid size-10 place-items-center rounded-control hover:bg-ink-lift"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <NavLinks pendingCount={pendingCount} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}