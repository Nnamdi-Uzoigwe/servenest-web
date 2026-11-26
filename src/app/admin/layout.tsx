import type { Metadata } from "next";

// The dashboard should never show up in search results
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | ServeNest Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}