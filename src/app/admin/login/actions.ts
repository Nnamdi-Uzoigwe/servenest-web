"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { api, ApiError } from "@/lib/api";
import { safeNext } from "@/lib/safe-next";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  accessCookieOptions,
  refreshCookieOptions,
} from "@/lib/session-cookies";
import type { AuthResponse } from "@/lib/types";

export interface LoginState {
  error?: string;
  fieldErrors?: { email?: string; password?: string };
  email?: string;
}

const schema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => /^\S+@\S+\.\S+$/.test(v), "Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

// Pass the visitor's IP and browser on, so the API's logs and rate limits see them, not this server
async function clientHeaders(): Promise<Record<string, string>> {
  const h = await headers();
  const out: Record<string, string> = {};
  const forwarded = h.get("x-forwarded-for");
  const agent = h.get("user-agent");
  if (forwarded) out["x-forwarded-for"] = forwarded;
  if (agent) out["user-agent"] = agent;
  return out;
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const rawEmail = String(formData.get("email") ?? "");

  const parsed = schema.safeParse({
    email: rawEmail,
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    const fieldErrors: NonNullable<LoginState["fieldErrors"]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "email" || key === "password") fieldErrors[key] ??= issue.message;
    }
    return { fieldErrors, email: rawEmail };
  }

  const { email, password } = parsed.data;

  let data: AuthResponse;
  try {
    data = await api<AuthResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
      headers: await clientHeaders(),
    });
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Something went wrong. Please try again.",
      email,
    };
  }

  const role = data.user.role;
  if (role !== "admin" && role !== "dispatcher") {
    // Customers and technicians use the mobile app. Revoke the session that was just created.
    await api("/auth/logout", {
      method: "POST",
      body: { refreshToken: data.tokens.refreshToken },
      auth: false,
    }).catch(() => {});

    return {
      error:
        "This dashboard is for the ServeNest team. Customers and technicians use the mobile app.",
      email,
    };
  }

  const jar = await cookies();
  jar.set(ACCESS_COOKIE, data.tokens.accessToken, accessCookieOptions);
  jar.set(REFRESH_COOKIE, data.tokens.refreshToken, refreshCookieOptions);

  // redirect() works by throwing, so it stays outside any try block
  redirect(safeNext(String(formData.get("next") ?? "")));
}