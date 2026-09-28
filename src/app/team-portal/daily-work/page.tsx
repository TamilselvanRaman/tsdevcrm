"use client";

import { useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  FileText,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export default function DailyWorkPage() {
  const { currentUserId, users, tasks, dailyReports, submitDailyReport } = useAppStore();

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];
  const myTasks = tasks.filter((t) => t.assignedTo === currentUser.id || t.assignedToName === currentUser.fullName);

  const completedToday = myTasks.filter((t) => t.status === "COMPLETED");
  const inProgressToday = myTasks.filter((t) => t.status === "IN PROGRESS" || t.status === "TODO");
  const blockedToday = myTasks.filter((t) => t.isBlocked);

  const [tomorrowPlan, setTomorrowPlan] = useState(
    "Complete Razorpay order signature verification tests and submit PR for review."
  );
  const [notes, setNotes] = useState("All key delivery milestones on schedule.");
  const [submittedToast, setSubmittedToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitDailyReport({
      memberId: currentUser.id,
      memberName: currentUser.fullName,
      date: "2026-09-28",
      completedTasks: completedToday.map((t) => t.title),
      inProgressTasks: inProgressToday.map((t) => t.title),
      blockedTasks: blockedToday.map((t) => ({ taskTitle: t.title, reason: t.blockReason || "Blocker" })),
      startTime: "09:15 AM",
      breakMinutes: 45,
      currentHours: "6h 20m",
      tomorrowPlan,
      notes,
      status: "Submitted",
    });

    setSubmittedToast(true);
    setTimeout(() => setSubmittedToast(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {submittedToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#16A34A] px-4 py-3 font-semibold text-white shadow-lg text-xs">
          <CheckCircle2 className="h-4 w-4" /> Daily Report submitted successfully.
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Daily Work Report</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Submit end-of-day task progress log for manager review.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#0F172A] shadow-2xs">
          <CalendarCheck className="h-4 w-4 text-[#2563EB]" />
          <span>Date: 28 September 2026</span>
        </div>
      </div>

      {/* Main Work Hours Summary Bar */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <span className="text-[#64748B]">Start Time</span>
          <div className="font-bold text-sm text-[#0F172A]">09:15 AM</div>
        </div>
        <div>
          <span className="text-[#64748B]">Break Duration</span>
          <div className="font-bold text-sm text-[#0F172A]">45 min</div>
        </div>
        <div>
          <span className="text-[#64748B]">Current Hours Logged</span>
          <div className="font-bold text-sm text-[#2563EB]">6h 20m</div>
        </div>
      </div>

      {/* Form & Task Sections */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* COMPLETED TODAY */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 text-xs font-bold text-[#16A34A] uppercase tracking-wider">
            <CheckCircle2 className="h-4 w-4" /> COMPLETED TODAY
          </div>
          <div className="space-y-2 text-xs">
            {completedToday.length === 0 ? (
              <div className="text-[#64748B]">No tasks completed yet today</div>
            ) : (
              completedToday.map((t) => (
                <div key={t.id} className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 font-medium text-[#0F172A]">
                  [{t.taskKey}] {t.title} ({t.projectName})
                </div>
              ))
            )}
          </div>
        </div>

        {/* IN PROGRESS */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 text-xs font-bold text-[#2563EB] uppercase tracking-wider">
            <Clock className="h-4 w-4" /> IN PROGRESS
          </div>
          <div className="space-y-2 text-xs">
            {inProgressToday.length === 0 ? (
              <div className="text-[#64748B]">No active tasks</div>
            ) : (
              inProgressToday.map((t) => (
                <div key={t.id} className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/50 font-medium text-[#0F172A]">
                  [{t.taskKey}] {t.title} ({t.projectName})
                </div>
              ))
            )}
          </div>
        </div>

        {/* BLOCKED */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 text-xs font-bold text-[#DC2626] uppercase tracking-wider">
            <AlertTriangle className="h-4 w-4" /> BLOCKED TASKS
          </div>
          <div className="space-y-2 text-xs">
            {blockedToday.length === 0 ? (
              <div className="text-[#64748B]">No blockers reported</div>
            ) : (
              blockedToday.map((t) => (
                <div key={t.id} className="p-2.5 rounded-lg border border-red-200 bg-red-50/50 text-[#0F172A]">
                  <span className="font-bold">[{t.taskKey}] {t.title}:</span> {t.blockReason}
                </div>
              ))
            )}
          </div>
        </div>

        {/* TOMORROW'S PLAN */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-2">
          <label className="font-bold text-xs text-[#0F172A] uppercase tracking-wider block">
            TOMORROW&apos;S PLAN
          </label>
          <textarea
            rows={3}
            value={tomorrowPlan}
            onChange={(e) => setTomorrowPlan(e.target.value)}
            placeholder="Outline planned tasks for tomorrow..."
            className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-xs text-[#0F172A] focus:outline-hidden"
          />
        </div>

        {/* NOTES */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-2">
          <label className="font-bold text-xs text-[#0F172A] uppercase tracking-wider block">
            ADDITIONAL NOTES
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any comments for PM or lead..."
            className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-xs text-[#0F172A] focus:outline-hidden"
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs"
        >
          <Send className="h-4 w-4" />
          <span>Submit Daily Report</span>
        </button>
      </form>

      {/* Previous Reports History */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0]">
          <h3 className="font-bold text-sm text-[#0F172A]">Previous Daily Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left table-compact">
            <thead>
              <tr>
                <th>Date</th>
                <th>Hours</th>
                <th>Completed Tasks</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dailyReports.map((r) => (
                <tr key={r.id}>
                  <td className="font-bold text-[#0F172A]">{r.date}</td>
                  <td className="text-[#2563EB] font-bold">{r.currentHours}</td>
                  <td className="text-[#64748B]">{r.completedTasks.join(", ")}</td>
                  <td>
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
