import React from "react";
import { clsx } from "clsx";

export type EntityStatus =
  // Lead Statuses
  | "New"
  | "Contacted"
  | "Follow-up"
  | "Interested"
  | "Proposal"
  | "Proposal Sent"
  | "Negotiation"
  | "Converted"
  | "Won"
  | "Lost"
  | "Unqualified"
  | "Qualified"
  // Follow-up Statuses
  | "Scheduled"
  | "Completed"
  | "Overdue"
  | "Rescheduled"
  // Quotation & Agreement Statuses
  | "Draft"
  | "Sent"
  | "Viewed"
  | "Under Review"
  | "Revision Requested"
  | "Revision Required"
  | "Approved"
  | "Rejected"
  | "Expired"
  | "Signed"
  | "Accepted"
  // Project Statuses
  | "Planning"
  | "Not Started"
  | "In Progress"
  | "IN PROGRESS"
  | "On Hold"
  | "At Risk"
  | "Cancelled"
  // Task Statuses
  | "BACKLOG"
  | "Backlog"
  | "TODO"
  | "To Do"
  | "IN REVIEW"
  | "In Review"
  | "CHANGES REQUESTED"
  | "COMPLETED"
  | "Blocked"
  // Daily Reports & Review
  | "Submitted"
  | "Pending"
  // Invoices & Finance
  | "Issued"
  | "Partially Paid"
  | "Partial"
  | "Paid"
  // Attendance & User Status
  | "Active"
  | "Inactive"
  | "Present"
  | "Leave"
  | "Late"
  | "Half Day"
  | "Working"
  | "On Break"
  | "Checked Out"
  | string;

interface StatusBadgeProps {
  status: EntityStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({
  status,
  size = "md",
  className,
  showDot = true,
}: StatusBadgeProps) {
  const normalized = (status || "").toLowerCase().trim();

  // Emerald / Green: Success, Approved, Paid, Active, Completed, Converted
  const isGreen =
    [
      "active",
      "won",
      "converted",
      "approved",
      "signed",
      "accepted",
      "completed",
      "paid",
      "present",
      "working",
    ].includes(normalized) || normalized === "completed";

  // Blue / Indigo: New, In Progress, Contacted, Scheduled, Issued
  const isBlue = [
    "new",
    "in progress",
    "contacted",
    "scheduled",
    "issued",
    "todo",
    "to do",
    "submitted",
    "interested",
  ].includes(normalized);

  // Amber / Yellow: Follow-up, Negotiation, Under Review, Pending, Proposal, Half Day
  const isAmber = [
    "follow-up",
    "follow up",
    "negotiation",
    "proposal",
    "proposal sent",
    "under review",
    "in review",
    "pending",
    "partially paid",
    "partial",
    "on break",
    "half day",
    "planning",
    "rescheduled",
  ].includes(normalized);

  // Red / Rose: Overdue, Rejected, Lost, Blocked, Cancelled, Inactive, Changes Requested
  const isRed = [
    "overdue",
    "rejected",
    "lost",
    "blocked",
    "cancelled",
    "inactive",
    "changes requested",
    "revision requested",
    "revision required",
    "unqualified",
    "at risk",
    "leave",
  ].includes(normalized);

  // Slate / Gray: Draft, Backlog, Expired, On Hold, Checked Out
  let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";
  let dotStyle = "bg-slate-400";

  if (isGreen) {
    badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
    dotStyle = "bg-[#16A34A]";
  } else if (isBlue) {
    badgeStyle = "bg-blue-50 text-[#2563EB] border-blue-200";
    dotStyle = "bg-[#2563EB]";
  } else if (isAmber) {
    badgeStyle = "bg-amber-50 text-amber-800 border-amber-200";
    dotStyle = "bg-amber-500";
  } else if (isRed) {
    badgeStyle = "bg-red-50 text-[#DC2626] border-red-200";
    dotStyle = "bg-[#DC2626]";
  }

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-xs",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full font-semibold border transition-colors",
        badgeStyle,
        sizeStyles[size],
        className
      )}
    >
      {showDot && <span className={clsx("h-1.5 w-1.5 rounded-full shrink-0", dotStyle)} />}
      <span>{status}</span>
    </span>
  );
}

export default StatusBadge;
