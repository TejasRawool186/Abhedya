import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function LandingFooter() {
  return (
    <>
      {/* Full-width Final CTA Section with 5.png - Expanded Cinematic Scale */}
      <section className="relative min-h-[640px] sm:min-h-[740px] md:min-h-[840px] flex items-center justify-center py-28 sm:py-36 md:py-44 px-4 sm:px-6 overflow-hidden border-t border-border-subtle">
        {/* Full-width cinematic background image 5.png */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-[center_bottom] sm:bg-[center_bottom_10%] md:bg-center pointer-events-none"
          style={{
            backgroundImage: "url('/img/5.png')",
          }}
        />

        {/* Subtle readability overlay - lightened for vibrant cinematic clarity */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(6, 12, 20, 0.28) 0%, rgba(6, 12, 20, 0.08) 40%, rgba(6, 12, 20, 0.48) 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(6, 12, 20, 0.28) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-mono mb-4 backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4" />
            SMART INDIA HACKATHON 2026 — PS ID 26117
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary max-w-2xl mx-auto leading-tight drop-shadow-md">
            Ready to Experience Air-Gapped Industrial Intelligence?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-primary-secondary max-w-xl mx-auto drop-shadow leading-relaxed">
            Launch the Sovereign Workbench to test real ultrasonic logs, run vibration FFT diagnostics, and experience deterministic human-in-the-loop validation.
          </p>
          <div className="mt-8">
            <Link href="/workbench">
              <Button size="lg" className="font-semibold px-8 shadow-glow">
                LAUNCH WORKBENCH NOW
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Reduced Footer in #071B26 */}
      <footer className="border-t border-[#071B26] bg-[#071B26] py-5 sm:py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0a2331] border border-white/10 flex items-center justify-center">
                <span className="text-accent font-bold text-sm">OA</span>
              </div>
              <div>
                <div className="text-sm font-bold text-primary">OnPremisAI Sovereign Workbench</div>
                <div className="text-xs text-primary-muted font-mono">Mangalore Refinery and Petrochemicals Limited (MRPL) Enclave</div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-primary-secondary font-mono">
              <Link href="/workbench" className="hover:text-accent transition-colors">
                Workbench Shell
              </Link>
              <a href="#pipeline" className="hover:text-accent transition-colors">
                LangGraph Pipeline
              </a>
              <a href="#threat-matrix" className="hover:text-accent transition-colors">
                Threat Matrix
              </a>
              <a href="#compliance" className="hover:text-accent transition-colors">
                OISD Compliance
              </a>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/5 text-center text-[11px] text-primary-muted font-mono">
            © 2026 OnPremisAI Industrial Engineering Enclave. Engineered for Air-Gapped High-Hazard Reliability.
          </div>
        </div>
      </footer>
    </>
  );
}
