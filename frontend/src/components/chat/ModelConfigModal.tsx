"use client";

import React, { useState } from "react";
import {
  Sliders,
  Cpu,
  Sparkles,
  Layers,
  Save,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function ModelConfigModal() {
  const { modelConfig, setModelConfig, isModelModalOpen, setModelModalOpen } =
    useTaskStore();

  const [temp, setTemp] = useState(modelConfig.temperature);
  const [topP, setTopP] = useState(modelConfig.topP);
  const [systemPrompt, setSystemPrompt] = useState(modelConfig.systemPrompt);
  const [selectedModel, setSelectedModel] = useState(modelConfig.selectedModel);
  const [isArenaMode, setIsArenaMode] = useState(modelConfig.isArenaMode);

  const availableModels = [
    "Qwen 2.5 14B Industrial (CUDA Q4_K_M)",
    "DeepSeek R1 14B Distill (CUDA Q4_K_M)",
    "Llama 3.3 70B Industrial (VLLM Multi-GPU)",
  ];

  if (!isModelModalOpen) return null;

  const handleSave = () => {
    setModelConfig({
      temperature: temp,
      topP,
      systemPrompt,
      selectedModel,
      isArenaMode,
    });
    setModelModalOpen(false);
  };

  const handleSetPreset = (presetTemp: number) => {
    setTemp(presetTemp);
  };

  return (
    <Modal
      isOpen={isModelModalOpen}
      onClose={() => setModelModalOpen(false)}
      maxWidth="2xl"
      title="Enclave LLM Generation Parameters"
      description="Fine-tune inference hyperparameters and local system directives."
    >
      <div className="space-y-5 select-none text-xs">
        {/* Model Selection Dropdown */}
        <div className="space-y-1.5">
          <label className="font-semibold text-primary block font-mono">
            Active Sovereign LLM Model (On-Premise CUDA)
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-surface border border-border-medium text-primary font-mono focus:outline-none focus:border-border-focus"
          >
            {availableModels.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Temperature Slider & Presets */}
        <div className="space-y-2 p-3.5 rounded-xl bg-surface border border-border-subtle">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-primary font-mono">
              Temperature: {temp.toFixed(2)}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSetPreset(0.0)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                  temp === 0.0
                    ? "bg-accent text-white border-accent"
                    : "bg-surface-card border-border-subtle text-primary-secondary hover:text-primary"
                }`}
              >
                0.0 (Deterministic Compliance)
              </button>
              <button
                type="button"
                onClick={() => handleSetPreset(0.7)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                  temp === 0.7
                    ? "bg-accent text-white border-accent"
                    : "bg-surface-card border-border-subtle text-primary-secondary hover:text-primary"
                }`}
              >
                0.7 (Investigation)
              </button>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={temp}
            onChange={(e) => setTemp(parseFloat(e.target.value))}
            className="w-full accent-accent cursor-pointer"
          />

          <div className="flex justify-between text-[10px] font-mono text-primary-muted">
            <span>0.0 Strict OISD/API Compliance</span>
            <span>1.0 High Stochasticity</span>
          </div>
        </div>

        {/* Top-P Slider & Context Window Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 p-3.5 rounded-xl bg-surface border border-border-subtle">
            <div className="flex justify-between font-mono font-semibold text-primary">
              <span>Top-P Sampling</span>
              <span>{topP.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={topP}
              onChange={(e) => setTopP(parseFloat(e.target.value))}
              className="w-full accent-accent cursor-pointer"
            />
          </div>

          <div className="space-y-1.5 p-3.5 rounded-xl bg-surface border border-border-subtle">
            <span className="font-semibold text-primary font-mono block">
              Context Budget (CUDA VRAM)
            </span>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-status-success font-bold">32,768 Tokens</span>
              <Badge variant="accent" size="sm">
                RTX 4090 (24GB)
              </Badge>
            </div>
          </div>
        </div>

        {/* Dual-Model Arena Mode Toggle */}
        <div className="p-3.5 rounded-xl bg-surface border border-border-subtle flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              <span className="font-semibold text-primary">
                Dual-Model Arena Comparison View
              </span>
            </div>
            <p className="text-[11px] text-primary-muted mt-0.5">
              Stream side-by-side responses from Qwen 2.5 14B and DeepSeek R1 14B.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsArenaMode(!isArenaMode)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              isArenaMode ? "bg-accent" : "bg-border-medium"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                isArenaMode ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* System Prompt Box */}
        <div className="space-y-1.5">
          <label className="font-semibold text-primary block font-mono">
            Enclave System Prompt Prefix
          </label>
          <textarea
            rows={4}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full p-3 rounded-xl bg-surface border border-border-medium text-xs text-primary font-mono leading-relaxed focus:outline-none focus:border-border-focus"
          />
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setModelModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            size="sm"
            className="gap-1.5 font-semibold text-xs px-5 shadow-glow"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Apply Parameters</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
