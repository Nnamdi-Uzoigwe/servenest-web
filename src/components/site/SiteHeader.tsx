import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";

const LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#customers", label: "Customers" },
  { href: "#technicians", label: "Technicians" },
  { href: "#team", label: "Your team" },
  { href: "#progress", label: "Progress" },
];

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between gap-6 py-6">
      <Link href="/" className="text-xl font-bold tracking-tight text-champagne">
        ServeNest
      </Link>

      <nav aria-label="Sections" className="hidden items-center gap-7 lg:flex">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm text-champagne/80 transition-colors hover:text-champagne"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <Link href="/admin" className={buttonClasses({ variant: "champagne", size: "sm" })}>
        Sign in
      </Link>
    </header>
  );
}