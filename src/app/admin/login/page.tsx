import type { Metadata } from "next";
import Link from "next/link";
import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="min-h-dvh bg-paper">
      <Placeholder title="Sign in" note="The sign in form is built in step 8b.">
        <Link href="/" className="font-medium text-ink underline underline-offset-4">
          Back to the site
        </Link>
      </Placeholder>
    </main>
  );
}