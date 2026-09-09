"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TagFilterPillsProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export function TagFilterPills({
  tags,
  selectedTag,
  onSelectTag,
}: TagFilterPillsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 select-none">
      <button
        onClick={() => onSelectTag(null)}
        className={cn(
          "px-3 py-1 rounded-lg text-xs font-mono transition-colors",
          selectedTag === null
            ? "bg-accent text-white font-semibold"
            : "bg-surface-card border border-border-subtle text-primary-secondary hover:text-primary hover:bg-surface-hover"
        )}
      >
        #ALL_COLLECTIONS
      </button>

      {tags.map((tag) => {
        const isSelected = selectedTag === tag;
        return (
          <button
            key={tag}
            onClick={() => onSelectTag(isSelected ? null : tag)}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-mono transition-colors",
              isSelected
                ? "bg-accent text-white font-semibold"
                : "bg-surface-card border border-border-subtle text-primary-secondary hover:text-primary hover:bg-surface-hover"
            )}
          >
            #{tag}
          </button>
        );
      })}
    </div>
  );
}
