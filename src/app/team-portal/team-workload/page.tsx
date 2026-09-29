"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Clock, CheckCircle2, Plus, CheckSquare, X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { TaskPriority, TaskStatus } from "@/types";

export default function TeamWorkloadPage() {
  const { users, tasks, projects, createTask } = useAppStore();

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [taskTitle, setTaskTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const workloadData = users.map((user) => {
    const userTasks = tasks.filter(
      (t) => t.assignedTo === user.id || t.assignedToName === user.fullName
    );
    const active = userTasks.filter(
      (t) => t.status === "IN PROGRESS" || t.status === "TODO" || t.status === "IN REVIEW"
    ).length;
    const completed = userTasks.filter((t) => t.status === "COMPLETED").length;
    const workload = Math.min(100, Math.max(10, Math.round((active / 6) * 100)));
    const availability = active >= 4 ? "Busy" : "Available";
    return {
      id: user.id,
      name: user.fullName,
      role: user.role,
      team: user.team,
      avatarUrl: user.avatarUrl,
      active,
      completed,
      availability,
      workload,
    };
  });

  const handleOpenAssign = (userId: string) => {
    setSelectedUser(userId);
    setTaskTitle("");
    setProjectId(projects[0]?.id || "");
    setDueDate(new Date().toISOString().split("T")[0]);
    setPriority("Medium");
    setAssignModalOpen(true);
  };

  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    const assigned = users.find((u) => u.id === selectedUser) || users[0];
    const proj = projects.find((p) => p.id === projectId) || projects[0];

    createTask({
      title: taskTitle,
      projectId: proj?.id || "proj-1",
      projectName: proj?.projectName || "General Work",
      priority,
      status: "TODO",
      dueDate,
      assignedTo: assigned.id,
      assignedToName: assigned.fullName,
      assignedToAvatar: assigned.avatarUrl,
      estimatedHours: 4,
      description: `Assigned via Team Workload monitor to ${assigned.fullName}`,
      isBlocked: false,
    });

    setAssignModalOpen(false);
    showToast(`Task assigned to ${assigned.fullName}.`);
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
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Team Workload</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Operational team availability, current workload distribution, and instant task allocation.
          </p>
        </div>
        <button
          onClick={() => handleOpenAssign(users[0]?.id || "")}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#1D4ED8] transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Assign Workload Task</span>
        </button>
      </div>

      {/* Main Table */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-compact">
            <thead>
              <tr>
                <th>Team Member</th>
                <th>Department</th>
                <th>Active Tasks</th>
                <th>Completed</th>
                <th>Availability</th>
                <th>Workload Capacity</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workloadData.map((row) => (
                <tr key={row.id}>
                  <td className="font-semibold text-[#0F172A]">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-xs">
                        {row.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-[#0F172A]">{row.name}</div>
                        <div className="text-[10px] text-[#64748B]">{row.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-xs text-[#64748B]">{row.team || "Operations"}</td>
                  <td className="font-bold text-[#2563EB]">{row.active} Active</td>
                  <td className="text-[#16A34A] font-semibold">{row.completed} Completed</td>
                  <td>
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        row.availability === "Available"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {row.availability}
                    </span>
                  </td>
                  <td className="w-48">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            row.workload > 80
                              ? "bg-[#DC2626]"
                              : row.workload > 50
                              ? "bg-[#F59E0B]"
                              : "bg-[#2563EB]"
                          }`}
                          style={{ width: `${row.workload}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[#0F172A]">{row.workload}%</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => handleOpenAssign(row.id)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      + Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Task Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4 bg-[#F8FAFC]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB]">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0F172A]">Assign Workload Task</h3>
                  <p className="text-xs text-[#64748B]">Allocate an active task to balanced capacity</p>
                </div>
              </div>
              <button
                onClick={() => setAssignModalOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:bg-[#E2E8F0] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAssignTask} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Assign To *
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
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
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Billing Portal Wireframes"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Project *
                  </label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.projectName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Due Date
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1D4ED8] transition-colors"
                >
                  <span>Assign Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
