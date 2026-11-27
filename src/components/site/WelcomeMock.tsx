import { ChevronRight } from "lucide-react";

// A drawn copy of the app's welcome screen, shown in the hero until welcome.png is added
export function WelcomeMock() {
  return (
    <div className="absolute inset-0 flex flex-col bg-ink px-4 pb-4 pt-9 text-champagne">
      <p className="text-[11px] font-bold">ServeNest</p>

      <div className="flex flex-1 flex-col justify-center">
        <p className="text-[24px] font-bold leading-[1.1] tracking-tight">
          Home services, done properly.
        </p>
        <p className="mt-2 text-[10px] text-champagne/70">Choose how you will use ServeNest.</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center rounded-2xl bg-champagne p-3 text-ink">
          <div className="flex-1 pr-2">
            <p className="text-[12px] font-bold">I need a service</p>
            <p className="mt-0.5 text-[9px] leading-tight text-muted">
              Book approved technicians and follow every job.
            </p>
          </div>
          <span className="grid size-6 place-items-center rounded-full bg-ink text-champagne">
            <ChevronRight className="size-3.5" aria-hidden />
          </span>
        </div>

        <div className="flex items-center rounded-2xl border border-champagne/20 bg-ink-lift p-3">
          <div className="flex-1 pr-2">
            <p className="text-[12px] font-bold">I&apos;m a technician</p>
            <p className="mt-0.5 text-[9px] leading-tight text-champagne/70">
              Get approved, take jobs and track your earnings.
            </p>
          </div>
          <span className="grid size-6 place-items-center rounded-full bg-champagne text-ink">
            <ChevronRight className="size-3.5" aria-hidden />
          </span>
        </div>
      </div>

      <p className="mt-3 text-center text-[9px] text-champagne/70">
        Already have an account? Sign in
      </p>
    </div>
  );
}