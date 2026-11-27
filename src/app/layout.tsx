import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "ServeNest", template: "%s | ServeNest" },
  description:
    "ServeNest connects customers with approved technicians for plumbing, electrical work, cleaning and more, and gives your team one place to run it.",
  openGraph: { type: "website", siteName: "ServeNest", locale: "en_NG" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-dvh bg-white text-body antialiased">{children}</body>
    </html>
  );
}