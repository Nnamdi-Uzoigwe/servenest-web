"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { api, ApiError } from "@/lib/api";
import { getSession } from "@/lib/session";

export type Decision = "approve" | "reject" | "suspend" | "reactivate";

export interface DecisionState {
  error?: string;
  reasonError?: string;
  success?: string;
}

const MESSAGES: Record<Decision, string> = {
  approve: "Technician approved",
  reject: "Application rejected",
  suspend: "Technician suspended",
  reactivate: "Technician reactivated",
};

const schema = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/i),
  decision: z.enum(["approve", "reject", "suspend", "reactivate"]),
  reason: z.string().trim().max(500, "Keep the reason under 500 characters"),
});

export async function decideAction(
  _prev: DecisionState,
  formData: FormData
): Promise<DecisionState> {
  // The buttons are hidden from dispatchers, but this is the check that counts
  const session = await getSession();
  if (!session.ok) return { error: "Your session has ended. Please sign in again." };
  if (session.user.role !== "admin") {
    return { error: "Only administrators can make this decision." };
  }

  const parsed = schema.safeParse({
    id: formData.get("id"),
    decision: formData.get("decision"),
    reason: String(formData.get("reason") ?? ""),
  });

  if (!parsed.success) {
    const reasonIssue = parsed.error.issues.find((i) => i.path[0] === "reason");
    if (reasonIssue) return { reasonError: reasonIssue.message };
    return { error: "That request was not valid. Refresh the page and try again." };
  }

  const { id, decision, reason } = parsed.data;
  const needsReason = decision === "reject" || decision === "suspend";

  if (needsReason && reason.length < 5) {
    return { reasonError: "Give a reason of at least 5 characters" };
  }

  try {
    await api(`/admin/technicians/${id}/${decision}`, {
      method: "POST",
      body: needsReason ? { reason } : undefined,
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Something went wrong. Please try again." };
  }

  // Refreshes the sidebar badge, the overview and the lists
  revalidatePath("/admin", "layout");
  return { success: MESSAGES[decision] };
}