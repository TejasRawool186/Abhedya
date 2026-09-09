"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative min-h-[calc(100vh-3.5rem)] min-h-[calc(100dvh-3.5rem)] flex flex-col items-center justify-center py-16 overflow-hidden">
      {/* Responsive Cinematic Hero Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-[center_top_22%] sm:bg-[center_top_28%] md:bg-center pointer-events-none"
        style={{
          backgroundImage: "url('/img/hero4.png')",
        }}
      />

      {/* Subtle dark/blue readability overlay - lightened for vibrant background visibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(7, 15, 25, 0.52) 0%, rgba(7, 15, 25, 0.32) 50%, rgba(6, 12, 22, 0.65) 100%)",
        }}
      />

      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/6 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-semibold tracking-tight text-primary max-w-3xl mx-auto leading-[1.15] drop-shadow-md">
          Sovereign AI for{" "}
          <span className="text-accent">
            Industrial Intelligence
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-[17px] text-primary-secondary max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
          Air-gapped agentic orchestration for oil refineries and petrochemical complexes. Local inference, deterministic reasoning, human-in-the-loop verification.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/workbench">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white text-[15px] font-medium hover:bg-accent-hover transition-colors">
              Enter Workbench
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <a href="#pipeline">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border-medium text-primary text-[15px] hover:bg-surface-hover transition-colors">
              Explore Pipeline
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
