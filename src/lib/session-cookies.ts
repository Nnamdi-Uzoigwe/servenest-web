// No "server-only" here: the proxy imports this file too

export const ACCESS_COOKIE = "sn_access";
export const REFRESH_COOKIE = "sn_refresh";

const secure = process.env.NODE_ENV === "production";

// The API's access token lives 15 minutes, so the cookie expires a minute earlier
// and the proxy swaps it for a fresh one before the API would reject it.
// The refresh cookie matches REFRESH_TOKEN_DAYS (30) in the backend.
export const accessCookieOptions = {
  httpOnly: true,
  secure,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 14 * 60,
};

export const refreshCookieOptions = {
  httpOnly: true,
  secure,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 30 * 24 * 60 * 60,
};