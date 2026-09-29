"use client";

import Link from "next/link";
import {
  CheckSquare,
  Clock,
  CalendarCheck,
  AlertCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { clsx } from "clsx";

export default function MemberDashboardPage() {
  const {
    currentUserId,
    users,
    tasks,
    dailyReports,
    attendance,
    notices,
  } = useAppStore();

  const currentUser =
    users.find((u) => u.id === currentUserId) ||
    users.find((u) => u.role !== "Admin") ||
    users[0] || {
      id: "usr-admin-1",
      fullName: "Team Member",
      role: "Developer",
      team: "Development",
      email: "member@tsdev.io",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    };

  // Filter tasks assigned to current member
  const myTasks = tasks.filter(
    (t) =>
      t.assignedTo === currentUser.id ||
      t.assignedTo === currentUser.fullName
  );

  const pendingTasks = myTasks.filter((t) => t.status === "TODO" || t.status === "BACKLOG");
  const inProgressTasks = myTasks.filter((t) => t.status === "IN PROGRESS" || t.status === "IN REVIEW");
  const completedTasks = myTasks.filter((t) => t.status === "COMPLETED");

  // Today's Date String
  const todayStr = new Date().toISOString().split("T")[0];

  // Today's Attendance
  const todayAttendance = attendance.find(
    (a) => (a.memberId === currentUser.id || a.memberName === currentUser.fullName) && a.date === todayStr
  );

  // Today's Work Report
  const todayReport = dailyReports.find(
    (r) => (r.memberId === currentUser.id || r.memberName === currentUser.fullName) && r.date === todayStr
  );

  // Recent 4 member reports
  const myReports = dailyReports
    .filter((r) => r.memberId === currentUser.id || r.memberName === currentUser.fullName)
    .slice(0, 4);

  // High priority tasks
  const urgentTasks = myTasks.filter(
    (t) => (t.priority === "High" || t.priority === "Urgent") && t.status !== "COMPLETED"
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xs relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              className="h-14 w-14 rounded-2xl object-cover border-2 border-white shadow-md ring-1 ring-slate-200"
            />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#16A34A] ring-2 ring-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
                Welcome back, {currentUser.fullName}!
              </h1>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#2563EB] border border-blue-200">
                {currentUser.team || currentUser.role}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Here is your daily workspace snapshot, assigned sprint tasks, and progress.
            </p>
          </div>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <Link
            href="/crm/member/daily-work"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
          >
            <CalendarCheck className="h-4 w-4" />
            <span>Log Daily Work</span>
          </Link>
          <Link
            href="/crm/member/attendance"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-xs font-semibold text-[#0F172A] hover:bg-white hover:border-[#2563EB]/40 transition-colors"
          >
            <Clock className="h-4 w-4 text-[#2563EB]" />
            <span>Attendance</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Assigned Tasks */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-medium">Assigned Tasks</span>
            <div className="rounded-xl bg-blue-50 p-2 text-[#2563EB]">
              <CheckSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0F172A]">{myTasks.length}</span>
            <span className="text-[11px] font-semibold text-[#64748B]">
              ({pendingTasks.length + inProgressTasks.length} active)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#2563EB] h-1.5 rounded-full transition-all duration-300"
              style={{
                width: myTasks.length > 0 ? `${(completedTasks.length / myTasks.length) * 100}%` : "0%",
              }}
            />
          </div>
        </div>

        {/* Metric 2: Completed Tasks */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-medium">Completed Tasks</span>
            <div className="rounded-xl bg-emerald-50 p-2 text-[#16A34A]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#16A34A]">{completedTasks.length}</span>
            <span className="text-[11px] font-semibold text-[#64748B]">
              {myTasks.length > 0
                ? `${Math.round((completedTasks.length / myTasks.length) * 100)}% done`
                : "0% done"}
            </span>
          </div>
          <span className="text-[11px] text-[#64748B] block truncate">
            {inProgressTasks.length} currently in progress
          </span>
        </div>

        {/* Metric 3: Today's Work Report */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-medium">Today's Work Log</span>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
              <CalendarCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0F172A]">
              {todayReport ? `${todayReport.currentHours || "8"} hrs` : "Pending"}
            </span>
            <span
              className={clsx(
                "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                todayReport ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              )}
            >
              {todayReport ? "Submitted" : "Not Logged"}
            </span>
          </div>
          <span className="text-[11px] text-[#64748B] block truncate">
            {todayReport ? `Tasks: ${todayReport.completedTasks.length || 1} logged` : "Submit daily log by EOD"}
          </span>
        </div>

        {/* Metric 4: Attendance Status */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-medium">Today's Attendance</span>
            <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-[#0F172A]">
              {todayAttendance ? todayAttendance.status : "Present"}
            </span>
            <span className="text-[11px] font-semibold text-[#16A34A] flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
              Active
            </span>
          </div>
          <span className="text-[11px] text-[#64748B] block truncate">
            Check-In: {todayAttendance?.checkInTime || "09:30 AM"}
          </span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Priority Tasks & In-Progress Work */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Tasks Box */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-[#2563EB]" />
                <h2 className="text-sm font-bold text-[#0F172A]">My Current Tasks</h2>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-[#64748B]">
                  {pendingTasks.length + inProgressTasks.length} Active
                </span>
              </div>
              <Link
                href="/crm/member/my-tasks"
                className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
              >
                <span>View All Tasks</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {myTasks.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] space-y-2">
                <CheckSquare className="h-8 w-8 text-[#94A3B8] mx-auto" />
                <p className="text-xs font-semibold text-[#0F172A]">No tasks assigned yet</p>
                <p className="text-[11px] text-[#64748B]">All current project sprints are clear.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#E2E8F0]">
                {myTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="py-3 flex items-start justify-between gap-3 group hover:bg-[#F8FAFC] px-2 rounded-xl transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px] font-bold text-[#2563EB]">
                          {task.taskKey || "TSK"}
                        </span>
                        <span className="font-semibold text-xs text-[#0F172A] truncate">
                          {task.title}
                        </span>
                        <span
                          className={clsx(
                            "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                            task.priority === "Urgent" && "bg-red-50 text-[#DC2626] border border-red-200",
                            task.priority === "High" && "bg-amber-50 text-amber-700 border border-amber-200",
                            task.priority === "Medium" && "bg-blue-50 text-[#2563EB] border border-blue-200",
                            task.priority === "Low" && "bg-slate-100 text-[#64748B]"
                          )}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-[#64748B]">
                        <span>Project: {task.projectName}</span>
                        <span>•</span>
                        <span>Due: {task.dueDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={clsx(
                          "rounded-lg px-2.5 py-1 text-[11px] font-bold",
                          task.status === "COMPLETED" && "bg-emerald-50 text-[#16A34A] border border-emerald-200",
                          task.status === "IN PROGRESS" && "bg-blue-50 text-[#2563EB] border border-blue-200",
                          (task.status === "TODO" || task.status === "BACKLOG") && "bg-slate-100 text-[#64748B]"
                        )}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Urgent Deadlines Attention Banner */}
          {urgentTasks.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <div className="font-bold text-[#0F172A]">
                  Priority Attention: {urgentTasks.length} High-Priority Task(s)
                </div>
                <p className="text-[#64748B]">
                  Ensure these tasks are logged with work updates today to maintain sprint deadlines.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: Daily Reports & Company Notices */}
        <div className="space-y-6">
          {/* Recent Daily Logs Card */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-[#2563EB]" />
                <h3 className="text-sm font-bold text-[#0F172A]">My Recent Work Logs</h3>
              </div>
              <Link
                href="/crm/member/daily-work"
                className="text-xs font-semibold text-[#2563EB] hover:underline"
              >
                Log Today
              </Link>
            </div>

            {myReports.length === 0 ? (
              <p className="text-xs text-[#64748B] py-3 text-center">No reports logged this week.</p>
            ) : (
              <div className="space-y-3">
                {myReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#0F172A]">{report.memberName}</span>
                      <span className="font-bold text-[#2563EB]">{report.currentHours || "8"} hrs</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] line-clamp-2">
                      {report.completedTasks.join(", ") || "Daily development sprint work"}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-[#94A3B8] pt-1 border-t border-slate-200/60">
                      <span>{report.date}</span>
                      <span className="text-emerald-700 font-semibold">{report.status || "Submitted"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Team Notices & Announcements */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <h3 className="text-sm font-bold text-[#0F172A]">Company Notices</h3>
              </div>
              <span className="text-[11px] text-[#64748B]">{notices.length} updates</span>
            </div>

            <div className="space-y-2.5">
              {notices.slice(0, 3).map((notice) => (
                <div
                  key={notice.id}
                  className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#0F172A]">{notice.title}</span>
                    <span className="text-[10px] text-purple-700 font-semibold">{notice.publishedDate}</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] line-clamp-2">{notice.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
