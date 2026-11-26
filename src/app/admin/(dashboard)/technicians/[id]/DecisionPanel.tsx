"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Button, type ButtonVariant } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Notice } from "@/components/ui/Notice";
import { StatusChip } from "@/components/ui/StatusChip";
import { Textarea } from "@/components/ui/Textarea";
import {
  decideAction,
  type Decision,
  type DecisionState,
} from "@/app/admin/(dashboard)/technicians/actions";
import type { TechnicianApprovalStatus } from "@/lib/types";

interface Copy {
  button: string;
  variant: ButtonVariant;
  title: (name: string) => string;
  body: string;
  reasonLabel?: string;
}

const COPY: Record<Decision, Copy> = {
  approve: {
    button: "Approve technician",
    variant: "primary",
    title: (name) => `Approve ${name}?`,
    body: "They will be able to receive and accept jobs as soon as they open the app.",
  },
  reject: {
    button: "Reject application",
    variant: "danger",
    title: () => "Reject this application?",
    body: "The technician will see your reason in the app and can fix their details and resubmit.",
    reasonLabel: "Reason (shown to the technician)",
  },
  suspend: {
    button: "Suspend technician",
    variant: "danger",
    title: (name) => `Suspend ${name}?`,
    body: "They are signed out everywhere and cannot sign in or take jobs until you reactivate them.",
    reasonLabel: "Reason (shown to the technician)",
  },
  reactivate: {
    button: "Reactivate technician",
    variant: "primary",
    title: (name) => `Reactivate ${name}?`,
    body: "They can sign in and take jobs again.",
  },
};

const AVAILABLE: Record<TechnicianApprovalStatus, Decision[]> = {
  pending: ["approve", "reject"],
  approved: ["suspend"],
  rejected: ["approve"],
  suspended: ["reactivate"],
};

const STATE_TEXT: Record<TechnicianApprovalStatus, string> = {
  pending: "This application is waiting for a decision.",
  approved: "This technician is approved and can take jobs.",
  rejected: "This application was rejected.",
  suspended: "This technician is suspended and cannot sign in or take jobs.",
};

interface DecisionPanelProps {
  id: string;
  name: string;
  status: TechnicianApprovalStatus;
  reason?: string;
  reviewedLine?: string;
  hasId: boolean;
  canDecide: boolean;
}

interface DecisionFormProps {
  decision: Decision;
  id: string;
  name: string;
  hasId: boolean;
  onCancel: () => void;
  onDone: (message: string) => void;
}

function DecisionForm({ decision, id, name, hasId, onCancel, onDone }: DecisionFormProps) {
  const copy = COPY[decision];
  const [state, action, pending] = useActionState<DecisionState, FormData>(decideAction, {});

  useEffect(() => {
    if (state.success) onDone(state.success);
  }, [state.success, onDone]);

  return (
    <form action={action} className="p-6">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="decision" value={decision} />

      <h2 className="text-xl font-bold text-ink">{copy.title(name)}</h2>
      <p className="mt-2 text-muted">{copy.body}</p>

      {decision === "approve" && !hasId ? (
        <div className="mt-4">
          <Notice tone="warning">This technician has not uploaded a government ID.</Notice>
        </div>
      ) : null}

      {copy.reasonLabel ? (
        <div className="mt-4">
          <Textarea
            name="reason"
            label={copy.reasonLabel}
            rows={4}
            maxLength={500}
            required
            error={state.reasonError}
            hint="At least 5 characters."
          />
        </div>
      ) : null}

      {state.error ? (
        <div className="mt-4">
          <Notice>{state.error}</Notice>
        </div>
      ) : null}

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel} disabled={pending}>
          Cancel
        </Button>
        <Button type="submit" variant={copy.variant} disabled={pending}>
          {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : null}
          {copy.button}
        </Button>
      </div>
    </form>
  );
}

export function DecisionPanel({
  id,
  name,
  status,
  reason,
  reviewedLine,
  hasId,
  canDecide,
}: DecisionPanelProps) {
  const [open, setOpen] = useState<Decision | null>(null);
  const [notice, setNotice] = useState("");

  const handleDone = useCallback((message: string) => {
    setOpen(null);
    setNotice(message);
  }, []);

  return (
    <section
      aria-labelledby="decision-title"
      className="rounded-sheet border border-line bg-paper p-6"
    >
      <h2 id="decision-title" className="text-lg font-semibold text-ink">
        Decision
      </h2>

      <div className="mt-3">
        <StatusChip status={status} />
      </div>
      <p className="mt-3 text-sm text-muted">{STATE_TEXT[status]}</p>

      {reason ? (
        <blockquote className="mt-4 border-l-2 border-champagne-deep pl-3">
          <p className="text-xs text-muted">Reason given</p>
          <p className="mt-1 text-sm text-body">{reason}</p>
        </blockquote>
      ) : null}

      {reviewedLine ? <p className="mt-3 text-xs text-subtle">{reviewedLine}</p> : null}

      {notice ? (
        <div className="mt-4">
          <Notice tone="info">{notice}</Notice>
        </div>
      ) : null}

      {canDecide ? (
        <div className="mt-6 space-y-3">
          {AVAILABLE[status].map((decision) => (
            <Button
              key={decision}
              variant={COPY[decision].variant}
              className="w-full"
              onClick={() => {
                setNotice("");
                setOpen(decision);
              }}
            >
              {COPY[decision].button}
            </Button>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <Notice tone="info">
            Only administrators can approve, reject or suspend technicians.
          </Notice>
        </div>
      )}

      <Dialog
        open={open !== null}
        onClose={() => setOpen(null)}
        label={open ? COPY[open].title(name) : "Decision"}
      >
        {open ? (
          <DecisionForm
            key={open}
            decision={open}
            id={id}
            name={name}
            hasId={hasId}
            onCancel={() => setOpen(null)}
            onDone={handleDone}
          />
        ) : null}
      </Dialog>
    </section>
  );
}