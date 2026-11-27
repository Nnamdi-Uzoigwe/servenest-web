import clsx from "clsx";
import type { ReactNode } from "react";
import { BrowserFrame, PhoneFrame } from "@/components/site/Frames";

interface RowProps {
  id: string;
  title: string;
  intro: string;
  points: string[];
  media: ReactNode;
  tone: "white" | "paper";
  flip?: boolean;
}

function Row({ id, title, intro, points, media, tone, flip }: RowProps) {
  return (
    <section id={id} className={tone === "paper" ? "bg-paper" : "bg-white"}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:gap-20">
        <div className={clsx(flip && "lg:order-2")}>
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-ink">{title}</h2>
          <p className="mt-4 max-w-lg text-lg text-muted">{intro}</p>

          <ul className="mt-8 max-w-lg divide-y divide-line border-y border-line">
            {points.map((point) => (
              <li key={point} className="py-3.5 text-body">
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className={clsx("flex justify-center", flip && "lg:order-1")}>{media}</div>
      </div>
    </section>
  );
}

export function Audiences() {
  return (
    <>
      <Row
        id="customers"
        tone="paper"
        title="Book a technician and follow the job"
        intro="Describe the problem, get a clear quote, and see who is coming and when."
        points={[
          "Browse services such as plumbing, electrical repairs, air conditioning, cleaning, generator repairs, painting, appliance repairs, carpentry and pest control.",
          "See a quote with a full price breakdown before you pay.",
          "Pay securely and keep your receipts in one place.",
          "See your technician's details, arrival status and location on a map while the job is active.",
          "Get a notification at every step, then rate the work.",
        ]}
        media={
          <PhoneFrame
            file="customer-intro.png"
            alt="The ServeNest customer introduction, with progress lines across the top"
          />
        }
      />

      <Row
        id="technicians"
        tone="white"
        flip
        title="Get approved, then take the jobs you want"
        intro="Apply in the app. Once a person at ServeNest approves you, assignments for your areas and hours show up in your Jobs tab."
        points={[
          "Apply with your details, the services you handle, the areas you cover and the hours you work.",
          "Upload your ID and certificates. A person reviews them before you can see any job.",
          "Accept or decline assignments, then update each job from on the way to done.",
          "Add before and after photos and notes as proof of the work.",
          "Follow your earnings, pending payouts and payout history.",
        ]}
        media={
          <PhoneFrame
            file="technician-checklist.png"
            alt="The technician application checklist, showing profile photo, government ID and trade certificate"
          />
        }
      />

      <Row
        id="team"
        tone="paper"
        title="Run every job from one place"
        intro="A web dashboard for administrators and dispatchers to review technicians, manage bookings and keep every job moving."
        points={[
          "Review technician applications and documents, then approve, reject or suspend.",
          "Manage services, prices and bookings, send quotes and confirm jobs.",
          "See unassigned jobs and available technicians, and assign work without conflicts.",
          "Follow payments, refunds and technician payouts.",
          "Dispatchers handle bookings and assignments. Only administrators approve technicians and payouts.",
          "Every important admin action is recorded in an audit log.",
        ]}
        media={
          <div className="w-full space-y-4">
            <BrowserFrame
              file="dashboard-overview.png"
              alt="The admin overview, with technician counts by status and the applications waiting for review"
              className="lg:mr-10"
            />
            <BrowserFrame
              file="technician-review.png"
              alt="The technician review screen, with documents, application details and the decision panel"
              className="lg:ml-10"
            />
          </div>
        }
      />
    </>
  );
}