import type { Metadata } from "next";
import { Audiences } from "@/components/site/Audiences";
import { Hero } from "@/components/site/Hero";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Progress } from "@/components/site/Progress";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Trust } from "@/components/site/Trust";

export const metadata: Metadata = {
  title: { absolute: "ServeNest: home services, done properly" },
  description:
    "ServeNest connects customers with approved technicians for plumbing, electrical work, cleaning and more, and gives your team one place to run it.",
  alternates: { canonical: "/" },
};

export default function LandingPage() {
  return (
    <>
      <div className="bg-ink text-champagne">
        <div className="mx-auto w-full max-w-6xl px-6">
          <SiteHeader />
        </div>
      </div>

      <main>
        <Hero />
        <HowItWorks />
        <Audiences />
        <Trust />
        <Progress />
      </main>

      <SiteFooter />
    </>
  );
}