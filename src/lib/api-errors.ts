import "server-only";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api";

// For pages: a dead session goes back to sign in, anything else becomes a message to show
export function messageFor(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 401) redirect("/admin/login?reason=expired");
    return err.message;
  }
  return "Something went wrong. Please try again.";
}