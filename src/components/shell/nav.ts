import { LayoutDashboard, Wrench } from "lucide-react";

// Pages are added here as their backend modules are built
export const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/technicians", label: "Technicians", icon: Wrench, exact: false },
] as const;