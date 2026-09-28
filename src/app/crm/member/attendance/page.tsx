"use client";

import { useState } from "react";
import { Clock, Play, Pause, LogOut, CheckCircle2, Calendar } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export default function AttendancePage() {
  const { currentUserId, users, attendance, checkIn, startBreak, endBreak, checkOut } = useAppStore();

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];
  const todayStr = "2026-09-28";
  const myRecord = attendance.find((a) => a.memberId === currentUser.id && a.date === todayStr) || {
    id: "att-curr",
    memberId: currentUser.id,
    memberName: currentUser.fullName,
    date: todayStr,
    status: "Present" as const,
    checkInTime: "09:15 AM",
    breakStatus: "Working" as const,
    workingHours: "7h 20m",
  };

  const [toastMessage, setToastMessage] = useState("");

  const handleStartBreak = () => {
    startBreak(currentUser.id);
    setToastMessage("Break started.");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleEndBreak = () => {
    endBreak(currentUser.id);
    setToastMessage("Break ended. Resumed work.");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleCheckOut = () => {
    checkOut(currentUser.id);
    setToastMessage("Checked out successfully for today.");
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-3 font-semibold text-white shadow-lg text-xs">
          <CheckCircle2 className="h-4 w-4" /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Attendance</h1>
        <p className="text-xs text-[#64748B] mt-0.5">Track daily check-in, work hours and monthly logs.</p>
      </div>

      {/* Today's Status Main Card */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-[#16A34A] animate-pulse" />
            <div>
              <span className="text-xs font-semibold text-[#64748B]">Today&apos;s Status</span>
              <h2 className="text-lg font-bold text-[#16A34A]">🟢 Present</h2>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-[#64748B]">
            <div>Check In: <span className="font-bold text-[#0F172A]">{myRecord.checkInTime}</span></div>
            <div>Current Time: <span className="font-bold text-[#0F172A]">06:20 PM</span></div>
            <div>Working Hours: <span className="font-bold text-[#2563EB]">{myRecord.workingHours}</span></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {myRecord.breakStatus === "Working" ? (
            <button
              onClick={handleStartBreak}
              className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] shadow-2xs"
            >
              <Pause className="h-4 w-4 text-[#F59E0B]" />
              <span>Start Break</span>
            </button>
          ) : (
            <button
              onClick={handleEndBreak}
              className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] shadow-2xs"
            >
              <Play className="h-4 w-4 text-[#16A34A]" />
              <span>End Break</span>
            </button>
          )}

          <button
            onClick={handleCheckOut}
            className="flex items-center gap-2 rounded-xl bg-[#DC2626] px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-700 shadow-2xs"
          >
            <LogOut className="h-4 w-4" />
            <span>Check Out</span>
          </button>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-3">
        <h3 className="font-bold text-sm text-[#0F172A]">Weekly Work Hours</h3>
        <div className="grid grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
            <span className="text-[11px] text-[#64748B] block font-semibold">Mon</span>
            <span className="font-bold text-sm text-[#0F172A]">8h</span>
          </div>
          <div className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
            <span className="text-[11px] text-[#64748B] block font-semibold">Tue</span>
            <span className="font-bold text-sm text-[#0F172A]">7h 30m</span>
          </div>
          <div className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
            <span className="text-[11px] text-[#64748B] block font-semibold">Wed</span>
            <span className="font-bold text-sm text-[#0F172A]">8h</span>
          </div>
          <div className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
            <span className="text-[11px] text-[#64748B] block font-semibold">Thu</span>
            <span className="font-bold text-sm text-[#0F172A]">7h 45m</span>
          </div>
          <div className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
            <span className="text-[11px] text-[#64748B] block font-semibold">Fri</span>
            <span className="font-bold text-sm text-[#64748B]">—</span>
          </div>
        </div>
      </div>

      {/* Monthly Attendance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Days Present</span>
          <div className="text-2xl font-bold text-[#16A34A]">22</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Leave Taken</span>
          <div className="text-2xl font-bold text-[#F59E0B]">2</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Late Check-ins</span>
          <div className="text-2xl font-bold text-[#DC2626]">1</div>
        </div>
      </div>
    </div>
  );
}
