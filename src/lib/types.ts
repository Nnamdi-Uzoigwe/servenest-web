export type Role = "customer" | "technician" | "admin" | "dispatcher";
export type StaffRole = "admin" | "dispatcher";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  status: "active" | "suspended";
  avatar?: { url: string; publicId: string };
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface MeResponse {
  user: User;
}

export type TechnicianApprovalStatus = "pending" | "approved" | "rejected" | "suspended";

export type DocumentType = "id_card" | "certificate" | "license" | "other";

export interface TechnicianDocument {
  _id: string;
  type: DocumentType;
  name: string;
  url: string;
  publicId: string;
  uploadedAt: string;
}

export interface WorkingLocation {
  state: string;
  city: string;
}

// The user details the API attaches to a technician profile
export interface TechnicianUser {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: { url: string; publicId: string };
  isEmailVerified: boolean;
  status: "active" | "suspended";
  suspendedReason?: string;
  createdAt: string;
}

export interface TechnicianListItem {
  _id: string;
  user: TechnicianUser;
  residentialAddress: string;
  yearsOfExperience: number;
  specializations: string[];
  workingLocations: WorkingLocation[];
  documents: TechnicianDocument[];
  approvalStatus: TechnicianApprovalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface TechnicianList {
  items: TechnicianListItem[];
  pagination: Pagination;
}

export type TechnicianStats = Record<TechnicianApprovalStatus, number> & { total: number };