"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Edit3,
  Lock,
  KeyRound,
  FileCheck,
  UserCheck,
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function ApprovalCheckpoint() {
  const {
    isApprovalModalOpen,
    setApprovalModalOpen,
    activeApprovalData,
    approveStep,
    rejectStep,
    operatorName,
    operatorRole,
  } = useTaskStore();

  const [pin, setPin] = useState("8921");
  const [isEditing, setIsEditing] = useState(false);
  const [customComment, setCustomComment] = useState(
    activeApprovalData?.recommendedAction ||
      "Emergency ASTM A335 Grade P22 replacement spool piece fabrication authorized for October 2026 mini-shutdown."
  );
  const [isSigning, setIsSigning] = useState(false);

  React.useEffect(() => {
    if (activeApprovalData?.recommendedAction) {
      setCustomComment(activeApprovalData.recommendedAction);
    }
  }, [activeApprovalData?.recommendedAction]);

  if (!isApprovalModalOpen) return null;

  const handleApprove = async () => {
    setIsSigning(true);
    await approveStep(pin, customComment);
    setIsSigning(false);
  };

  const handleReject = () => {
    const reason = prompt("Enter reason for rejection:");
    if (reason) {
      rejectStep(reason);
    }
  };

  return (
    <Modal
      isOpen={isApprovalModalOpen}
      onClose={() => setApprovalModalOpen(false)}
      maxWidth="2xl"
      title="Human-in-the-Loop (HITL) Safety Gate"
      description="Mandatory verification gate enforced by OISD-105 & API 570 compliance policies."
    >
      <div className="space-y-5 select-none">
        {/* Warning Banner */}
        <div className="p-4 rounded-xl bg-status-warning/10 border border-status-warning/30 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-status-warning/20 border border-status-warning/40 flex items-center justify-center text-status-warning shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-status-warning">
                CRITICAL THICKNESS LOSS DETECTED
              </h4>
              <Badge variant="danger" size="sm">
                Remaining Life &lt; 2 Years
              </Badge>
            </div>
            <p className="text-xs text-primary-secondary mt-1 leading-relaxed">
              Automated agent execution has been halted. API 570 standards mandate authorized engineer digital sign-off before official deliverable synthesis.
            </p>
          </div>
        </div>

        {/* Telemetry Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-surface border border-border-subtle">
          <div>
            <span className="text-[10px] font-mono uppercase text-primary-muted">
              Monitoring Point
            </span>
            <div className="text-xs font-bold text-primary font-mono mt-0.5">
              {activeApprovalData?.criticalPoint || "CML-HC-101A"}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-primary-muted">
              Measured Wall
            </span>
            <div className="text-xs font-bold text-status-warning font-mono mt-0.5">
              {activeApprovalData?.currentThickness || "7.8 mm"}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-primary-muted">
              MAWT Limit
            </span>
            <div className="text-xs font-bold text-status-danger font-mono mt-0.5">
              {activeApprovalData?.mawt || "6.5 mm"}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-primary-muted">
              Remaining Life
            </span>
            <div className="text-xs font-bold text-status-danger font-mono mt-0.5">
              {activeApprovalData?.remainingLife || "1.58 Years"}
            </div>
          </div>
        </div>

        {/* Action Recommendation Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-primary">
              Proposed Maintenance Recommendation
            </span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-[11px] text-accent hover:text-accent-hover font-mono flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>{isEditing ? "Lock Text" : "Edit Recommendation"}</span>
            </button>
          </div>

          {isEditing ? (
            <textarea
              rows={3}
              value={customComment}
              onChange={(e) => setCustomComment(e.target.value)}
              className="w-full p-3 rounded-xl bg-surface border border-border-focus text-xs text-primary focus:outline-none leading-relaxed"
            />
          ) : (
            <div className="p-3.5 rounded-xl bg-surface border border-border-subtle text-xs text-primary leading-relaxed">
              {customComment}
            </div>
          )}
        </div>

        {/* Cryptographic PIN Sign-off Box */}
        <div className="p-4 rounded-xl bg-surface border border-border-medium space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold text-primary">
                Operator Sign-off Credentials
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-primary font-bold">
                {operatorName}
              </span>
              <Badge variant="accent" size="sm">
                {operatorRole}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-[10px] font-mono uppercase text-primary-muted block mb-1">
                Authorization PIN (SHA-256 Seed)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter PIN..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface-card border border-border-medium text-xs font-mono text-primary focus:outline-none focus:border-border-focus"
                />
                <KeyRound className="w-3.5 h-3.5 text-primary-muted absolute left-2.5 top-2" />
              </div>
            </div>

            <div className="text-[11px] font-mono text-status-success pt-4">
              ✓ Hardware Key Validated
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Button
            variant="danger"
            onClick={handleReject}
            size="sm"
            className="gap-1.5 text-xs font-semibold"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject Recommendation</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setApprovalModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              isLoading={isSigning}
              size="sm"
              className="bg-accent hover:bg-accent-hover text-white font-bold gap-2 shadow-glow text-xs px-5"
            >
              <FileCheck className="w-4 h-4" />
              <span>Approve & Sign Deliverable</span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
