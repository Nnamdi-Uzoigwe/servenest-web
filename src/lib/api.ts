import "server-only";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { ACCESS_COOKIE } from "@/lib/session-cookies";

export type ApiErrorDetails = Record<string, string | string[]>;

export class ApiError extends Error {
  status: number;
  details?: ApiErrorDetails;

  constructor(status: number, message: string, details?: ApiErrorDetails) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

interface Envelope {
  success?: boolean;
  message?: string;
  data?: unknown;
  details?: ApiErrorDetails;
}

interface Options {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  // Set false for public endpoints such as login
  auth?: boolean;
  headers?: Record<string, string>;
}

// The only way server code talks to the backend API
export async function api<T = void>(path: string, opts: Options = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json", ...opts.headers };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";

  if (opts.auth !== false) {
    const token = (await cookies()).get(ACCESS_COOKIE)?.value;
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${env.API_URL}${path}`, {
      method: opts.method ?? "GET",
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new ApiError(0, "Cannot reach the server. Please try again in a moment.");
  }

  const json = (await res.json().catch(() => null)) as Envelope | null;

  if (!res.ok) {
    throw new ApiError(
      res.status,
      json?.message ?? "Something went wrong. Please try again.",
      json?.details
    );
  }

  return json?.data as T;
}