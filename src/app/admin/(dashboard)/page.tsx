import Link from "next/link";
import { Placeholder } from "@/components/Placeholder";

export default function DashboardHome() {
  return (
    <Placeholder title="Dashboard" note="The overview is built in step 8c.">
      <Link href="/admin/technicians" className="font-medium text-ink underline underline-offset-4">
        Technicians
      </Link>
    </Placeholder>
  );
}