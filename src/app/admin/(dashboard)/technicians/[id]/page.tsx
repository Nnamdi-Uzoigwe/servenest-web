import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Notice } from "@/components/ui/Notice";
import { StatusChip } from "@/components/ui/StatusChip";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { ApiError } from "@/lib/api";
import { messageFor } from "@/lib/api-errors";
import {
  DOCUMENT_LABELS,
  formatDateTime,
  summarizeAvailability,
} from "@/lib/format";
import { requireUser } from "@/lib/session";
import { getTechnician, getTechnicianHistory } from "@/lib/technicians";
import { DecisionPanel } from "@/app/admin/(dashboard)/technicians/[id]/DecisionPanel";
import {
  DocumentGallery,
  type GalleryDocument,
} from "@/app/admin/(dashboard)/technicians/[id]/DocumentGallery";
import { History } from "@/app/admin/(dashboard)/technicians/[id]/History";

export const metadata: Metadata = { title: "Technician review" };

async function load(id: string, includeHistory: boolean) {
  try {
    const [tech, history] = await Promise.all([
      getTechnician(id),
      // The history is a bonus. If it fails, the rest of the page still works.
      includeHistory ? getTechnicianHistory(id).catch(() => null) : Promise.resolve(null),
    ]);
    return { tech, history } as const;
  } catch (err) {
    if (err instanceof ApiError && (err.status === 404 || err.status === 400)) notFound();
    return { error: messageFor(err) } as const;
  }
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-t border-line py-4 first:border-t-0 first:pt-0 sm:grid-cols-[11rem_1fr] sm:gap-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-body">{children}</dd>
    </div>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className="rounded-full bg-champagne px-3 py-1 text-sm text-ink">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function TechnicianReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const isAdmin = user.role === "admin";

  const result = await load(id, isAdmin);

  if ("error" in result) {
    return (
      <div className="space-y-4">
        <Notice>{result.error}</Notice>
        <Link href="/admin/technicians" className="text-sm font-medium text-ink underline underline-offset-4">
          Back to technicians
        </Link>
      </div>
    );
  }

  const { tech, history } = result;
  const hasId = tech.documents.some((doc) => doc.type === "id_card");

  // The ID first, since checking it is the main part of a review
  const documents: GalleryDocument[] = [...tech.documents]
    .sort((a, b) => Number(b.type === "id_card") - Number(a.type === "id_card"))
    .map((doc) => ({
      id: doc._id,
      url: doc.url,
      label: DOCUMENT_LABELS[doc.type],
      name: doc.name,
      uploaded: formatDateTime(doc.uploadedAt),
    }));

  const reason =
    tech.approvalStatus === "rejected"
      ? tech.rejectionReason
      : tech.approvalStatus === "suspended"
        ? tech.suspensionReason
        : undefined;

  const reviewedLine =
    tech.reviewedBy && tech.approvalStatus !== "pending"
      ? `Last decision by ${tech.reviewedBy.fullName}${
          tech.reviewedAt ? `, ${formatDateTime(tech.reviewedAt)}` : ""
        }`
      : undefined;

  const availability = summarizeAvailability(tech.weeklyAvailability);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/technicians"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Technicians
        </Link>

        <div className="mt-4 flex items-center gap-4">
          <UserAvatar name={tech.user.fullName} url={tech.user.avatar?.url} size={64} />
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-ink">{tech.user.fullName}</h1>
              <StatusChip status={tech.approvalStatus} />
            </div>
            <p className="mt-1 text-muted">
              {tech.user.email}
              {tech.user.phone ? `, ${tech.user.phone}` : ""}
            </p>
            <p className="text-sm text-subtle">Applied {formatDateTime(tech.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-10">
          <section aria-labelledby="documents-title" className="border-t border-line pt-6">
            <h2 id="documents-title" className="text-xl font-semibold text-ink">
              Documents
            </h2>

            {!hasId ? (
              <div className="mt-4">
                <Notice tone="warning">No government ID has been uploaded yet.</Notice>
              </div>
            ) : null}

            {documents.length > 0 ? (
              <div className="mt-4">
                <DocumentGallery documents={documents} />
              </div>
            ) : (
              <p className="mt-3 text-muted">This technician has not uploaded any documents.</p>
            )}
          </section>

          <section aria-labelledby="application-title" className="border-t border-line pt-6">
            <h2 id="application-title" className="text-xl font-semibold text-ink">
              Application
            </h2>

            <dl className="mt-4">
              <Row label="Address">{tech.residentialAddress}</Row>
              <Row label="Experience">
                {tech.yearsOfExperience} {tech.yearsOfExperience === 1 ? "year" : "years"}
              </Row>
              <Row label="Bio">
                {tech.bio ? tech.bio : <span className="text-subtle">Not provided</span>}
              </Row>
              <Row label="Services">
                <Tags items={tech.specializations} />
              </Row>
              <Row label="Working areas">
                <Tags items={tech.workingLocations.map((a) => `${a.city}, ${a.state}`)} />
              </Row>
              <Row label="Availability">
                {availability.length > 0 ? (
                  <ul className="space-y-1">
                    {availability.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-subtle">Not set</span>
                )}
              </Row>
              <Row label="Email">{tech.user.isEmailVerified ? "Verified" : "Not verified"}</Row>
            </dl>
          </section>

          {isAdmin ? (
            <section aria-labelledby="history-title" className="border-t border-line pt-6">
              <h2 id="history-title" className="text-xl font-semibold text-ink">
                History
              </h2>

              <div className="mt-4">
                {history ? (
                  <History items={history} appliedAt={tech.createdAt} />
                ) : (
                  <Notice>The history could not be loaded. Refresh the page to try again.</Notice>
                )}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <DecisionPanel
            id={tech._id}
            name={tech.user.fullName}
            status={tech.approvalStatus}
            reason={reason}
            reviewedLine={reviewedLine}
            hasId={hasId}
            canDecide={isAdmin}
          />
        </aside>
      </div>
    </div>
  );
}