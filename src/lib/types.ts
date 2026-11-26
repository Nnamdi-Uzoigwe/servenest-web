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