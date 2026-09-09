"use client";

import React from "react";
import {
  FileScan,
  TrendingDown,
  Activity,
  Award,
  FileCheck,
  Sparkles,
} from "lucide-react";

export interface SlashCommand {
  key: string;
  label: string;
  description: string;
  prompt: string;
  icon: any;
}

export const industrialSlashCommands: SlashCommand[] = [
  {
    key: "ut-audit",
    label: "/ut-audit",
    description: "Extract CML wall thickness, calculate corrosion rates (mm/yr) & check API 570 MAWT limits.",
    prompt:
      "Analyze the uploaded ultrasonic thickness inspection log for Hydrocracker Unit 3. Extract the nominal vs measured wall thickness at all Condition Monitoring Locations (CMLs), compute short-term and long-term corrosion rates, project remaining life, and check compliance against API 570 minimum retirement thickness (MAWT = 6.5 mm).",
    icon: FileScan,
  },
  {
    key: "corrosion-rate",
    label: "/corrosion-rate",
    description: "Calculate short-term & long-term corrosion rates for hydrocarbon pipelines.",
    prompt:
      "Calculate short-term and long-term corrosion degradation rates for hydrocarbon piping spools based on historical inspection cycles and ASTM A335 material specifications.",
    icon: TrendingDown,
  },
  {
    key: "vibration-fft",
    label: "/vibration-fft",
    description: "Evaluate pump/compressor FFT vibration spectrum for bearing wear and unbalance.",
    prompt:
      "Evaluate pump/compressor FFT vibration spectrum for bearing wear, unbalance, and misalignment frequencies against ISO 10816 vibration severity limits.",
    icon: Activity,
  },
  {
    key: "oisd-permit",
    label: "/oisd-permit",
    description: "Verify hot work permit against OISD-STD-105 standard operating checklist.",
    prompt:
      "Verify the current hot work & confined space work permit against OISD-STD-105 standard operating checklists for atmospheric testing, blind isolation, and fire watch compliance.",
    icon: Award,
  },
  {
    key: "export-docx",
    label: "/export-docx",
    description: "Compile full task findings into official executive Word deliverable.",
    prompt:
      "Compile the full task findings into an official executive Word document deliverable stamped with cryptographic SHA-256 digital signature.",
    icon: FileCheck,
  },
];

interface SlashCommandMenuProps {
  filter: string;
  onSelect: (command: SlashCommand) => void;
  onClose: () => void;
}

export function SlashCommandMenu({
  filter,
  onSelect,
  onClose,
}: SlashCommandMenuProps) {
  const filteredCommands = industrialSlashCommands.filter(
    (cmd) =>
      cmd.key.toLowerCase().includes(filter.toLowerCase()) ||
      cmd.label.toLowerCase().includes(filter.toLowerCase()) ||
      cmd.description.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredCommands.length === 0) return null;

  return (
    <div className="absolute bottom-full left-0 mb-3 w-full max-w-lg rounded-2xl bg-surface-card border border-border-subtle shadow-floating p-1.5 z-50">
      <div className="px-3 py-2 flex items-center justify-between">
        <span className="text-[12px] font-medium text-primary-secondary">
          Commands
        </span>
        <span className="text-[10px] text-primary-muted">
          Enter to insert
        </span>
      </div>

      <div className="max-h-60 overflow-y-auto space-y-1 p-1">
        {filteredCommands.map((cmd) => {
          const Icon = cmd.icon;
          return (
            <button
              key={cmd.key}
              onClick={() => onSelect(cmd)}
              className="w-full p-2.5 rounded-xl text-left hover:bg-surface-hover flex items-start gap-3 transition-colors group"
            >
              <div className="w-7 h-7 rounded-lg bg-accent/8 flex items-center justify-center text-accent shrink-0">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-primary">
                    {cmd.label}
                  </span>
                </div>
                <p className="text-[11px] text-primary-muted truncate mt-0.5">
                  {cmd.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
