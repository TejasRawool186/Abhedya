"use client";

import React, { useEffect } from "react";
import {
  Plus,
  MessageSquare,
  FileCheck,
  ShieldCheck,
  Pin,
  Trash2,
  Settings,
  PanelLeftClose,
  MoreHorizontal,
  Database,
} from "lucide-react";
import { useTaskStore, WorkspaceView } from "@/store/useTaskStore";
import { Badge } from "@/components/ui/Badge";

function formatTaskTime(dateStr?: string): string {
  if (!dateStr) return "Just now";
  if (dateStr.endsWith("UTC") && dateStr.length <= 10) return dateStr;
  if (dateStr.includes(" ")) {
    const parts = dateStr.split(" ");
    if (parts[1] && parts[1].includes(":")) {
      return `${parts[1].slice(0, 5)} UTC`;
    }
  }
  if (dateStr.includes("T")) {
    return `${dateStr.slice(11, 16)} UTC`;
  }
  return dateStr;
}

export function Sidebar() {
  const {
    isSidebarOpen,
    toggleSidebar,
    activeView,
    setActiveView,
    tasks,
    activeTaskId,
    setActiveTaskId,
    createNewTask,
    deleteTask,
    pinTask,
    operatorName,
    operatorRole,
    setModelModalOpen,
  } = useTaskStore();

  // Keyboard shortcut: Ctrl + B to toggle sidebar, Ctrl + N for new chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        createNewTask();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar, createNewTask]);

  if (!isSidebarOpen) return null;

  const navItems: { view: WorkspaceView; label: string; icon: any; badge?: string }[] = [
    { view: "tasks", label: "Tasks", icon: MessageSquare },
    { view: "knowledge", label: "Knowledge Base", icon: Database },
    { view: "audit", label: "Audit Trail", icon: FileCheck },
    { view: "network", label: "Network", icon: ShieldCheck },
    { view: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-[260px] h-full bg-surface flex flex-col justify-between shrink-0 select-none transition-sidebar">
      {/* Top Section */}
      <div className="p-3 flex flex-col gap-2">
        {/* Sidebar Toggle Row */}
        <div className="flex items-center justify-between px-1 mb-1">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-primary-muted hover:text-primary hover:bg-surface-hover transition-colors"
            title="Close sidebar (Ctrl+B)"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* View Navigation */}
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-colors ${
                  isActive
                    ? "bg-surface-hover text-primary font-medium"
                    : "text-primary-secondary hover:text-primary hover:bg-surface-hover/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-primary-muted"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] text-primary-muted">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Middle Section: Task History List */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider text-primary-muted">
            Recent
          </span>
          <button
            onClick={createNewTask}
            className="text-[11px] text-primary-muted hover:text-accent flex items-center gap-1 transition-colors px-1 py-0.5 rounded hover:bg-surface-hover cursor-pointer"
            title="Create new chat"
          >
            <Plus className="w-3 h-3" />
            <span>New</span>
          </button>
        </div>

        <div className="space-y-0.5">
          {tasks.map((task) => {
            const isSelected = activeTaskId === task.id;
            return (
              <div
                key={task.id}
                onClick={() => {
                  setActiveTaskId(task.id);
                  setActiveView("tasks");
                }}
                className={`group relative p-3 rounded-xl text-left cursor-pointer transition-all border ${
                  isSelected
                    ? "bg-surface-card border-border-medium/80 text-primary shadow-sm"
                    : "bg-surface-card/40 border-border-subtle/30 text-primary-secondary hover:bg-surface-hover/80 hover:border-border-subtle"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`text-[13px] truncate ${
                      isSelected ? "text-primary font-medium" : "text-primary-secondary"
                    }`}
                    title={task.title}
                  >
                    {task.title}
                  </span>
                  {task.pinned && (
                    <Pin className="w-3 h-3 text-accent shrink-0 mt-0.5 fill-accent" />
                  )}
                </div>

                <div className="flex items-center justify-between mt-1 text-[10px] text-primary-muted">
                  <span>{formatTaskTime(task.updatedAt)}</span>
                  <Badge size="sm" variant={
                    task.status === "COMPLETED"
                      ? "success"
                      : task.status === "AWAITING_APPROVAL"
                      ? "warning"
                      : task.status === "RUNNING"
                      ? "accent"
                      : "default"
                  }>
                    {task.status}
                  </Badge>
                </div>

                {/* Hover action bar */}
                <div className="absolute right-2 top-2 hidden group-hover:flex items-center gap-0.5 bg-surface-card border border-border-subtle rounded-lg p-0.5 shadow-sm">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      pinTask(task.id);
                    }}
                    className="p-1 hover:text-accent text-primary-muted rounded"
                    title="Pin"
                  >
                    <Pin className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(task.id);
                    }}
                    className="p-1 hover:text-status-danger text-primary-muted rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Operator Profile */}
      <div className="p-3 border-t border-border-subtle">
        <button
          onClick={() => setModelModalOpen(true)}
          className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-surface-hover transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent font-semibold text-xs shrink-0">
            {operatorName ? operatorName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "A"}
          </div>
          <div className="flex-1 overflow-hidden text-left">
            <div className="text-[13px] font-medium text-primary truncate">
              {operatorName}
            </div>
            <div className="text-[11px] text-primary-muted truncate">
              {operatorRole}
            </div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-primary-muted shrink-0" />
        </button>
      </div>
    </aside>
  );
}
