"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { logoutAction } from "@/app/admin/(dashboard)/actions";
import { UserAvatar } from "@/components/ui/UserAvatar";

interface AccountMenuProps {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export function AccountMenu({ name, email, role, avatarUrl }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on a click outside, or on Escape
  useEffect(() => {
    if (!open) return;

    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-11 items-center gap-2 rounded-control pl-1.5 pr-2.5 transition-colors hover:bg-champagne"
      >
        <UserAvatar name={name} url={avatarUrl} size={32} />
        <span className="hidden text-sm font-medium text-body sm:block">{name}</span>
        <ChevronDown className="size-4 text-muted" aria-hidden />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-2 w-64 rounded-panel border border-line bg-white p-2 shadow-md"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-body">{name}</p>
            <p className="truncate text-xs text-muted">{email}</p>
            <p className="mt-2 inline-block rounded-full bg-champagne px-2.5 py-0.5 text-xs font-medium capitalize text-ink">
              {role}
            </p>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              role="menuitem"
              className="flex h-11 w-full items-center gap-2 rounded-control px-3 text-sm font-medium text-danger transition-colors hover:bg-danger-soft"
            >
              <LogOut className="size-4" aria-hidden />
              Sign out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}