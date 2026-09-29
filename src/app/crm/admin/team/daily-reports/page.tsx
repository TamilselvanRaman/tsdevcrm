"use client";

import { useState } from "react";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MessageSquare,
  Check,
  X,
  FileText,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Send,
  User,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DailyWorkReport } from "@/types";

export default function DailyReportsAdminPage() {
  const {
    dailyReports,
    users,
    submitDailyReport,
    updateDailyReport,
    updateDailyReportStatus,
    deleteDailyReport,
  } = useAppStore();

  const [selectedReport, setSelectedReport] = useState<DailyWorkReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<DailyWorkReport | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formMemberId, setFormMemberId] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formHours, setFormHours] = useState("8h 00m");
  const [formCompletedTasks, setFormCompletedTasks] = useState("");
  const [formInProgressTasks, setFormInProgressTasks] = useState("");
  const [formBlockers, setFormBlockers] = useState("");
  const [formTomorrowPlan, setFormTomorrowPlan] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formStatus, setFormStatus] = useState<"Submitted" | "Pending">("Submitted");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingReport(null);
    setFormMemberId(users[0]?.id || "");
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormHours("8h 00m");
    setFormCompletedTasks("");
    setFormInProgressTasks("");
    setFormBlockers("");
    setFormTomorrowPlan("");
    setFormNotes("");
    setFormStatus("Submitted");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (report: DailyWorkReport) => {
    setEditingReport(report);
    setFormMemberId(report.memberId || "");
    setFormDate(report.date || new Date().toISOString().split("T")[0]);
    setFormHours(report.currentHours || "8h 00m");
    setFormCompletedTasks(report.completedTasks?.join("\n") || "");
    setFormInProgressTasks(report.inProgressTasks?.join("\n") || "");
    setFormBlockers(
      report.blockedTasks?.map((b) => `${b.taskTitle}: ${b.reason}`).join("\n") || ""
    );
    setFormTomorrowPlan(report.tomorrowPlan || "");
    setFormNotes(report.notes || "");
    setFormStatus(report.status || "Submitted");
    setIsModalOpen(true);
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedUser = users.find((u) => u.id === formMemberId) || users[0];
    const completedTasksArr = formCompletedTasks
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const inProgressTasksArr = formInProgressTasks
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const blockedTasksArr = formBlockers
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split(":");
        return {
          taskTitle: parts[0]?.trim() || line,
          reason: parts[1]?.trim() || "Blocked",
        };
      });

    if (editingReport) {
      updateDailyReport(editingReport.id, {
        memberId: selectedUser?.id || editingReport.memberId,
        memberName: selectedUser?.fullName || editingReport.memberName,
        date: formDate,
        currentHours: formHours,
        completedTasks: completedTasksArr,
        inProgressTasks: inProgressTasksArr,
        blockedTasks: blockedTasksArr,
        tomorrowPlan: formTomorrowPlan,
        notes: formNotes,
        status: formStatus,
      });
      showToast("Daily report updated successfully.");
      if (selectedReport && selectedReport.id === editingReport.id) {
        setSelectedReport({
          ...selectedReport,
          memberId: selectedUser?.id || editingReport.memberId,
          memberName: selectedUser?.fullName || editingReport.memberName,
          date: formDate,
          currentHours: formHours,
          completedTasks: completedTasksArr,
          inProgressTasks: inProgressTasksArr,
          blockedTasks: blockedTasksArr,
          tomorrowPlan: formTomorrowPlan,
          notes: formNotes,
          status: formStatus,
        });
      }
    } else {
      submitDailyReport({
        memberId: selectedUser?.id || "usr-1",
        memberName: selectedUser?.fullName || "Staff Member",
        date: formDate,
        startTime: "09:00 AM",
        breakMinutes: 45,
        currentHours: formHours,
        completedTasks: completedTasksArr,
        inProgressTasks: inProgressTasksArr,
        blockedTasks: blockedTasksArr,
        tomorrowPlan: formTomorrowPlan,
        notes: formNotes,
        status: formStatus,
      });
      showToast("Daily report recorded successfully.");
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteDailyReport(deletingId);
      if (selectedReport?.id === deletingId) {
        setSelectedReport(null);
      }
      setDeletingId(null);
      showToast("Daily report deleted successfully.");
    }
  };

  const columns: ColumnDef<DailyWorkReport>[] = [
    {
      id: "member",
      header: "Employee",
      accessorKey: "memberName",
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-bold text-[#0F172A]">{row.memberName}</div>
          <div className="text-[11px] text-[#64748B]">Submitted at {row.submittedAt || "18:00 PM"}</div>
        </div>
      ),
    },
    {
      id: "date",
      header: "Report Date",
      accessorKey: "date",
      sortable: true,
    },
    {
      id: "completedTasks",
      header: "Completed Tasks",
      cell: (row) => (
        <span className="font-semibold text-xs text-[#16A34A] bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
          {row.completedTasks?.length || 0} Tasks Done
        </span>
      ),
    },
    {
      id: "workingHours",
      header: "Hours Logged",
      accessorKey: "currentHours",
      align: "center",
      cell: (row) => <span className="font-bold text-xs text-[#0F172A]">{row.currentHours || "8h 00m"}</span>,
    },
    {
      id: "status",
      header: "Approval Status",
      accessorKey: "status",
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: "actions",
      header: "Actions",
      align: "right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => setSelectedReport(row)}
            className="px-2.5 py-1 text-xs font-semibold text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
          >
            Review Report
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            title="Edit Report"
            className="p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingId(row.id)}
            title="Delete Report"
            className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#0F172A] text-white px-4 py-3 font-semibold shadow-lg text-xs animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-[#16A34A]" /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Daily Work Reports</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Audit staff work logs, task completions, reported blockers, and tomorrow plans.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#1D4ED8] transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Record Daily Report</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          title="Total Submissions"
          value={dailyReports.length}
          subtext="Today's reported logs"
          icon={Clock}
          variant="blue"
        />
        <MetricCard
          title="Approved"
          value={dailyReports.filter((r) => r.status === "Submitted").length}
          subtext="Verified work records"
          icon={CheckCircle2}
          variant="emerald"
        />
        <MetricCard
          title="Pending Review"
          value={dailyReports.filter((r) => r.status === "Pending").length}
          subtext="Requires manager sign-off"
          icon={AlertCircle}
          variant="amber"
        />
        <MetricCard
          title="Avg Hours / Staff"
          value="8.2h"
          subtext="Standard working schedule"
          icon={Calendar}
          variant="indigo"
        />
      </div>

      {/* Reports Table or Empty State */}
      {dailyReports.length === 0 ? (
        <EmptyState
          title="No daily reports recorded"
          description="Track end-of-day employee progress, completed milestones, and potential project blockers."
          action={{
            label: "Record Daily Report",
            onClick: handleOpenAdd,
          }}
        />
      ) : (
        <DataTable
          data={dailyReports}
          columns={columns}
          searchPlaceholder="Search member name or date..."
          emptyTitle="No daily reports found"
          emptyDescription="There are no daily work reports submitted matching your search filter."
        />
      )}

      {/* Slide-Over Drawer for Reviewing Report */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-2xs animate-in fade-in">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-[#0F172A]">{selectedReport.memberName}</h3>
                  <StatusBadge status={selectedReport.status} />
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Report Date: <span className="font-semibold text-[#0F172A]">{selectedReport.date}</span> • Logged: <span className="font-semibold text-[#2563EB]">{selectedReport.currentHours || "8h 00m"}</span>
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    handleOpenEdit(selectedReport);
                  }}
                  className="p-2 text-[#64748B] hover:text-[#2563EB] hover:bg-white rounded-lg border border-transparent hover:border-[#E2E8F0] transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingId(selectedReport.id)}
                  className="p-2 text-[#64748B] hover:text-[#DC2626] hover:bg-white rounded-lg border border-transparent hover:border-[#E2E8F0] transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-white rounded-lg border border-transparent hover:border-[#E2E8F0] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              {/* Working Hours Bar */}
              <div className="grid grid-cols-3 gap-3 p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <div>
                  <span className="text-[#64748B] block">Start Time</span>
                  <span className="font-bold text-sm text-[#0F172A]">{selectedReport.startTime || "09:00 AM"}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block">Break Time</span>
                  <span className="font-bold text-sm text-[#0F172A]">{selectedReport.breakMinutes || 45} mins</span>
                </div>
                <div>
                  <span className="text-[#64748B] block">Total Duration</span>
                  <span className="font-bold text-sm text-[#2563EB]">{selectedReport.currentHours || "8h 00m"}</span>
                </div>
              </div>

              {/* Completed Tasks */}
              <div>
                <h4 className="font-bold text-xs text-[#16A34A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Completed Today ({selectedReport.completedTasks?.length || 0})
                </h4>
                {selectedReport.completedTasks && selectedReport.completedTasks.length > 0 ? (
                  <ul className="space-y-1.5">
                    {selectedReport.completedTasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-2 bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E2E8F0]">
                        <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                        <span className="text-[#0F172A] font-medium">{task}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#64748B] italic bg-[#F8FAFC] p-2.5 rounded-lg border border-dashed border-[#E2E8F0]">No completed tasks noted.</p>
                )}
              </div>

              {/* In Progress Tasks */}
              <div>
                <h4 className="font-bold text-xs text-[#2563EB] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> In Progress ({selectedReport.inProgressTasks?.length || 0})
                </h4>
                {selectedReport.inProgressTasks && selectedReport.inProgressTasks.length > 0 ? (
                  <ul className="space-y-1.5">
                    {selectedReport.inProgressTasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-2 bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E2E8F0]">
                        <div className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0 mt-1.5" />
                        <span className="text-[#0F172A] font-medium">{task}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#64748B] italic bg-[#F8FAFC] p-2.5 rounded-lg border border-dashed border-[#E2E8F0]">No in-progress tasks noted.</p>
                )}
              </div>

              {/* Blocked Tasks */}
              <div>
                <h4 className="font-bold text-xs text-[#DC2626] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Blockers & Issues ({selectedReport.blockedTasks?.length || 0})
                </h4>
                {selectedReport.blockedTasks && selectedReport.blockedTasks.length > 0 ? (
                  <ul className="space-y-1.5">
                    {selectedReport.blockedTasks.map((b, i) => (
                      <li key={i} className="bg-red-50/50 p-2.5 rounded-lg border border-red-100">
                        <span className="text-[#991B1B] font-bold block">{b.taskTitle}</span>
                        <span className="text-xs text-[#DC2626]">{b.reason}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#64748B] italic bg-[#F8FAFC] p-2.5 rounded-lg border border-dashed border-[#E2E8F0]">No blockers reported.</p>
                )}
              </div>

              {/* Tomorrow Plan */}
              <div>
                <h4 className="font-bold text-xs text-[#0F172A] uppercase tracking-wider mb-2">Tomorrow Plan</h4>
                <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] text-[#334155] whitespace-pre-wrap">
                  {selectedReport.tomorrowPlan || "No plan specified for tomorrow."}
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <h4 className="font-bold text-xs text-[#0F172A] uppercase tracking-wider mb-2">Additional Notes</h4>
                <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] text-[#334155] whitespace-pre-wrap">
                  {selectedReport.notes || "No additional comments."}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {selectedReport.status !== "Submitted" ? (
                  <button
                    onClick={() => {
                      updateDailyReportStatus(selectedReport.id, "Submitted");
                      setSelectedReport({ ...selectedReport, status: "Submitted" });
                      showToast("Report approved successfully.");
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#16A34A] hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Check className="w-4 h-4" /> Approve Report
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      updateDailyReportStatus(selectedReport.id, "Pending");
                      setSelectedReport({ ...selectedReport, status: "Pending" });
                      showToast("Report marked as pending review.");
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                  >
                    <AlertCircle className="w-4 h-4" /> Mark Pending
                  </button>
                )}
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Daily Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4 bg-[#F8FAFC]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0F172A]">
                    {editingReport ? "Edit Daily Work Report" : "Record Daily Work Report"}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {editingReport ? "Update report log details" : "Add daily milestone entries for a staff member"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:bg-[#E2E8F0] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReport} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Team Member *
                  </label>
                  <select
                    value={formMemberId}
                    onChange={(e) => setFormMemberId(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Report Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Logged Hours
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8h 00m"
                    value={formHours}
                    onChange={(e) => setFormHours(e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Approval Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as "Submitted" | "Pending")}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  >
                    <option value="Submitted">Approved (Submitted)</option>
                    <option value="Pending">Pending Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Completed Tasks (One per line)
                </label>
                <textarea
                  rows={2}
                  value={formCompletedTasks}
                  onChange={(e) => setFormCompletedTasks(e.target.value)}
                  placeholder="Implemented authentication middleware&#10;Tested payment verification flow"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                  In Progress Tasks (One per line)
                </label>
                <textarea
                  rows={2}
                  value={formInProgressTasks}
                  onChange={(e) => setFormInProgressTasks(e.target.value)}
                  placeholder="Writing integration tests for invoice API"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Blockers / Issues (Format: Task: Reason)
                </label>
                <textarea
                  rows={2}
                  value={formBlockers}
                  onChange={(e) => setFormBlockers(e.target.value)}
                  placeholder="SMS Gateway: Awaiting DLT template approval from operator"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Tomorrow Plan
                </label>
                <textarea
                  rows={2}
                  value={formTomorrowPlan}
                  onChange={(e) => setFormTomorrowPlan(e.target.value)}
                  placeholder="Review pull requests and deploy staging update"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Notes
                </label>
                <input
                  type="text"
                  placeholder="Optional notes or feedback..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1D4ED8] transition-colors"
                >
                  <Check className="h-4 w-4" />
                  <span>{editingReport ? "Update Report" : "Save Report"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Delete Daily Report"
        description="Are you sure you want to delete this daily work report? This action cannot be undone."
        confirmText="Delete Report"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingId(null)}
      />
    </div>
  );
}
