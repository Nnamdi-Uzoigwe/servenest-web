import type { Metadata } from "next";
import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = { title: "Technician review" };

export default async function TechnicianReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Placeholder
      title="Technician review"
      note={`The review screen for ${id} is built in step 8d.`}
    />
  );
}