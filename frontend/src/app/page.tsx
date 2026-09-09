"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { LandingHero } from "@/components/landing/LandingHero";
import { ThreatMatrix } from "@/components/landing/ThreatMatrix";
import { FeatureBentoGrid } from "@/components/landing/FeatureBentoGrid";
import { InteractivePipeline } from "@/components/landing/InteractivePipeline";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas text-primary">
      {/* Clean Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#071B26]/95 backdrop-blur-xl border-b border-[#071B26] h-14 px-4 sm:px-6 flex items-center select-none shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
          </div>
          <span className="font-semibold text-sm text-primary tracking-tight">
            OnPremisAI
          </span>
        </div>
      </header>

      {/* Main Landing Page Content */}
      <main className="pt-14">
        <LandingHero />
        <ThreatMatrix />
        <FeatureBentoGrid />
        <InteractivePipeline />
        <LandingFooter />
      </main>
    </div>
  );
}
