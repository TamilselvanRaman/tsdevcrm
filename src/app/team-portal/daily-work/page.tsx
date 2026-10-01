"use client";

import { useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  FileText,
  Edit2,
  Trash2,
  Plus,
  X,
  Check,
} from "lucide-react";
import { useAppStore, SYSTEM_FALLBACK_USER } from "@/store/useAppStore";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { DailyWorkReport } from "@/types";

export default function DailyWorkPage() {
  const { currentUserId, users, tasks, dailyReports, submitDailyReport, updateDailyReport, deleteDailyReport } = useAppStore();

  const currentUser = users.find((u) => u.id === currentUserId) || users[0] || SYSTEM_FALLBACK_USER;
  const myTasks = tasks.filter((t) => t.assignedTo === currentUser?.id || t.assignedToName === currentUser?.fullName);

  const completedToday = myTasks.filter((t) => t.status === "COMPLETED");
  const inProgressToday = myTasks.filter((t) => t.status === "IN PROGRESS" || t.status === "TODO");
  const blockedToday = myTasks.filter((t) => t.isBlocked);

  // Filter reports submitted by current member (or all if demo)
  const myReports = dailyReports.filter(
    (r) => r.memberId === currentUser?.id || r.memberName === currentUser?.fullName
  );

  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("09:15 AM");
  const [breakMinutes, setBreakMinutes] = useState(45);
  const [currentHours, setCurrentHours] = useState("8h 00m");
  const [tomorrowPlan, setTomorrowPlan] = useState(
    "Complete Razorpay order signature verification tests and submit PR for review."
  );
  const [notes, setNotes] = useState("All key delivery milestones on schedule.");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit / Delete State
  const [editingReport, setEditingReport] = useState<DailyWorkReport | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReport) {
      updateDailyReport(editingReport.id, {
        date: reportDate,
        startTime,
        breakMinutes: Number(breakMinutes),
        currentHours,
        tomorrowPlan,
        notes,
      });
      showToast("Daily report updated successfully.");
      setEditingReport(null);
    } else {
      submitDailyReport({
        memberId: currentUser?.id || "usr-1",
        memberName: currentUser?.fullName || "Staff Member",
        date: reportDate,
        completedTasks: completedToday.map((t) => t.title),
        inProgressTasks: inProgressToday.map((t) => t.title),
        blockedTasks: blockedToday.map((t) => ({ taskTitle: t.title, reason: t.blockReason || "Blocker" })),
        startTime,
        breakMinutes: Number(breakMinutes),
        currentHours,
        tomorrowPlan,
        notes,
        status: "Submitted",
      });
      showToast("Daily report submitted successfully.");
    }
  };

  const handleStartEdit = (report: DailyWorkReport) => {
    setEditingReport(report);
    setReportDate(report.date || new Date().toISOString().split("T")[0]);
    setStartTime(report.startTime || "09:00 AM");
    setBreakMinutes(report.breakMinutes || 45);
    setCurrentHours(report.currentHours || "8h 00m");
    setTomorrowPlan(report.tomorrowPlan || "");
    setNotes(report.notes || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingReport(null);
    setTomorrowPlan("Complete Razorpay order signature verification tests and submit PR for review.");
    setNotes("All key delivery milestones on schedule.");
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteDailyReport(deletingId);
      if (editingReport?.id === deletingId) {
        setEditingReport(null);
      }
      setDeletingId(null);
      showToast("Report deleted successfully.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#0F172A] text-white px-4 py-3 font-semibold shadow-lg text-xs animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-[#16A34A]" /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
            {editingReport ? "Edit Daily Work Report" : "Daily Work Report"}
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            {editingReport
              ? `Editing submission for ${editingReport.date}`
              : "Submit end-of-day task progress log for manager review."}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#0F172A] shadow-2xs">
          <CalendarCheck className="h-4 w-4 text-[#2563EB]" />
          <span>Date: {reportDate}</span>
        </div>
      </div>

      {/* Main Work Hours Summary Bar */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="text-[#64748B] block mb-1">Report Date</label>
          <input
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            className="w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 font-bold text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
          />
        </div>
        <div>
          <label className="text-[#64748B] block mb-1">Start Time</label>
          <input
            type="text"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 font-bold text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
          />
        </div>
        <div>
          <label className="text-[#64748B] block mb-1">Break Duration (min)</label>
          <input
            type="number"
            value={breakMinutes}
            onChange={(e) => setBreakMinutes(Number(e.target.value))}
            className="w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 font-bold text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
          />
        </div>
        <div>
          <label className="text-[#64748B] block mb-1">Hours Logged</label>
          <input
            type="text"
            value={currentHours}
            onChange={(e) => setCurrentHours(e.target.value)}
            className="w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 font-bold text-xs text-[#2563EB] focus:outline-hidden focus:border-[#2563EB]"
          />
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
              <div className="text-[#64748B] italic">No completed tasks tracked automatically for today</div>
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
              <div className="text-[#64748B] italic">No active tasks in progress</div>
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
              <div className="text-[#64748B] italic">No blockers reported today</div>
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
            className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
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
            className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors"
          >
            {editingReport ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            <span>{editingReport ? "Update Daily Report" : "Submit Daily Report"}</span>
          </button>
          {editingReport && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Previous Reports History */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0]">
          <h3 className="font-bold text-sm text-[#0F172A]">Previous Daily Reports</h3>
        </div>
        {myReports.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#64748B]">
            No previous reports submitted yet. Fill the form above to record your daily progress.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-compact">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Hours</th>
                  <th>Completed Tasks</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myReports.map((r) => (
                  <tr key={r.id}>
                    <td className="font-bold text-[#0F172A]">{r.date}</td>
                    <td className="text-[#2563EB] font-bold">{r.currentHours}</td>
                    <td className="text-[#64748B]">
                      {r.completedTasks && r.completedTasks.length > 0
                        ? r.completedTasks.join(", ")
                        : "No tasks listed"}
                    </td>
                    <td>
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {r.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStartEdit(r)}
                          className="p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Report"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(r.id)}
                          className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Report"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Delete Daily Report"
        description="Are you sure you want to delete this daily report log? This action cannot be undone."
        confirmText="Delete Report"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingId(null)}
      />
    </div>
  );
}
