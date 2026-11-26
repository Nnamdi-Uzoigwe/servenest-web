import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: { default: "ServeNest", template: "%s | ServeNest" },
  description:
    "ServeNest connects customers with approved home service technicians, and gives your team one place to run the operation.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-dvh bg-white text-body antialiased">{children}</body>
    </html>
  );
}