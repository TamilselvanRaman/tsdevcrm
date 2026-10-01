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
  Plus,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import { useAppStore, SYSTEM_FALLBACK_USER } from "@/store/useAppStore";
import { Task, TaskPriority, TaskStatus } from "@/types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";

export default function MyTasksPage() {
  const {
    tasks,
    currentUserId,
    users,
    projects,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<"Today" | "Upcoming" | "Overdue" | "Completed">("Today");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [estimatedHours, setEstimatedHours] = useState(4);
  const [actualHours, setActualHours] = useState(0);
  const [description, setDescription] = useState("");

  const currentUser = users.find((u) => u.id === currentUserId) || users[0] || SYSTEM_FALLBACK_USER;
  const myTasks = tasks.filter((t) => t.assignedTo === currentUser?.id || t.assignedToName === currentUser?.fullName);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayTasks = myTasks.filter((t) => t.dueDate === todayStr || t.status === "IN PROGRESS" || t.status === "TODO");
  const upcomingTasks = myTasks.filter((t) => t.dueDate > todayStr && t.status !== "COMPLETED");
  const overdueTasks = myTasks.filter((t) => t.isBlocked || (t.dueDate < todayStr && t.status !== "COMPLETED"));
  const completedTasks = myTasks.filter((t) => t.status === "COMPLETED");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getDisplayedTasks = () => {
    switch (activeTab) {
      case "Today": return todayTasks;
      case "Upcoming": return upcomingTasks;
      case "Overdue": return overdueTasks;
      case "Completed": return completedTasks;
    }
  };

  const handleOpenAdd = () => {
    setEditingTask(null);
    setTitle("");
    setProjectId(projects[0]?.id || "");
    setPriority("Medium");
    setStatus("TODO");
    setDueDate(new Date().toISOString().split("T")[0]);
    setEstimatedHours(4);
    setActualHours(0);
    setDescription("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setProjectId(task.projectId);
    setPriority(task.priority);
    setStatus(task.status);
    setDueDate(task.dueDate);
    setEstimatedHours(task.estimatedHours || 4);
    setActualHours(task.actualHours || 0);
    setDescription(task.description || "");
    setIsModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === projectId) || projects[0];

    if (editingTask) {
      updateTask(editingTask.id, {
        title,
        projectId: proj?.id || editingTask.projectId,
        projectName: proj?.projectName || editingTask.projectName,
        priority,
        status,
        dueDate,
        estimatedHours: Number(estimatedHours),
        actualHours: Number(actualHours),
        description,
      });
      showToast("Task updated successfully.");
    } else {
      createTask({
        title,
        projectId: proj?.id || "proj-1",
        projectName: proj?.projectName || "General Work",
        priority,
        status,
        dueDate,
        assignedTo: currentUser?.id || "usr-1",
        assignedToName: currentUser?.fullName || "Me",
        assignedToAvatar: currentUser?.avatarUrl,
        estimatedHours: Number(estimatedHours),
        description,
        isBlocked: false,
      });
      showToast("New task created successfully.");
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteTask(deletingId);
      setDeletingId(null);
      showToast("Task deleted successfully.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#0F172A] text-white px-4 py-3 font-semibold shadow-lg text-xs animate-in fade-in slide-in-from-top-2">
          <CheckSquare className="h-4 w-4 text-[#16A34A]" /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">My Tasks</h1>
          <p className="text-xs text-[#64748B] mt-0.5">Your assigned work and active tasks.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#1D4ED8] transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Today</span>
          <div className="text-xl font-bold text-[#0F172A]">{todayTasks.length}</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">In Progress</span>
          <div className="text-xl font-bold text-[#2563EB]">
            {myTasks.filter((t) => t.status === "IN PROGRESS").length}
          </div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Completed</span>
          <div className="text-xl font-bold text-[#16A34A]">{completedTasks.length}</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Overdue / Blocked</span>
          <div className="text-xl font-bold text-[#DC2626]">{overdueTasks.length}</div>
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
              {tab} (
              {tab === "Today"
                ? todayTasks.length
                : tab === "Upcoming"
                ? upcomingTasks.length
                : tab === "Overdue"
                ? overdueTasks.length
                : completedTasks.length}
              )
            </button>
          ))}
        </div>

        {/* Task List / Cards */}
        <div className="p-4 space-y-3">
          {getDisplayedTasks().length === 0 ? (
            <div className="py-12 text-center text-xs text-[#64748B] space-y-2">
              <p>No tasks found under {activeTab}.</p>
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Create a task
              </button>
            </div>
          ) : (
            getDisplayedTasks().map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#2563EB] transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[#2563EB]">{task.taskKey}</span>
                    <span className="font-bold text-sm text-[#0F172A]">{task.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        task.priority === "High" || task.priority === "Urgent"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-[#2563EB] border border-blue-200">
                      {task.status}
                    </span>
                  </div>
                  <div className="text-xs text-[#64748B]">
                    Project: <span className="font-semibold text-[#0F172A]">{task.projectName}</span> • Due:{" "}
                    {task.dueDate} • Hours:{" "}
                    <span className="font-semibold text-[#0F172A]">
                      {task.actualHours || 0}h / {task.estimatedHours || 0}h
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-xs text-[#64748B] line-clamp-1">{task.description}</p>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {task.status !== "IN PROGRESS" && task.status !== "COMPLETED" && (
                    <button
                      onClick={() => {
                        updateTaskStatus(task.id, "IN PROGRESS");
                        showToast(`Task ${task.taskKey} started.`);
                      }}
                      className="flex items-center gap-1 rounded-lg bg-[#2563EB] px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                      <Play className="h-3.5 w-3.5" /> Start
                    </button>
                  )}

                  {task.status === "IN PROGRESS" && (
                    <button
                      onClick={() => {
                        updateTaskStatus(task.id, "IN REVIEW");
                        showToast(`Task ${task.taskKey} submitted for review.`);
                      }}
                      className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#0F172A] hover:bg-slate-50 transition-colors"
                    >
                      <Send className="h-3.5 w-3.5" /> Submit Review
                    </button>
                  )}

                  {task.status !== "COMPLETED" && (
                    <button
                      onClick={() => {
                        updateTaskStatus(task.id, "COMPLETED");
                        showToast(`Task ${task.taskKey} marked complete!`);
                      }}
                      className="flex items-center gap-1 rounded-lg bg-[#16A34A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                    >
                      <Check className="h-3.5 w-3.5" /> Complete
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenEdit(task)}
                    className="p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-white rounded-lg border border-transparent hover:border-[#E2E8F0] transition-colors"
                    title="Edit Task"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setDeletingId(task.id)}
                    className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-white rounded-lg border border-transparent hover:border-[#E2E8F0] transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Task Modal (Create & Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4 bg-[#F8FAFC]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB]">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0F172A]">
                    {editingTask ? `Edit Task (${editingTask.taskKey})` : "Create New Task"}
                  </h3>
                  <p className="text-xs text-[#64748B]">Fill in task specifications and deadlines</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:bg-[#E2E8F0] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Webhook Handler"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN PROGRESS">In Progress</option>
                    <option value="IN REVIEW">In Review</option>
                    <option value="CHANGES REQUESTED">Changes Requested</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Est. Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Actual Hours
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={actualHours}
                    onChange={(e) => setActualHours(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Task details and acceptance criteria..."
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
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
                  <span>{editingTask ? "Update Task" : "Create Task"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Delete Task"
        description="Are you sure you want to remove this task? This action cannot be undone."
        confirmText="Delete Task"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingId(null)}
      />
    </div>
  );
}
