import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Shield, Cpu, Lock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MRPL AI WORKBENCH — Sovereign Agentic AI Platform",
  description:
    "Sovereign Agentic AI Workbench for Confidential Industrial Intelligence. Air-gapped, secure, auditable processing of inspection reports and compliance data.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  keywords: [
    "Sovereign AI",
    "Industrial Intelligence",
    "MRPL",
    "Air-Gapped",
    "Confidential Computing",
    "Agentic AI",
    "Compliance",
    "Inspection Reports",
  ],
  authors: [{ name: "MRPL AI Engineering" }],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <div className="fixed inset-x-0 top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
          <div className="h-14 px-4 md:px-8 flex items-center justify-between max-w-[1800px] mx-auto w-full">
            <Link
              href="/"
              className="flex items-center gap-2.5 group shrink-0"
              prefetch={false}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-md bg-accent/15 flex items-center justify-center border border-accent/30 group-hover:bg-accent/25 transition-colors">
                  <Shield size={16} className="text-accent" strokeWidth={2.2} />
                </div>
                <div className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-success/90 border-2 border-background" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[13px] font-bold tracking-[0.14em] text-foreground uppercase">
                  MRPL
                </span>
                <span className="text-[9px] tracking-[0.22em] text-muted uppercase">
                  AI Workbench
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs">
              <Link
                href="/chat"
                className="text-muted hover:text-foreground transition-colors"
                prefetch={false}
              >
                Workbench
              </Link>
              <span className="text-muted-2 text-muted/40">|</span>
              <span className="text-muted">Pipeline</span>
              <span className="text-muted-2 text-muted/40">|</span>
              <span className="text-muted">Audit Log</span>
              <span className="text-muted-2 text-muted/40">|</span>
              <span className="text-muted">Documentation</span>
            </nav>

            <div className="flex items-center gap-2">
              <Badge variant="success" className="text-[9px] hidden sm:inline-flex">
                <Lock size={9} />
                Air-Gap Secured
              </Badge>
              <div className="flex items-center gap-1.5 rounded-full border border-border bg-panel px-2.5 py-1">
                <Cpu size={11} className="text-accent" />
                <span className="text-[10px] font-medium text-foreground font-mono tabular-nums">
                  SOVEREIGN
                </span>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 flex flex-col min-h-0 pt-14">{children}</main>

        <footer className="flex-shrink-0 border-t border-border/70 bg-panel/40">
          <div className="px-4 md:px-8 py-4 max-w-[1800px] mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-[10px] text-muted">
              <span>© 2026 MRPL Confidential Computing Division</span>
              <span className="hidden md:inline text-muted-2">•</span>
              <span className="hidden md:inline">
                All data processed on-premises within secure enclave
              </span>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono text-muted">
              <span>NODE-ON-PREM</span>
              <span className="text-muted-2">v0.1.0</span>
              <span className="text-success font-semibold">● OPERATIONAL</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
