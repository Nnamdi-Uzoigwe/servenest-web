import { NextResponse, type NextRequest } from "next/server";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  accessCookieOptions,
  refreshCookieOptions,
} from "@/lib/session-cookies";
import { refreshTokens } from "@/lib/refresh";

function redirectToLogin(request: NextRequest) {
  const target = request.nextUrl.pathname + request.nextUrl.search;
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  if (target !== "/admin") url.searchParams.set("next", target);
  return NextResponse.redirect(url);
}

// First line of defence for /admin. The pages still verify the session with the API themselves.
export async function proxy(request: NextRequest) {
  const isLogin = request.nextUrl.pathname === "/admin/login";
  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;

  if (access) return NextResponse.next();

  if (!refresh) return isLogin ? NextResponse.next() : redirectToLogin(request);

  const result = await refreshTokens(refresh);

  if (result.ok) {
    // Hand the new tokens to this request's pages, and to the browser
    request.cookies.set(ACCESS_COOKIE, result.tokens.accessToken);
    request.cookies.set(REFRESH_COOKIE, result.tokens.refreshToken);

    const response = NextResponse.next({ request });
    response.cookies.set(ACCESS_COOKIE, result.tokens.accessToken, accessCookieOptions);
    response.cookies.set(REFRESH_COOKIE, result.tokens.refreshToken, refreshCookieOptions);
    return response;
  }

  // The API is down: do not sign anyone out, the page reports the problem itself
  if (result.reason === "unavailable") return NextResponse.next();

  // The refresh token was rejected (expired, already used, or the account is suspended)
  const response = isLogin ? NextResponse.next() : redirectToLogin(request);
  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
}; 