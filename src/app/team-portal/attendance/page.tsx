"use client";

import { useState } from "react";
import {
  Clock,
  Play,
  Pause,
  LogOut,
  CheckCircle2,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  CalendarCheck,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { AttendanceRecord } from "@/types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function AttendancePage() {
  const {
    currentUserId,
    users,
    attendance,
    checkIn,
    startBreak,
    endBreak,
    checkOut,
    recordAttendance,
    updateAttendance,
    deleteAttendance,
  } = useAppStore();

  const currentUser = users.find((u) => u.id === currentUserId) || users[0] || {
    id: "usr-1",
    fullName: "Staff Member",
    role: "Team Member",
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const myTodayRecord = attendance.find(
    (a) => (a.memberId === currentUser.id || a.memberName === currentUser.fullName) && a.date === todayStr
  );

  const myRecords = attendance.filter(
    (a) => a.memberId === currentUser.id || a.memberName === currentUser.fullName
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formDate, setFormDate] = useState(todayStr);
  const [formStatus, setFormStatus] = useState<"Present" | "Leave" | "Late" | "Half Day">("Present");
  const [formCheckInTime, setFormCheckInTime] = useState("09:00 AM");
  const [formCheckOutTime, setFormCheckOutTime] = useState("06:00 PM");
  const [formWorkingHours, setFormWorkingHours] = useState("8h 00m");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCheckInNow = () => {
    checkIn(currentUser.id);
    showToast("Checked in successfully. Have a productive day!");
  };

  const handleStartBreak = () => {
    startBreak(currentUser.id);
    showToast("Break started.");
  };

  const handleEndBreak = () => {
    endBreak(currentUser.id);
    showToast("Break ended. Resumed work.");
  };

  const handleCheckOut = () => {
    checkOut(currentUser.id);
    showToast("Checked out successfully for today.");
  };

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setFormDate(todayStr);
    setFormStatus("Present");
    setFormCheckInTime("09:00 AM");
    setFormCheckOutTime("06:00 PM");
    setFormWorkingHours("8h 00m");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rec: AttendanceRecord) => {
    setEditingRecord(rec);
    setFormDate(rec.date);
    setFormStatus(rec.status);
    setFormCheckInTime(rec.checkInTime || "09:00 AM");
    setFormCheckOutTime(rec.checkOutTime || "06:00 PM");
    setFormWorkingHours(rec.workingHours || "8h 00m");
    setIsModalOpen(true);
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecord) {
      updateAttendance(editingRecord.id, {
        date: formDate,
        status: formStatus,
        checkInTime: formCheckInTime,
        checkOutTime: formCheckOutTime,
        workingHours: formWorkingHours,
      });
      showToast("Attendance record updated.");
    } else {
      recordAttendance({
        id: `att-${Date.now()}`,
        memberId: currentUser.id,
        memberName: currentUser.fullName,
        date: formDate,
        status: formStatus,
        checkInTime: formCheckInTime,
        checkOutTime: formCheckOutTime,
        breakStatus: "Checked Out",
        workingHours: formWorkingHours,
      });
      showToast("Attendance record logged.");
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteAttendance(deletingId);
      setDeletingId(null);
      showToast("Attendance record deleted.");
    }
  };

  // Calculations for stats
  const daysPresent = myRecords.filter((r) => r.status === "Present").length;
  const leaveTaken = myRecords.filter((r) => r.status === "Leave").length;
  const lateCheckins = myRecords.filter((r) => r.status === "Late").length;

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
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Attendance</h1>
          <p className="text-xs text-[#64748B] mt-0.5">Track daily check-in, work hours and monthly logs.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] shadow-2xs transition-colors"
          >
            <Plus className="h-4 w-4 text-[#2563EB]" />
            <span>Log Attendance / Leave</span>
          </button>
        </div>
      </div>

      {/* Today's Status Main Card */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-3 w-3 rounded-full ${
                !myTodayRecord
                  ? "bg-slate-300"
                  : myTodayRecord.breakStatus === "Checked Out"
                  ? "bg-blue-500"
                  : myTodayRecord.breakStatus === "On Break"
                  ? "bg-amber-500"
                  : "bg-[#16A34A] animate-pulse"
              }`}
            />
            <div>
              <span className="text-xs font-semibold text-[#64748B]">Today&apos;s Status</span>
              <h2 className="text-lg font-bold text-[#0F172A]">
                {!myTodayRecord
                  ? "Not Checked In"
                  : myTodayRecord.breakStatus === "Checked Out"
                  ? "Checked Out"
                  : myTodayRecord.breakStatus === "On Break"
                  ? "On Break"
                  : "🟢 Working"}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-[#64748B]">
            <div>
              Check In:{" "}
              <span className="font-bold text-[#0F172A]">{myTodayRecord?.checkInTime || "—"}</span>
            </div>
            {myTodayRecord?.checkOutTime && (
              <div>
                Check Out:{" "}
                <span className="font-bold text-[#0F172A]">{myTodayRecord.checkOutTime}</span>
              </div>
            )}
            <div>
              Working Hours:{" "}
              <span className="font-bold text-[#2563EB]">
                {myTodayRecord?.workingHours || "0h 00m"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {!myTodayRecord ? (
            <button
              onClick={handleCheckInNow}
              className="flex items-center gap-2 rounded-xl bg-[#16A34A] px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-2xs transition-colors"
            >
              <Play className="h-4 w-4" />
              <span>Check In Now</span>
            </button>
          ) : myTodayRecord.breakStatus === "Checked Out" ? (
            <div className="text-xs font-medium text-[#64748B] italic">
              You have completed your shift and checked out for today.
            </div>
          ) : (
            <>
              {myTodayRecord.breakStatus === "Working" ? (
                <button
                  onClick={handleStartBreak}
                  className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] shadow-2xs transition-colors"
                >
                  <Pause className="h-4 w-4 text-[#F59E0B]" />
                  <span>Start Break</span>
                </button>
              ) : (
                <button
                  onClick={handleEndBreak}
                  className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] shadow-2xs transition-colors"
                >
                  <Play className="h-4 w-4 text-[#16A34A]" />
                  <span>End Break</span>
                </button>
              )}

              <button
                onClick={handleCheckOut}
                className="flex items-center gap-2 rounded-xl bg-[#DC2626] px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-700 shadow-2xs transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Check Out</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Monthly Attendance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Days Present</span>
          <div className="text-2xl font-bold text-[#16A34A]">{daysPresent}</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Leave Taken</span>
          <div className="text-2xl font-bold text-[#F59E0B]">{leaveTaken}</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Late Check-ins</span>
          <div className="text-2xl font-bold text-[#DC2626]">{lateCheckins}</div>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#0F172A]">Attendance Log History</h3>
          <span className="text-xs text-[#64748B]">{myRecords.length} Records</span>
        </div>
        {myRecords.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#64748B]">
            No attendance records logged yet. Check in or click &quot;Log Attendance / Leave&quot; above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-compact">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Break Status</th>
                  <th>Working Hours</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myRecords.map((r) => (
                  <tr key={r.id}>
                    <td className="font-bold text-[#0F172A]">{r.date}</td>
                    <td>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          r.status === "Present"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : r.status === "Leave"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : r.status === "Late"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="text-[#0F172A] font-medium">{r.checkInTime || "—"}</td>
                    <td className="text-[#0F172A] font-medium">{r.checkOutTime || "—"}</td>
                    <td className="text-[#64748B]">{r.breakStatus}</td>
                    <td className="font-bold text-[#2563EB]">{r.workingHours || "—"}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(r)}
                          className="p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Record"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(r.id)}
                          className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Record"
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

      {/* Log / Edit Attendance Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4 bg-[#F8FAFC]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB]">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0F172A]">
                    {editingRecord ? "Edit Attendance Record" : "Log Attendance / Leave"}
                  </h3>
                  <p className="text-xs text-[#64748B]">Record manual shift times or leave dates</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:bg-[#E2E8F0] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAttendance} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Status *
                </label>
                <select
                  value={formStatus}
                  onChange={(e) =>
                    setFormStatus(e.target.value as "Present" | "Leave" | "Late" | "Half Day")
                  }
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                >
                  <option value="Present">Present</option>
                  <option value="Leave">Leave</option>
                  <option value="Late">Late</option>
                  <option value="Half Day">Half Day</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Check In Time
                  </label>
                  <input
                    type="text"
                    placeholder="09:00 AM"
                    value={formCheckInTime}
                    onChange={(e) => setFormCheckInTime(e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Check Out Time
                  </label>
                  <input
                    type="text"
                    placeholder="06:00 PM"
                    value={formCheckOutTime}
                    onChange={(e) => setFormCheckOutTime(e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Total Working Hours
                </label>
                <input
                  type="text"
                  placeholder="e.g. 8h 00m"
                  value={formWorkingHours}
                  onChange={(e) => setFormWorkingHours(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
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
                  <span>{editingRecord ? "Update Record" : "Save Record"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Delete Attendance Record"
        description="Are you sure you want to remove this attendance entry? This action cannot be undone."
        confirmText="Delete Record"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingId(null)}
      />
    </div>
  );
}
