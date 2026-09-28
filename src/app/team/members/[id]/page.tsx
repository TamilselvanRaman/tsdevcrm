"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Shield,
  Clock,
  CheckSquare,
  FolderKanban,
  CalendarCheck,
  CheckCircle2,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export default function TeamMemberDetailPage() {
  const params = useParams();
  const userId = params?.id as string;
  const { users, tasks, projects, dailyReports, attendance } = useAppStore();

  const [activeTab, setActiveTab] = useState<"Overview" | "Tasks" | "Projects" | "Daily Work" | "Attendance">("Overview");

  const member = users.find((u) => u.id === userId) || users[0];
  const memberTasks = tasks.filter((t) => t.assignedTo === member?.id || t.assignedToName === member?.fullName);
  const memberProjects = projects.filter((p) => p.teamMembers.includes(member?.id) || p.managerId === member?.id);
  const memberLogs = dailyReports.filter((r) => r.memberId === member?.id || r.memberName === member?.fullName);
  const memberAttendance = attendance.filter((a) => a.memberId === member?.id || a.memberName === member?.fullName);

  if (!member) {
    return (
      <div className="p-8 text-center text-xs text-[#64748B]">
        Team member not found. <Link href="/team/members" className="text-[#2563EB]">Return to list</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xs">
        <Link
          href="/team/members"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <img src={member.avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover border-2 border-[#2563EB]" />

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#0F172A]">{member.fullName}</h1>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#2563EB] border border-blue-200">
              {member.role}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                member.status === "Active"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {member.status}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#64748B]">
            <span>Email: {member.email}</span>
            <span>Phone: {member.phone}</span>
            <span>Team: {member.team}</span>
          </div>
        </div>
      </div>

      {/* Overview Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Current Tasks</span>
          <div className="text-xl font-bold text-[#0F172A]">6</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Completed Tasks</span>
          <div className="text-xl font-bold text-[#16A34A]">48</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Overdue</span>
          <div className="text-xl font-bold text-[#DC2626]">1</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Assigned Projects</span>
          <div className="text-xl font-bold text-[#2563EB]">4</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Hours This Week</span>
          <div className="text-xl font-bold text-[#0F172A]">36h 20m</div>
        </div>
      </div>

      {/* Workload Visualization */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-2">
        <div className="flex justify-between text-xs font-bold text-[#0F172A]">
          <span>Current Workload Capacity</span>
          <span>85% (Active)</span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-[#2563EB]" style={{ width: "85%" }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs">
        <div className="flex items-center gap-6 border-b border-[#E2E8F0] px-5 pt-3">
          {(["Overview", "Tasks", "Projects", "Daily Work", "Attendance"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-xs font-semibold transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-[#2563EB] text-[#2563EB]"
                  : "border-transparent text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-5 text-xs">
          {activeTab === "Overview" && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-[#0F172A]">Assigned Tasks Overview</h4>
              <div className="divide-y divide-[#F1F5F9]">
                {memberTasks.map((t) => (
                  <div key={t.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <Link href={`/tasks/${t.id}`} className="font-semibold text-[#0F172A] hover:text-[#2563EB]">
                        [{t.taskKey}] {t.title}
                      </Link>
                      <div className="text-[11px] text-[#64748B]">{t.projectName}</div>
                    </div>
                    <span className="font-bold text-xs text-[#2563EB]">{t.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Tasks" && (
            <div className="space-y-2">
              {memberTasks.map((t) => (
                <div key={t.id} className="p-3 rounded-lg border border-[#E2E8F0] flex justify-between items-center">
                  <div>
                    <div className="font-bold text-[#0F172A]">{t.title}</div>
                    <div className="text-[11px] text-[#64748B]">Due: {t.dueDate}</div>
                  </div>
                  <span className="text-xs font-semibold text-[#2563EB]">{t.status}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Projects" && (
            <div className="space-y-2">
              {memberProjects.map((p) => (
                <div key={p.id} className="p-3 rounded-lg border border-[#E2E8F0] flex justify-between items-center">
                  <div>
                    <div className="font-bold text-[#0F172A]">{p.projectName}</div>
                    <div className="text-[11px] text-[#64748B]">Client: {p.clientName}</div>
                  </div>
                  <span className="text-xs font-bold text-[#2563EB]">{p.progressPct}% Progress</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Daily Work" && (
            <div className="space-y-2">
              {memberLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
                  <div className="font-bold text-[#0F172A]">{log.date} - {log.currentHours}</div>
                  <p className="text-[#64748B] mt-1">{log.completedTasks.join(", ")}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Attendance" && (
            <div className="space-y-2">
              {memberAttendance.map((att) => (
                <div key={att.id} className="p-3 rounded-lg border border-[#E2E8F0] flex justify-between">
                  <span className="font-semibold text-[#0F172A]">{att.date}</span>
                  <span className="text-[#16A34A] font-bold">{att.status} ({att.checkInTime})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
