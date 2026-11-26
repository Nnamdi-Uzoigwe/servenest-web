import type { Metadata } from "next";
import { Placeholder } from "@/components/Placeholder";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Technicians" };

export default async function TechniciansPage() {
  await requireUser();

  return <Placeholder title="Technicians" note="The list and filters are built in step 8d." />;
}