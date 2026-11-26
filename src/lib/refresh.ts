// No "server-only" here: the proxy imports this file too
import type { AuthTokens } from "@/lib/types";

export type RefreshResult =
  | { ok: true; tokens: AuthTokens }
  | { ok: false; reason: "rejected" | "unavailable" };

const REUSE_MS = 15_000;
const results = new Map<string, Promise<RefreshResult>>();

async function callRefresh(refreshToken: string): Promise<RefreshResult> {
  const base = process.env.API_URL?.replace(/\/+$/, "");
  if (!base) return { ok: false, reason: "unavailable" };

  try {
    const res = await fetch(`${base}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok) {
      const json = (await res.json()) as { data?: { tokens?: AuthTokens } };
      const tokens = json.data?.tokens;
      if (tokens?.accessToken && tokens.refreshToken) return { ok: true, tokens };
      return { ok: false, reason: "unavailable" };
    }

    // Only a definite rejection ends the session
    if (res.status === 401 || res.status === 403) return { ok: false, reason: "rejected" };
    return { ok: false, reason: "unavailable" };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}

// The API accepts each refresh token once. A page load fires several requests at the same time,
// and all of them carry the same old cookie, so they share one refresh call and its result.
export function refreshTokens(refreshToken: string): Promise<RefreshResult> {
  const existing = results.get(refreshToken);
  if (existing) return existing;

  const promise = callRefresh(refreshToken);
  results.set(refreshToken, promise);

  // A failed attempt because the API is down should not be remembered
  void promise.then((r) => {
    if (!r.ok && r.reason === "unavailable") results.delete(refreshToken);
  });

  const timer = setTimeout(() => results.delete(refreshToken), REUSE_MS) as unknown as {
    unref?: () => void;
  };
  timer.unref?.();

  return promise;
}