import "server-only";
import { api } from "@/lib/api";
import type {
  AuditLogItem,
  AuditLogList,
  TechnicianApprovalStatus,
  TechnicianDetail,
  TechnicianList,
  TechnicianStats,
} from "@/lib/types";

export function getTechnicianStats() {
  return api<TechnicianStats>("/admin/technicians/stats");
}

export interface TechnicianQuery {
  status?: TechnicianApprovalStatus;
  search?: string;
  sort?: "newest" | "oldest";
  page?: number;
  limit?: number;
}

export function listTechnicians(query: TechnicianQuery = {}) {
  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);
  if (query.search) params.set("search", query.search);
  if (query.sort) params.set("sort", query.sort);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  const qs = params.toString();
  return api<TechnicianList>(`/admin/technicians${qs ? `?${qs}` : ""}`);
}

export function getTechnician(id: string) {
  return api<TechnicianDetail>(`/admin/technicians/${id}`);
}

// Administrators only, the API refuses this for dispatchers
export async function getTechnicianHistory(id: string): Promise<AuditLogItem[]> {
  const params = new URLSearchParams({ entityType: "TechnicianProfile", entityId: id, limit: "50" });
  const data = await api<AuditLogList>(`/admin/audit-logs?${params.toString()}`);
  return data.items;
}