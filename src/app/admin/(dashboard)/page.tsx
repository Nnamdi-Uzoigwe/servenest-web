import Link from "next/link";
import { Placeholder } from "@/components/Placeholder";
import { requireUser } from "@/lib/session";

export default async function DashboardHome() {
  // A layout does not run again when you move between pages, so every page checks for itself
  const user = await requireUser();

  return (
    <Placeholder
      title="Dashboard"
      note={`Signed in as ${user.fullName} (${user.role}). The overview is built in step 8c.`}
    >
      <Link href="/admin/technicians" className="font-medium text-ink underline underline-offset-4">
        Technicians
      </Link>
    </Placeholder>
  );
}