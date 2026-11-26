import "server-only";
import { api } from "@/lib/api";
import type { TechnicianApprovalStatus, TechnicianList, TechnicianStats } from "@/lib/types";

export function getTechnicianStats() {
  return api<TechnicianStats>("/admin/technicians/stats");
}

export interface TechnicianQuery {
  status?: TechnicianApprovalStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export function listTechnicians(query: TechnicianQuery = {}) {
  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  const qs = params.toString();
  return api<TechnicianList>(`/admin/technicians${qs ? `?${qs}` : ""}`);
}