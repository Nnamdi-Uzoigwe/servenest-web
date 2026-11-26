import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import type { MeResponse, StaffRole, User } from "@/lib/types";

export type StaffUser = User & { role: StaffRole };

export type SessionResult =
  | { ok: true; user: StaffUser }
  | { ok: false; reason: "signedOut" | "forbidden" | "unavailable" };

// Asks the API who the cookie belongs to. Cached for the length of one request.
export const getSession = cache(async (): Promise<SessionResult> => {
  try {
    const me = await api<MeResponse>("/auth/me");
    const role = me.user.role;

    if (role !== "admin" && role !== "dispatcher") return { ok: false, reason: "forbidden" };
    return { ok: true, user: { ...me.user, role } };
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) return { ok: false, reason: "signedOut" };
      if (err.status === 403) return { ok: false, reason: "forbidden" };
    }
    return { ok: false, reason: "unavailable" };
  }
});

const LOGIN_REASONS = {
  signedOut: "expired",
  forbidden: "forbidden",
  unavailable: "unavailable",
} as const;

// Call at the top of every dashboard page. Pass ["admin"] for admin only pages.
export async function requireUser(
  roles: readonly StaffRole[] = ["admin", "dispatcher"]
): Promise<StaffUser> {
  const session = await getSession();

  if (!session.ok) redirect(`/admin/login?reason=${LOGIN_REASONS[session.reason]}`);
  if (!roles.includes(session.user.role)) redirect("/admin");

  return session.user;
}