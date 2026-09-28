"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  CalendarCheck,
  TrendingUp,
  Activity,
  Plus,
  LogIn,
  LogOut,
  Coffee,
  CheckSquare,
  Search,
  Filter,
  Shield,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { AttendanceRecord } from "@/types";

export default function TeamDashboardPage() {
  const { users, dailyReports, tasks, attendance } = useAppStore();
  const [attendanceSearch, setAttendanceSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const today = new Date().toISOString().split("T")[0];

  // Merge users with attendance records to get full team attendance status
  const memberAttendanceList = users.map((user) => {
    const record = attendance.find(
      (a) => a.memberId === user.id || a.memberName.toLowerCase() === user.fullName.toLowerCase()
    );

    const report = dailyReports.find(
      (r) => r.memberId === user.id || r.memberName.toLowerCase() === user.fullName.toLowerCase()
    );

    return {
      user,
      record: record || {
        id: `att-${user.id}`,
        memberId: user.id,
        memberName: user.fullName,
        date: today,
        status: user.status === "Active" ? ("Present" as const) : ("Leave" as const),
        checkInTime: user.status === "Active" ? "09:00 AM" : "—",
        checkOutTime: undefined,
        breakStatus: user.status === "Active" ? ("Working" as const) : ("Checked Out" as const),
        workingHours: user.status === "Active" ? "7h 00m" : "0h",
      },
      report,
    };
  });

  const filteredAttendance = memberAttendanceList.filter((item) => {
    const matchesSearch =
      item.user.fullName.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
      item.user.role.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
      item.user.team.toLowerCase().includes(attendanceSearch.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      item.record.breakStatus === statusFilter ||
      item.record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const presentCount = memberAttendanceList.filter(
    (a) => a.record.breakStatus === "Working" || a.record.breakStatus === "On Break"
  ).length;

  const checkedOutCount = memberAttendanceList.filter(
    (a) => a.record.breakStatus === "Checked Out"
  ).length;

  const onBreakCount = memberAttendanceList.filter(
    (a) => a.record.breakStatus === "On Break"
  ).length;

  const onLeaveCount = memberAttendanceList.filter(
    (a) => a.record.status === "Leave"
  ).length;

  const workloadData = [
    { member: "Tamil Selvan", role: "Lead Developer", tasks: 6, completed: 4, inProgress: 2, overdue: 0, workload: 85 },
    { member: "Priya Raman", role: "Lead Designer", tasks: 8, completed: 6, inProgress: 2, overdue: 0, workload: 92 },
    { member: "Arun Kumar", role: "Backend Developer", tasks: 5, completed: 3, inProgress: 1, overdue: 1, workload: 70 },
    { member: "Karthik Raja", role: "SEO Specialist", tasks: 4, completed: 3, inProgress: 1, overdue: 0, workload: 55 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Team Dashboard</h1>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              Live Operations
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time monitor for team attendance, login & logout time, workload, and daily work logs.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/team-portal/attendance"
            className="flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] shadow-2xs transition-all"
          >
            <Clock className="h-4 w-4 text-[#2563EB]" />
            <span>Clock Portal</span>
          </Link>
          <Link
            href="/team/members"
            className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Users className="h-4 w-4" />
            <span>Manage Team</span>
          </Link>
        </div>
      </div>

      {/* Top Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Team Members</span>
          <div className="text-xl font-bold text-[#0F172A]">{users.length} Total</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Currently Working</span>
          <div className="text-xl font-bold text-[#16A34A]">{presentCount} Active</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Checked Out</span>
          <div className="text-xl font-bold text-slate-700">{checkedOutCount} Logged Out</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Tasks Today</span>
          <div className="text-xl font-bold text-[#0F172A]">{tasks.length} Active</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Completed Today</span>
          <div className="text-xl font-bold text-[#16A34A]">
            {tasks.filter((t) => t.status === "COMPLETED").length} Done
          </div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Tracked Hours</span>
          <div className="text-xl font-bold text-[#2563EB]">48h 15m</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REAL-TIME TEAM ATTENDANCE, LOGIN & LOGOUT TRACKER TABLE                   */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#2563EB]" />
              <h3 className="font-bold text-sm text-[#0F172A]">
                TEAM ATTENDANCE & LOG TIME RECORDS
              </h3>
            </div>
            <p className="text-xs text-[#64748B]">
              Real-time daily login check-in, logout check-out time, break status and tracked work hours.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative min-w-[200px]">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[#94A3B8]" />
              <input
                type="text"
                value={attendanceSearch}
                onChange={(e) => setAttendanceSearch(e.target.value)}
                placeholder="Search member, role..."
                className="w-full rounded-lg border border-[#E2E8F0] bg-white pl-8 pr-3 py-1 text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1 text-xs font-medium text-[#0F172A] focus:border-[#2563EB] focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Working">Working (Active)</option>
              <option value="On Break">On Break</option>
              <option value="Checked Out">Checked Out</option>
              <option value="Leave">On Leave</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <tr>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Team Member</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Team / Role</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Login Time (Check-In)</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Logout Time (Check-Out)</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Current Status</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Working Hours</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Daily Report</th>
                <th className="py-3 px-4 font-semibold text-[#64748B] text-right">Log Record</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[#64748B]">
                    No attendance records found matching filters.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map(({ user, record, report }) => (
                  <tr key={user.id} className="hover:bg-[#F8FAFC] transition-colors">
                    {/* Member Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName}
                          className="h-8 w-8 rounded-full object-cover border border-[#E2E8F0]"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#0F172A]">{user.fullName}</span>
                          <span className="text-[10px] text-[#64748B]">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Team / Role */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-[#0F172A]">{user.role}</span>
                        <span className="text-[10px] text-[#64748B]">{user.team}</span>
                      </div>
                    </td>

                    {/* Login Check-in Time */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-50 text-[#16A34A] border border-emerald-200">
                          <LogIn className="h-3 w-3" />
                        </span>
                        <span className="font-bold text-[#0F172A]">
                          {record.checkInTime || "—"}
                        </span>
                      </div>
                    </td>

                    {/* Logout Check-out Time */}
                    <td className="py-3 px-4">
                      {record.checkOutTime ? (
                        <div className="flex items-center gap-1.5">
                          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                            <LogOut className="h-3 w-3" />
                          </span>
                          <span className="font-bold text-slate-700">{record.checkOutTime}</span>
                        </div>
                      ) : record.breakStatus === "Working" || record.breakStatus === "On Break" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Active / Logged In</span>
                        </span>
                      ) : (
                        <span className="text-[#94A3B8]">—</span>
                      )}
                    </td>

                    {/* Current Status */}
                    <td className="py-3 px-4">
                      {record.breakStatus === "Working" ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                          <Activity className="h-3 w-3" />
                          <span>Working</span>
                        </span>
                      ) : record.breakStatus === "On Break" ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-200">
                          <Coffee className="h-3 w-3" />
                          <span>On Break</span>
                        </span>
                      ) : record.breakStatus === "Checked Out" ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-300">
                          <LogOut className="h-3 w-3" />
                          <span>Checked Out</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-200">
                          <AlertCircle className="h-3 w-3" />
                          <span>On Leave</span>
                        </span>
                      )}
                    </td>

                    {/* Working Hours */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#0F172A] font-mono">
                        {record.workingHours || "0h"}
                      </span>
                    </td>

                    {/* Daily Report */}
                    <td className="py-3 px-4">
                      {report?.status === "Submitted" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Submitted ({report.submittedAt || "5:50 PM"})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Clock className="h-3 w-3" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>

                    {/* Log ID Tag */}
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono text-[10px] text-[#64748B] bg-slate-100 px-2 py-0.5 rounded">
                        {record.id}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Workload Capacity */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0]">
          <h3 className="font-bold text-sm text-[#0F172A]">TEAM WORKLOAD</h3>
          <p className="text-xs text-[#64748B]">Capacity allocation across team members</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <tr>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Member</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Tasks</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Completed</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">In Progress</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Overdue</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Workload Capacity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {workloadData.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#0F172A]">
                    {row.member} <span className="text-[10px] text-[#64748B] font-normal">({row.role})</span>
                  </td>
                  <td className="py-3 px-4 text-[#0F172A]">{row.tasks}</td>
                  <td className="py-3 px-4 text-[#16A34A] font-semibold">{row.completed}</td>
                  <td className="py-3 px-4 text-[#2563EB] font-semibold">{row.inProgress}</td>
                  <td className={`py-3 px-4 ${row.overdue > 0 ? "text-[#DC2626] font-semibold" : "text-[#64748B]"}`}>
                    {row.overdue}
                  </td>
                  <td className="py-3 px-4 w-48">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            row.workload > 85 ? "bg-[#F59E0B]" : "bg-[#2563EB]"
                          }`}
                          style={{ width: `${row.workload}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[#0F172A]">{row.workload}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2-Column Row: Today's Activity & Daily Work Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TODAY'S TEAM ACTIVITY */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-3">
            TODAY&apos;S TEAM ACTIVITY
          </h3>
          <div className="space-y-3 text-xs">
            <div className="border-l-2 border-[#2563EB] pl-3 py-1 space-y-0.5">
              <div className="font-semibold text-[#0F172A]">Tamil started Payment Integration</div>
              <div className="text-[10px] text-[#64748B]">Gateway Store • 10:00 AM</div>
            </div>
            <div className="border-l-2 border-[#16A34A] pl-3 py-1 space-y-0.5">
              <div className="font-semibold text-[#0F172A]">Priya completed Homepage Design</div>
              <div className="text-[10px] text-[#64748B]">Matrimony Platform • 11:30 AM</div>
            </div>
            <div className="border-l-2 border-[#F59E0B] pl-3 py-1 space-y-0.5">
              <div className="font-semibold text-[#0F172A]">Arun submitted API Testing for review</div>
              <div className="text-[10px] text-[#64748B]">Gateway Store • 02:15 PM</div>
            </div>
            <div className="border-l-2 border-[#16A34A] pl-3 py-1 space-y-0.5">
              <div className="font-semibold text-[#0F172A]">Karthik marked SEO task completed</div>
              <div className="text-[10px] text-[#64748B]">Dhilip Studio • 04:00 PM</div>
            </div>
          </div>
        </div>

        {/* DAILY WORK REPORTS */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0]">
            <h3 className="font-bold text-sm text-[#0F172A]">DAILY WORK REPORTS</h3>
            <p className="text-xs text-[#64748B]">End of day logs submitted by team</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <tr>
                  <th className="py-3 px-4 font-semibold text-[#64748B]">Member</th>
                  <th className="py-3 px-4 font-semibold text-[#64748B]">Report Status</th>
                  <th className="py-3 px-4 font-semibold text-[#64748B]">Hours</th>
                  <th className="py-3 px-4 font-semibold text-[#64748B]">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {dailyReports.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#0F172A]">{r.memberName}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0F172A]">{r.currentHours}</td>
                    <td className="py-3 px-4 text-[#64748B]">Yes ({r.submittedAt})</td>
                  </tr>
                ))}
                <tr className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#0F172A]">Arun Kumar</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      Pending
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#64748B]">—</td>
                  <td className="py-3 px-4 text-[#DC2626] font-semibold">No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
