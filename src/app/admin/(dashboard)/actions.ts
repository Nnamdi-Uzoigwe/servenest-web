"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/session-cookies";

export async function logoutAction() {
  const jar = await cookies();
  const refreshToken = jar.get(REFRESH_COOKIE)?.value;

  // Revoke the session on the API first, so a copied cookie stops working
  if (refreshToken) {
    await api("/auth/logout", {
      method: "POST",
      body: { refreshToken },
      auth: false,
    }).catch(() => {});
  }

  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
  redirect("/admin/login?reason=signedout");
}