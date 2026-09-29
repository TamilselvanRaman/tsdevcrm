import React from "react";
import { LucideIcon, FolderOpen, Plus } from "lucide-react";
import { clsx } from "clsx";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  actionLabel,
  onAction,
  action,
  className,
}: EmptyStateProps) {
  const finalLabel = action?.label || actionLabel;
  const finalAction = action?.onClick || onAction;

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC]/50",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-[#E2E8F0] text-[#64748B] shadow-2xs mb-3.5">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-[#0F172A]">{title}</h3>
      <p className="mt-1 text-xs text-[#64748B] max-w-sm leading-relaxed">{description}</p>
      {finalLabel && finalAction && (
        <button
          onClick={finalAction}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>{finalLabel}</span>
        </button>
      )}
    </div>
  );
}

export default EmptyState;
