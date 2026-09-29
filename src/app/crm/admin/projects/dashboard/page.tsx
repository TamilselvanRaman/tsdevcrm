"use client";

import { FolderKanban, CheckSquare, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function ProjectDashboardPage() {
  const { projects, tasks } = useAppStore();

  const activeProjects = projects.filter((p) => p.status === "In Progress" || p.status === "Planning");
  const completedProjects = projects.filter((p) => p.status === "Completed");
  const inProgressTasks = tasks.filter((t) => t.status === "IN PROGRESS");
  const pendingReviewTasks = tasks.filter((t) => t.status === "IN REVIEW");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Project Management Dashboard</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time delivery progress, milestone health, task velocity, and resource allocation.
          </p>
        </div>
        <Link
          href="/crm/admin/projects"
          className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
        >
          <span>View All Projects</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          title="Active Projects"
          value={activeProjects.length}
          subtext="Under active sprint"
          icon={FolderKanban}
          variant="blue"
        />
        <MetricCard
          title="Tasks In Progress"
          value={inProgressTasks.length}
          subtext="Engineering & design"
          icon={Clock}
          variant="amber"
        />
        <MetricCard
          title="Pending Reviews"
          value={pendingReviewTasks.length}
          subtext="Requires manager sign-off"
          icon={AlertTriangle}
          variant="rose"
        />
        <MetricCard
          title="Completed Projects"
          value={completedProjects.length}
          subtext="Delivered successfully"
          icon={CheckSquare}
          variant="emerald"
        />
      </div>

      {/* Project Delivery Health Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#0F172A]">Delivery Health & Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-4 hover:border-[#2563EB]/40 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                    {project.projectCode}
                  </span>
                  <h3 className="font-bold text-sm text-[#0F172A] mt-1.5">{project.projectName}</h3>
                  <p className="text-xs text-[#64748B]">{project.clientName}</p>
                </div>
                <StatusBadge status={project.status} size="sm" />
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748B] font-medium">Completion</span>
                  <span className="font-bold text-[#0F172A]">{project.progressPct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#2563EB] transition-all"
                    style={{ width: `${project.progressPct}%` }}
                  />
                </div>
              </div>

              {/* Details Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9] text-xs">
                <span className="text-[#64748B]">Manager: {project.managerName}</span>
                <Link
                  href={`/crm/admin/projects/${project.id}`}
                  className="font-semibold text-[#2563EB] hover:underline"
                >
                  Workspace →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
