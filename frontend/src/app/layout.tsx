import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OnPremisAI — Sovereign AI Workbench for Confidential Industrial Intelligence",
  description:
    "Air-gapped, zero-egress industrial AI workbench for automated inspection analysis, SOP verification, and executive report synthesis.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  keywords: [
    "Sovereign AI",
    "Industrial Intelligence",
    "OnPremisAI",
    "Air-Gapped",
    "Confidential Computing",
    "Agentic AI",
    "Compliance",
    "Inspection Reports",
  ],
  authors: [{ name: "Sovereign AI Engineering" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="h-full w-full overflow-hidden bg-[var(--background)] text-[var(--foreground)] font-sans">
        {children}
      </body>
    </html>
  );
}
