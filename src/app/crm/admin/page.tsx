"use client";

import Link from "next/link";
import {
  MessageSquare,
  FolderKanban,
  CheckSquare,
  IndianRupee,
  TrendingUp,
  AlertCircle,
  Plus,
  ArrowUpRight,
  Clock,
  Users,
  CheckCircle2,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export default function AdminDashboard() {
  const { enquiries, projects, tasks, users, dailyReports, invoices } = useAppStore();

  const newEnquiriesCount = enquiries.filter((e) => e.status === "New" || e.status === "Qualified").length;
  const activeProjectsCount = projects.filter((p) => p.status === "In Progress" || p.status === "At Risk").length;
  const projectsAtRiskCount = projects.filter((p) => p.status === "At Risk").length;
  const completedProjectsCount = projects.filter((p) => p.status === "Completed").length;

  // Dynamic Revenue Calculation
  const totalInvoicedSum = invoices.reduce((acc, inv) => acc + (inv.amount || 0), 0);
  const paidInvoicesSum = invoices.filter((i) => i.status === "Paid").reduce((acc, inv) => acc + (inv.amount || 0), 0);
  const outstandingSum = totalInvoicedSum - paidInvoicesSum;

  // Dynamic Workload Calculation based on active tasks
  const inProgressTasksCount = tasks.filter((t) => t.status === "IN PROGRESS" || t.status === "TODO").length;
  const activeUsersCount = users.filter((u) => u.status === "Active").length;
  const overallWorkloadPct = activeUsersCount > 0 ? Math.min(100, Math.round((inProgressTasksCount / (activeUsersCount * 3)) * 100)) : 0;
  
  const totalHoursLoggedToday = dailyReports.reduce((acc, r) => {
    const hrs = parseFloat(r.currentHours) || 0;
    return acc + hrs;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">
              Internal CRM & Team Operations
            </h2>
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#2563EB] border border-blue-100">
              Live Command Center
            </span>
          </div>
          <p className="text-xs text-[#64748B]">
            Overview of client enquiries, ongoing software projects, team availability, and financial stats.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/crm/admin/enquiries"
            className="flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>New Enquiry</span>
          </Link>
          <Link
            href="/crm/admin/projects"
            className="flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </Link>
          <Link
            href="/crm/admin/team/members"
            className="flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
          >
            <Users className="h-4 w-4" />
            <span>Add Member</span>
          </Link>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-medium">New Enquiries</span>
            <div className="p-2 rounded-lg bg-blue-50 text-[#2563EB]">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#0F172A]">{newEnquiriesCount}</span>
            <span className="text-[11px] font-medium text-[#16A34A] flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> Live
            </span>
          </div>
          <div className="text-[11px] text-[#64748B]">{enquiries.length} total pipeline enquiries</div>
        </div>

        {/* Stat 2 */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-medium">Active Projects</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-[#16A34A]">
              <FolderKanban className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#0F172A]">{activeProjectsCount}</span>
            <span className={`text-[11px] font-medium ${projectsAtRiskCount > 0 ? "text-[#F59E0B]" : "text-[#64748B]"}`}>
              {projectsAtRiskCount} projects at risk
            </span>
          </div>
          <div className="text-[11px] text-[#64748B]">{completedProjectsCount} projects completed</div>
        </div>

        {/* Stat 3 */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-medium">Team Workload Today</span>
            <div className="p-2 rounded-lg bg-amber-50 text-[#F59E0B]">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#0F172A]">{overallWorkloadPct}%</span>
            <span className="text-[11px] font-medium text-[#16A34A]">{activeUsersCount}/{users.length} Active</span>
          </div>
          <div className="text-[11px] text-[#64748B]">{totalHoursLoggedToday}h logged today</div>
        </div>

        {/* Stat 4 */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-medium">Monthly Revenue</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#0F172A]">₹{totalInvoicedSum.toLocaleString("en-IN")}</span>
            <span className="text-[11px] font-medium text-[#16A34A]">₹{paidInvoicesSum.toLocaleString("en-IN")} collected</span>
          </div>
          <div className="text-[11px] text-[#64748B]">₹{outstandingSum.toLocaleString("en-IN")} outstanding balance</div>
        </div>
      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Enquiries Table */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-bold text-sm text-[#0F172A]">Recent Project Enquiries</h3>
                <p className="text-xs text-[#64748B]">Incoming leads needing qualification & follow-up</p>
              </div>
              <Link
                href="/crm/admin/enquiries"
                className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
              >
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              {enquiries.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#64748B]">
                  No enquiries recorded yet. Click <Link href="/crm/admin/enquiries" className="text-[#2563EB] font-bold underline">+ New Enquiry</Link> to create one.
                </div>
              ) : (
                <table className="w-full text-left table-compact">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Requirement</th>
                      <th>Est. Budget</th>
                      <th>Assigned To</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.slice(0, 4).map((enq) => (
                      <tr key={enq.id}>
                        <td className="font-semibold text-[#0F172A]">{enq.clientName}</td>
                        <td className="text-[#64748B]">{enq.requirement}</td>
                        <td className="font-medium text-[#0F172A]">₹{enq.estimatedBudget.toLocaleString("en-IN")}</td>
                        <td className="text-[#64748B]">{enq.assignedToName}</td>
                        <td>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              enq.status === "New"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : enq.status === "Qualified"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : enq.status === "Proposal"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {enq.status}
                          </span>
                        </td>
                        <td>
                          <Link
                            href={`/crm/admin/enquiries/${enq.id}`}
                            className="text-xs font-semibold text-[#2563EB] hover:underline"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Active Client Projects */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-bold text-sm text-[#0F172A]">Active Delivery Projects</h3>
                <p className="text-xs text-[#64748B]">Real-time software project progress & deadlines</p>
              </div>
              <Link
                href="/crm/admin/projects"
                className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
              >
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-[#F1F5F9]">
              {projects.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#64748B]">
                  No active projects. Click <Link href="/crm/admin/projects" className="text-[#2563EB] font-bold underline">+ New Project</Link> to start one.
                </div>
              ) : (
                projects.slice(0, 3).map((prj) => (
                  <div key={prj.id} className="p-4 hover:bg-[#F8FAFC] transition-colors flex items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <Link href={`/crm/admin/projects/${prj.id}`} className="font-bold text-sm text-[#0F172A] hover:text-[#2563EB]">
                          {prj.projectName}
                        </Link>
                        <span className="text-xs text-[#64748B]">({prj.clientName})</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            prj.status === "At Risk"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {prj.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[#64748B]">
                        <span>Manager: {prj.managerName}</span>
                        <span>Team: {prj.teamMembers.length} Members</span>
                        <span>Deadline: {prj.deadline}</span>
                      </div>
                    </div>
                    <div className="w-36 space-y-1 text-right">
                      <div className="text-xs font-bold text-[#0F172A]">{prj.progressPct}%</div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            prj.status === "At Risk" ? "bg-[#DC2626]" : "bg-[#2563EB]"
                          }`}
                          style={{ width: `${prj.progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col wide) */}
        <div className="space-y-6">
          {/* Team Workload Summary */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="font-bold text-sm text-[#0F172A]">Team Workload Today</h3>
                <p className="text-xs text-[#64748B]">Capacity & active tasks per member</p>
              </div>
              <Link href="/crm/admin/team/dashboard" className="text-xs font-semibold text-[#2563EB]">
                Details
              </Link>
            </div>
            <div className="space-y-3">
              {users.slice(0, 5).map((user) => {
                const userTasks = tasks.filter((t) => t.assignedTo === user.id && t.status !== "COMPLETED");
                const pct = Math.min(100, userTasks.length * 25);
                return (
                  <div key={user.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#0F172A]">{user.fullName}</span>
                      <span className="text-[#64748B]">{pct}% Workload</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          pct > 85 ? "bg-[#F59E0B]" : "bg-[#2563EB]"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Work Reports Activity */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="font-bold text-sm text-[#0F172A]">Daily Work Submissions</h3>
              <span className="text-xs text-[#16A34A] font-semibold">{dailyReports.length} Submitted Today</span>
            </div>
            <div className="space-y-3 text-xs">
              {dailyReports.length === 0 ? (
                <div className="text-center text-[#64748B] py-4">No daily work reports submitted today.</div>
              ) : (
                dailyReports.map((report) => (
                  <div key={report.id} className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0F172A]">{report.memberName}</span>
                      <span className="text-[10px] font-semibold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {report.currentHours}h
                      </span>
                    </div>
                    <p className="text-[#64748B] line-clamp-2">
                      {report.completedTasks.join(", ")}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
