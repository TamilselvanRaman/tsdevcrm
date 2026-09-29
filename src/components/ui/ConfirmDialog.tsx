"use client";

import React from "react";
import { AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";
import { Modal } from "./Modal";
import { clsx } from "clsx";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  description?: string;
  confirmLabel?: string;
  confirmText?: string;
  cancelLabel?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  title,
  message,
  description,
  confirmLabel,
  confirmText,
  cancelLabel,
  cancelText,
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  const handleClose = onClose || onCancel || (() => {});
  const finalMessage = message || description || "Are you sure you want to proceed?";
  const finalConfirm = confirmText || confirmLabel || "Confirm";
  const finalCancel = cancelText || cancelLabel || "Cancel";

  const iconVariants = {
    danger: <AlertCircle className="h-6 w-6 text-[#DC2626]" />,
    warning: <AlertTriangle className="h-6 w-6 text-amber-500" />,
    primary: <CheckCircle2 className="h-6 w-6 text-[#2563EB]" />,
  };

  const btnVariants = {
    danger: "bg-[#DC2626] hover:bg-red-700 text-white shadow-xs",
    warning: "bg-amber-600 hover:bg-amber-700 text-white shadow-xs",
    primary: "bg-[#2563EB] hover:bg-blue-700 text-white shadow-xs",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      size="md"
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-white hover:text-[#0F172A] transition-colors"
          >
            {finalCancel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            disabled={isLoading}
            className={clsx(
              "rounded-xl px-4 py-2 text-xs font-semibold transition-colors disabled:opacity-50",
              btnVariants[variant]
            )}
          >
            {isLoading ? "Processing..." : finalConfirm}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-4 py-1">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-[#E2E8F0] shrink-0">
          {iconVariants[variant]}
        </div>
        <div className="text-xs text-[#64748B] leading-relaxed">
          <p>{finalMessage}</p>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
