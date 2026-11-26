import Link from "next/link";

export default function TechnicianNotFound() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-ink">Technician not found</h1>
      <p className="mt-2 max-w-md text-muted">
        This technician does not exist, or the link is wrong.
      </p>
      <Link
        href="/admin/technicians"
        className="mt-4 inline-block font-medium text-ink underline underline-offset-4"
      >
        Back to technicians
      </Link>
    </div>
  );
}