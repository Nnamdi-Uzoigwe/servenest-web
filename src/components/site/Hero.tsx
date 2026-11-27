import { PhoneFrame } from "@/components/site/Frames";
import { JobTrack } from "@/components/site/JobTrack";
import { WelcomeMock } from "@/components/site/WelcomeMock";
import { buttonClasses } from "@/components/ui/Button";
import { X_URL } from "@/lib/site";

export function Hero() {
  return (
    <section className="bg-ink text-champagne">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="grid items-center gap-14 pb-16 pt-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20 lg:pt-14">
          <div>
            <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Home services, done properly.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-champagne/80">
              ServeNest connects customers with approved technicians for plumbing, electrical work,
              cleaning and more. Every job is tracked from the first request to the final review.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a href="#how-it-works" className={buttonClasses({ variant: "champagne" })}>
                See how it works
              </a>
              {X_URL ? (
                <a
                  href={X_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-champagne underline underline-offset-4 hover:text-white"
                >
                  Follow the build on X
                </a>
              ) : null}
            </div>

            <p className="mt-8 flex items-center gap-2 text-sm text-champagne/70">
              <span className="size-2 rounded-full bg-brass" aria-hidden />
              The mobile app is in development.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <PhoneFrame
              file="welcome.png"
              alt="The ServeNest welcome screen, where people choose to book a service or join as a technician"
              priority
              fallback={<WelcomeMock />}
            />
          </div>
        </div>

        <div className="border-t border-ink-lift py-10">
          <JobTrack />
          <p className="mt-6 text-sm text-champagne/70">
            Every job moves through the same six stages, and the customer sees each change.
          </p>
        </div>
      </div>
    </section>
  );
}