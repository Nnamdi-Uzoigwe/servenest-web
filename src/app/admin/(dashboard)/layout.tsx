// The sidebar, top bar and session check arrive in steps 8b and 8c
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-white">{children}</div>;
}