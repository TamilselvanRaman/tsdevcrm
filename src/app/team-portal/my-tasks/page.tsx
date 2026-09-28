"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Clock,
  Play,
  Check,
  AlertTriangle,
  Send,
  Eye,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { TaskStatus } from "@/types";

export default function MyTasksPage() {
  const { tasks, currentUserId, users, updateTaskStatus, toggleTaskBlock } = useAppStore();

  const [activeTab, setActiveTab] = useState<"Today" | "Upcoming" | "Overdue" | "Completed">("Today");

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];
  const myTasks = tasks.filter((t) => t.assignedTo === currentUser.id || t.assignedToName === currentUser.fullName);

  const todayTasks = myTasks.filter((t) => t.dueDate === "2026-09-28" || t.status === "IN PROGRESS" || t.status === "TODO");
  const upcomingTasks = myTasks.filter((t) => t.dueDate > "2026-09-28");
  const overdueTasks = myTasks.filter((t) => t.isBlocked || t.status === "CHANGES REQUESTED");
  const completedTasks = myTasks.filter((t) => t.status === "COMPLETED");

  const getDisplayedTasks = () => {
    switch (activeTab) {
      case "Today": return todayTasks;
      case "Upcoming": return upcomingTasks;
      case "Overdue": return overdueTasks;
      case "Completed": return completedTasks;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">My Tasks</h1>
        <p className="text-xs text-[#64748B] mt-0.5">Your assigned work and active tasks.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Today</span>
          <div className="text-xl font-bold text-[#0F172A]">6</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">In Progress</span>
          <div className="text-xl font-bold text-[#2563EB]">2</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Completed</span>
          <div className="text-xl font-bold text-[#16A34A]">3</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Overdue / Blocked</span>
          <div className="text-xl font-bold text-[#DC2626]">1</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs">
        <div className="flex items-center gap-6 border-b border-[#E2E8F0] px-5 pt-3">
          {(["Today", "Upcoming", "Overdue", "Completed"] as const).map((tab) => (
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

        {/* Task List / Cards */}
        <div className="p-4 space-y-3">
          {getDisplayedTasks().length === 0 ? (
            <div className="py-8 text-center text-xs text-[#64748B]">No tasks under this tab</div>
          ) : (
            getDisplayedTasks().map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#2563EB] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#2563EB]">{task.taskKey}</span>
                    <Link href={`/tasks/${task.id}`} className="font-bold text-sm text-[#0F172A] hover:text-[#2563EB]">
                      {task.title}
                    </Link>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        task.priority === "High" || task.priority === "Urgent"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <div className="text-xs text-[#64748B]">
                    Project: <span className="font-semibold text-[#0F172A]">{task.projectName}</span> • Due: {task.dueDate} • Hours:{" "}
                    <span className="font-semibold text-[#0F172A]">{task.actualHours}h / {task.estimatedHours}h</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  {task.status !== "IN PROGRESS" && task.status !== "COMPLETED" && (
                    <button
                      onClick={() => updateTaskStatus(task.id, "IN PROGRESS")}
                      className="flex items-center gap-1 rounded-lg bg-[#2563EB] px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      <Play className="h-3.5 w-3.5" /> Start
                    </button>
                  )}

                  {task.status === "IN PROGRESS" && (
                    <button
                      onClick={() => updateTaskStatus(task.id, "IN REVIEW")}
                      className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#0F172A]"
                    >
                      <Send className="h-3.5 w-3.5" /> Submit Review
                    </button>
                  )}

                  {task.status !== "COMPLETED" && (
                    <button
                      onClick={() => updateTaskStatus(task.id, "COMPLETED")}
                      className="flex items-center gap-1 rounded-lg bg-[#16A34A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      <Check className="h-3.5 w-3.5" /> Complete
                    </button>
                  )}

                  <Link
                    href={`/tasks/${task.id}`}
                    className="p-1.5 text-[#2563EB] hover:bg-white rounded-lg border border-[#E2E8F0]"
                    title="View Detail"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
