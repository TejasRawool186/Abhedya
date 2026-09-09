"use client";

import React, { useState } from "react";
import {
  Settings,
  Cpu,
  Plus,
  Trash2,
  Server,
  Key,
  Globe,
  X,
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function SettingsView() {
  const { configuredModels, addConfiguredModel, removeConfiguredModel } =
    useTaskStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newModel, setNewModel] = useState({
    name: "",
    endpoint: "",
    apiKey: "",
    provider: "",
  });

  const handleAdd = () => {
    if (!newModel.name.trim() || !newModel.endpoint.trim()) return;
    addConfiguredModel({
      name: newModel.name.trim(),
      endpoint: newModel.endpoint.trim(),
      apiKey: newModel.apiKey.trim() || undefined,
      provider: newModel.provider.trim() || "Custom",
    });
    setNewModel({ name: "", endpoint: "", apiKey: "", provider: "" });
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setNewModel({ name: "", endpoint: "", apiKey: "", provider: "" });
    setShowAddForm(false);
  };

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
            <Settings className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-primary">Settings</h1>
            <p className="text-xs text-primary-muted">
              Configure workbench preferences and model parameters.
            </p>
          </div>
        </div>

        {/* ─── Models Configuration ─── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold text-primary">
                Models Configuration
              </h2>
              <Badge variant="default" size="sm">
                {configuredModels.length}
              </Badge>
            </div>
            {!showAddForm && (
              <Button
                size="sm"
                onClick={() => setShowAddForm(true)}
                className="gap-1.5 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Model
              </Button>
            )}
          </div>

          {/* Add Model Form */}
          {showAddForm && (
            <div className="p-4 rounded-xl bg-surface border border-accent/30 space-y-4 animate-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">
                  Add New Model
                </span>
                <button
                  onClick={handleCancel}
                  className="p-1 rounded-lg text-primary-muted hover:text-primary hover:bg-surface-hover transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Model Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-primary-secondary flex items-center gap-1.5">
                    <Cpu className="w-3 h-3" />
                    Model Name <span className="text-status-danger">*</span>
                  </label>
                  <input
                    type="text"
                    value={newModel.name}
                    onChange={(e) =>
                      setNewModel({ ...newModel, name: e.target.value })
                    }
                    placeholder="e.g. GPT-4o, Claude 3.5 Sonnet"
                    className="w-full px-3 py-2 rounded-lg bg-surface-card border border-border-medium text-xs text-primary placeholder:text-primary-muted/50 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>

                {/* Provider */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-primary-secondary flex items-center gap-1.5">
                    <Server className="w-3 h-3" />
                    Provider
                  </label>
                  <input
                    type="text"
                    value={newModel.provider}
                    onChange={(e) =>
                      setNewModel({ ...newModel, provider: e.target.value })
                    }
                    placeholder="e.g. OpenAI, Ollama, VLLM"
                    className="w-full px-3 py-2 rounded-lg bg-surface-card border border-border-medium text-xs text-primary placeholder:text-primary-muted/50 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>

                {/* Endpoint URL */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-primary-secondary flex items-center gap-1.5">
                    <Globe className="w-3 h-3" />
                    Endpoint URL <span className="text-status-danger">*</span>
                  </label>
                  <input
                    type="text"
                    value={newModel.endpoint}
                    onChange={(e) =>
                      setNewModel({ ...newModel, endpoint: e.target.value })
                    }
                    placeholder="e.g. http://localhost:11434/v1"
                    className="w-full px-3 py-2 rounded-lg bg-surface-card border border-border-medium text-xs text-primary font-mono placeholder:text-primary-muted/50 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>

                {/* API Key */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-primary-secondary flex items-center gap-1.5">
                    <Key className="w-3 h-3" />
                    API Key
                    <span className="text-[10px] text-primary-muted font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="password"
                    value={newModel.apiKey}
                    onChange={(e) =>
                      setNewModel({ ...newModel, apiKey: e.target.value })
                    }
                    placeholder="sk-..."
                    className="w-full px-3 py-2 rounded-lg bg-surface-card border border-border-medium text-xs text-primary font-mono placeholder:text-primary-muted/50 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleAdd}
                  disabled={!newModel.name.trim() || !newModel.endpoint.trim()}
                  className="gap-1.5 text-xs px-4"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Model
                </Button>
              </div>
            </div>
          )}

          {/* Models List */}
          <div className="space-y-2">
            {configuredModels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-xl bg-surface-hover flex items-center justify-center mb-3">
                  <Cpu className="w-6 h-6 text-primary-muted" />
                </div>
                <p className="text-sm text-primary-secondary font-medium">
                  No models configured
                </p>
                <p className="text-xs text-primary-muted mt-1">
                  Add a model to get started with inference.
                </p>
              </div>
            ) : (
              configuredModels.map((model) => (
                <div
                  key={model.id}
                  className="group p-3.5 rounded-xl bg-surface-card/60 border border-border-subtle hover:border-border-medium transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Cpu className="w-4 h-4 text-accent" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-primary truncate">
                            {model.name}
                          </span>
                          <Badge variant="accent" size="sm">
                            {model.provider}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] font-mono text-primary-muted">
                          <Globe className="w-3 h-3 shrink-0" />
                          <span className="truncate">{model.endpoint}</span>
                        </div>
                        {model.apiKey && (
                          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-mono text-primary-muted">
                            <Key className="w-3 h-3 shrink-0" />
                            <span>••••••••••••</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeConfiguredModel(model.id)}
                      className="p-1.5 rounded-lg text-primary-muted opacity-0 group-hover:opacity-100 hover:text-status-danger hover:bg-status-danger/10 transition-all shrink-0"
                      title="Remove model"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
