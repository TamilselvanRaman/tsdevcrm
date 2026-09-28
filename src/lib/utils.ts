import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function generateId(prefix: string): string {
  return `${prefix}-${Math.floor(100 + Math.random() * 900)}`;
}

export function getStatusBadgeClass(status: string): string {
  const s = status.toLowerCase();
  if (["won", "completed", "paid", "verified", "approved", "successful", "present"].includes(s)) {
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  }
  if (["in_progress", "active", "issued", "proposal_sent", "meeting_scheduled", "qualified"].includes(s)) {
    return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  }
  if (["pending", "under_review", "review_pending", "partially_paid", "in_review", "late", "half_day"].includes(s)) {
    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }
  if (["urgent", "overdue", "blocked", "failed", "critical", "blocker", "lost", "rejected", "absent", "cancelled"].includes(s)) {
    return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  }
  return "bg-slate-500/10 text-slate-400 border-slate-500/20";
}
