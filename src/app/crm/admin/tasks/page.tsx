"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Clock,
  UserCheck,
  AlertCircle,
  Eye,
  CheckCircle2,
  X,
  ChevronRight,
  AlertTriangle,
  FolderKanban,
  CheckSquare,
  MessageSquare,
  Calendar,
  Send,
  ExternalLink,
  Shield,
  ArrowRight,
  MoreHorizontal,
  ChevronDown,
  Check,
  Edit2,
  Trash2,
} from "lucide-react";
import { useAppStore, SYSTEM_FALLBACK_USER } from "@/store/useAppStore";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { TaskStatus, TaskPriority, Task } from "@/types";
import { clsx } from "clsx";

interface ColumnDef {
  label: string;
  status: TaskStatus;
  accentColor: string;
  pillBg: string;
  dotColor: string;
}

const KANBAN_COLUMNS: ColumnDef[] = [
  {
    label: "Backlog",
    status: "BACKLOG",
    accentColor: "border-slate-300",
    pillBg: "bg-slate-100 text-slate-700 border-slate-200",
    dotColor: "bg-slate-400",
  },
  {
    label: "To Do",
    status: "TODO",
    accentColor: "border-blue-400",
    pillBg: "bg-blue-50 text-blue-700 border-blue-200",
    dotColor: "bg-[#2563EB]",
  },
  {
    label: "In Progress",
    status: "IN PROGRESS",
    accentColor: "border-amber-400",
    pillBg: "bg-amber-50 text-amber-800 border-amber-200",
    dotColor: "bg-amber-500",
  },
  {
    label: "In Review",
    status: "IN REVIEW",
    accentColor: "border-purple-400",
    pillBg: "bg-purple-50 text-purple-700 border-purple-200",
    dotColor: "bg-purple-500",
  },
  {
    label: "Changes Req.",
    status: "CHANGES REQUESTED",
    accentColor: "border-rose-400",
    pillBg: "bg-rose-50 text-rose-700 border-rose-200",
    dotColor: "bg-rose-500",
  },
  {
    label: "Completed",
    status: "COMPLETED",
    accentColor: "border-emerald-400",
    pillBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-[#16A34A]",
  },
];

function TaskStatusDropdown({
  currentStatus,
  onStatusChange,
  isOpen,
  onToggle,
  onClose,
}: {
  currentStatus: TaskStatus;
  onStatusChange: (status: TaskStatus) => void;
  isOpen: boolean;
  onToggle: (e: React.MouseEvent) => void;
  onClose: () => void;
}) {
  const currentDef = KANBAN_COLUMNS.find((c) => c.status === currentStatus) || KANBAN_COLUMNS[0];

  return (
    <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={onToggle}
        className={clsx(
          "group inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all duration-150 shadow-2xs cursor-pointer select-none",
          currentDef.pillBg,
          isOpen ? "ring-2 ring-blue-500/25 shadow-xs scale-[1.02]" : "hover:brightness-95"
        )}
      >
        <span className={clsx("h-1.5 w-1.5 rounded-full shrink-0", currentDef.dotColor)} />
        <span className="leading-tight">{currentDef.label}</span>
        <ChevronDown
          className={clsx("h-3 w-3 opacity-70 transition-transform duration-200 shrink-0", isOpen ? "rotate-180 opacity-100" : "group-hover:opacity-100")}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <div className="absolute right-0 top-full mt-1.5 z-50 w-48 origin-top-right rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-xl shadow-slate-900/10 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Move Task Stage
            </div>
            <div className="space-y-0.5 mt-0.5">
              {KANBAN_COLUMNS.map((col) => {
                const isSelected = col.status === currentStatus;
                return (
                  <button
                    key={col.status}
                    type="button"
                    onClick={() => {
                      onStatusChange(col.status);
                      onClose();
                    }}
                    className={clsx(
                      "flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors text-left cursor-pointer",
                      isSelected
                        ? `${col.pillBg} font-semibold`
                        : "text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className={clsx("h-2 w-2 rounded-full shrink-0", col.dotColor)} />
                      <span>{col.label}</span>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function TaskManagementPage() {
  const router = useRouter();
  const {
    tasks,
    projects,
    users,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    toggleTaskBlock,
    toggleChecklistItem,
    addChecklistItem,
    assignTask,
    addComment,
    currentUserId,
  } = useAppStore();

  const [activeDropdownTaskId, setActiveDropdownTaskId] = useState<string | null>(null);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0] || SYSTEM_FALLBACK_USER;

  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState<string>("All");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // New task form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || "");
  const [assignedTo, setAssignedTo] = useState(users[0]?.id || "");
  const [priority, setPriority] = useState<TaskPriority>("High");
  const [dueDate, setDueDate] = useState("2026-09-30");
  const [estHours, setEstHours] = useState("6");
  const [targetColumnStatus, setTargetColumnStatus] = useState<TaskStatus>("TODO");

  // Edit task form state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editProjectId, setEditProjectId] = useState("");
  const [editAssignedTo, setEditAssignedTo] = useState("");
  const [editPriority, setEditPriority] = useState<TaskPriority>("High");
  const [editDueDate, setEditDueDate] = useState("");
  const [editEstHours, setEditEstHours] = useState("4");
  const [editStatus, setEditStatus] = useState<TaskStatus>("TODO");

  // Drawer local state
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [blockerReasonInput, setBlockerReasonInput] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditProjectId(task.projectId);
    setEditAssignedTo(task.assignedTo);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate);
    setEditEstHours(task.estimatedHours ? task.estimatedHours.toString() : "4");
    setEditStatus(task.status);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTitle.trim()) return;

    const prj = projects.find((p) => p.id === editProjectId);
    const assignedUser = users.find((u) => u.id === editAssignedTo);

    updateTask(editingTask.id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      projectId: editProjectId,
      projectName: prj?.projectName || editingTask.projectName,
      assignedTo: editAssignedTo,
      assignedToName: assignedUser?.fullName || editingTask.assignedToName,
      assignedToAvatar: assignedUser?.avatarUrl || editingTask.assignedToAvatar,
      priority: editPriority,
      dueDate: editDueDate,
      estimatedHours: Number(editEstHours) || 1,
      status: editStatus,
    });

    showToast(`Task "${editTitle}" updated.`);
    setEditingTask(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingTaskId) return;
    deleteTask(deletingTaskId);
    if (selectedTaskId === deletingTaskId) {
      setSelectedTaskId(null);
    }
    showToast("Task deleted successfully.");
    setDeletingTaskId(null);
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.taskKey.toLowerCase().includes(search.toLowerCase()) ||
      t.projectName.toLowerCase().includes(search.toLowerCase());
    const matchesProject = projectFilter === "All" || t.projectId === projectFilter;
    const matchesAssignee = assigneeFilter === "All" || t.assignedTo === assigneeFilter;
    const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;
    return matchesSearch && matchesProject && matchesAssignee && matchesPriority;
  });

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const projId = selectedProjectId || (projects[0]?.id ?? "prj-201");
    const proj = projects.find((p) => p.id === projId) || projects[0];
    const assignId = assignedTo || (users[0]?.id ?? "usr-001");
    const assignedUser = users.find((u) => u.id === assignId) || users[0];

    addTask({
      title: title.trim(),
      description: description.trim() || `Delivery task for ${proj?.projectName || "Project"}`,
      projectId: projId,
      projectName: proj?.projectName || "Project",
      assignedTo: assignId,
      assignedToName: assignedUser?.fullName || "Tamil Selvan",
      assignedToAvatar:
        assignedUser?.avatarUrl ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      priority,
      status: targetColumnStatus,
      dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      estimatedHours: Number(estHours) || 6,
    });

    setIsAddModalOpen(false);
    setTitle("");
    setDescription("");
    showToast("Task created successfully!");
  };

  const handleOpenAddForColumn = (status: TaskStatus) => {
    setTargetColumnStatus(status);
    setTitle("");
    setDescription("");
    if (!selectedProjectId || !projects.some((p) => p.id === selectedProjectId)) {
      if (projects.length > 0) setSelectedProjectId(projects[0].id);
    }
    if (!assignedTo || !users.some((u) => u.id === assignedTo)) {
      if (users.length > 0) setAssignedTo(users[0].id);
    }
    setPriority("High");
    setDueDate(new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]);
    setEstHours("6");
    setIsAddModalOpen(true);
  };


  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedTaskId) return;
    addComment(selectedTaskId, newCommentText.trim());
    setNewCommentText("");
    showToast("Comment posted");
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistTitle.trim() || !selectedTaskId) return;
    addChecklistItem(selectedTaskId, newChecklistTitle.trim());
    setNewChecklistTitle("");
    showToast("Subtask added");
  };

  const handleAssigneeChange = (taskId: string, memberId: string) => {
    const member = users.find((u) => u.id === memberId);
    if (!member) return;
    assignTask(taskId, member.id, member.fullName, member.avatarUrl);
    showToast(`Task assigned to ${member.fullName}`);
  };

  const getPriorityStyle = (p: TaskPriority) => {
    switch (p) {
      case "Urgent":
      case "High":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Low":
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusBadgeStyle = (status: TaskStatus) => {
    switch (status) {
      case "BACKLOG":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "TODO":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "IN PROGRESS":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "IN REVIEW":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "CHANGES REQUESTED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 rounded-xl bg-[#0F172A] px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Delivery Tasks</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Agile Kanban board, sprint progress, and task workload tracking.
          </p>
        </div>
        <button
          onClick={() => handleOpenAddForColumn("TODO")}
          className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3 shadow-2xs">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search task title, key (TS-1042) or project..."
            className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-9 pr-3 py-1.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-hidden focus:border-[#2563EB] font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Project Filter */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0F172A] focus:outline-hidden"
          >
            <option value="All">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectName}
              </option>
            ))}
          </select>

          {/* Assignee Filter */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0F172A] focus:outline-hidden"
          >
            <option value="All">All Assignees</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.fullName}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0F172A] focus:outline-hidden"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("board")}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "board"
                  ? "bg-white shadow-2xs text-[#2563EB] border border-slate-200/60"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
              title="Board View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Board</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-white shadow-2xs text-[#2563EB] border border-slate-200/60"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
              title="List View"
            >
              <List className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Corporate Kanban Board View vs List View */}
      {viewMode === "board" ? (
        <div className="overflow-x-auto pb-6 pt-1 px-1 custom-scrollbar">
          <div className="flex items-start gap-4 min-w-max">
            {KANBAN_COLUMNS.map((col) => {
              const colTasks = filteredTasks.filter((t) => t.status === col.status);
              return (
                <div
                  key={col.status}
                  className="w-[290px] min-w-[290px] max-w-[290px] shrink-0 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]/90 p-3.5 flex flex-col gap-3 shadow-2xs transition-shadow"
                >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${col.dotColor}`} />
                    <span className="text-xs font-bold text-[#0F172A] tracking-tight">{col.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${col.pillBg}`}>
                      {colTasks.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenAddForColumn(col.status)}
                      className="p-1 text-[#64748B] hover:text-[#2563EB] hover:bg-white rounded-lg transition-colors cursor-pointer"
                      title={`Add task to ${col.label}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Task Cards Container */}
                <div className="space-y-2.5 min-h-[140px]">
                  {colTasks.length === 0 ? (
                    <div className="h-28 rounded-xl border border-dashed border-[#CBD5E1] bg-white/40 flex flex-col items-center justify-center text-center p-3">
                      <span className="text-[11px] text-[#94A3B8] font-medium">No tasks in {col.label}</span>
                      <button
                        type="button"
                        onClick={() => handleOpenAddForColumn(col.status)}
                        className="mt-1 text-[11px] font-bold text-[#2563EB] hover:underline cursor-pointer"
                      >
                        + Add Task
                      </button>
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const completedSubtasks = task.checklist?.filter((c) => c.done).length || 0;
                      const totalSubtasks = task.checklist?.length || 0;

                      return (
                        <div
                          key={task.id}
                          onClick={() => setSelectedTaskId(task.id)}
                          className={`rounded-xl border bg-white p-3.5 shadow-2xs space-y-2.5 cursor-pointer transition-all hover:shadow-md hover:border-[#2563EB]/40 group ${
                            selectedTaskId === task.id
                              ? "border-[#2563EB] ring-2 ring-blue-100"
                              : "border-[#E2E8F0]"
                          }`}
                        >
                          {/* Top Row: Key & Priority */}
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#2563EB] tracking-tight group-hover:underline">
                              {task.taskKey}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getPriorityStyle(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          {/* Task Title */}
                          <h3 className="font-bold text-xs text-[#0F172A] leading-snug group-hover:text-[#2563EB] transition-colors line-clamp-2">
                            {task.title}
                          </h3>

                          {/* Project Chip */}
                          <div className="flex items-center gap-1 text-[11px] text-[#64748B] font-medium truncate">
                            <FolderKanban className="h-3.5 w-3.5 text-[#94A3B8] shrink-0" />
                            <span className="truncate">{task.projectName}</span>
                          </div>

                          {/* Blocker Alert */}
                          {task.isBlocked && (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#DC2626] bg-red-50 p-2 rounded-lg border border-red-200">
                              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{task.blockReason || "Task Blocked"}</span>
                            </div>
                          )}

                          {/* Meta stats: Subtasks & Comments */}
                          {(totalSubtasks > 0 || (task.comments && task.comments.length > 0)) && (
                            <div className="flex items-center gap-3 text-[10px] text-[#64748B] pt-0.5">
                              {totalSubtasks > 0 && (
                                <span className="flex items-center gap-1 font-semibold text-[#0F172A]">
                                  <CheckSquare className="h-3 w-3 text-[#16A34A]" />
                                  {completedSubtasks}/{totalSubtasks}
                                </span>
                              )}
                              {task.comments && task.comments.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3 text-[#64748B]" />
                                  {task.comments.length}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Bottom Row: Assignee + Hours + Move Dropdown */}
                          <div
                            className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] text-xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center gap-1.5">
                              <img
                                src={task.assignedToAvatar}
                                alt={task.assignedToName}
                                className="h-5 w-5 rounded-full object-cover border border-[#E2E8F0]"
                              />
                              <span className="text-[11px] text-[#0F172A] font-semibold truncate max-w-[70px]">
                                {task.assignedToName}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] px-1.5 py-0.5 rounded">
                                {task.estimatedHours}h
                              </span>
                              <TaskStatusDropdown
                                currentStatus={task.status}
                                onStatusChange={(newStatus) => {
                                  updateTaskStatus(task.id, newStatus);
                                  showToast(`Moved to ${newStatus}`);
                                }}
                                isOpen={activeDropdownTaskId === `card-${task.id}`}
                                onToggle={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdownTaskId(
                                    activeDropdownTaskId === `card-${task.id}` ? null : `card-${task.id}`
                                  );
                                }}
                                onClose={() => setActiveDropdownTaskId(null)}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      ) : (
        /* Corporate List View Table */
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <tr>
                  <th className="py-3 px-4 font-semibold text-[#64748B]">Task Key</th>
                  <th className="py-3 px-4 font-semibold text-[#64748B]">Title</th>
                  <th className="py-3 px-4 font-semibold text-[#64748B]">Project</th>
                  <th className="py-3 px-4 font-semibold text-[#64748B]">Assigned To</th>
                  <th className="py-3 px-4 font-semibold text-[#64748B]">Priority</th>
                  <th className="py-3 px-4 font-semibold text-[#64748B]">Status</th>
                  <th className="py-3 px-4 font-semibold text-[#64748B]">Subtasks</th>
                  <th className="py-3 px-4 font-semibold text-[#64748B]">Est. Hours</th>
                  <th className="py-3 px-4 font-semibold text-[#64748B]">Due Date</th>
                  <th className="py-3 px-4 font-semibold text-[#64748B] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-10 text-center text-xs text-[#64748B]">
                      <CheckSquare className="mx-auto h-8 w-8 text-[#CBD5E1] mb-2" />
                      No tasks found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((t) => {
                    const completedSubtasks = t.checklist?.filter((c) => c.done).length || 0;
                    const totalSubtasks = t.checklist?.length || 0;

                    return (
                      <tr
                        key={t.id}
                        onClick={() => setSelectedTaskId(t.id)}
                        className={`cursor-pointer transition-colors hover:bg-blue-50/40 ${
                          selectedTaskId === t.id ? "bg-blue-50/70" : ""
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-[#2563EB] font-mono">{t.taskKey}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#0F172A] hover:text-[#2563EB]">{t.title}</span>
                            {t.isBlocked && (
                              <span className="text-[10px] font-bold text-[#DC2626] flex items-center gap-1 mt-0.5">
                                <AlertTriangle className="h-3 w-3" /> Blocked: {t.blockReason}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#64748B] font-medium">{t.projectName}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={t.assignedToAvatar}
                              alt={t.assignedToName}
                              className="h-6 w-6 rounded-full object-cover border border-[#E2E8F0]"
                            />
                            <span className="text-[#0F172A] font-medium">{t.assignedToName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold border ${getPriorityStyle(
                              t.priority
                            )}`}
                          >
                            {t.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <TaskStatusDropdown
                            currentStatus={t.status}
                            onStatusChange={(newStatus) => {
                              updateTaskStatus(t.id, newStatus);
                              showToast(`Status updated to ${newStatus}`);
                            }}
                            isOpen={activeDropdownTaskId === t.id}
                            onToggle={(e) => {
                              e.stopPropagation();
                              setActiveDropdownTaskId(activeDropdownTaskId === t.id ? null : t.id);
                            }}
                            onClose={() => setActiveDropdownTaskId(null)}
                          />
                        </td>
                        <td className="py-3 px-4 text-[#64748B]">
                          {totalSubtasks > 0 ? (
                            <span className="font-semibold text-[#0F172A] flex items-center gap-1">
                              <CheckSquare className="h-3.5 w-3.5 text-[#16A34A]" />
                              {completedSubtasks}/{totalSubtasks}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="py-3 px-4 text-[#64748B] font-medium">{t.estimatedHours}h</td>
                        <td className="py-3 px-4 text-[#64748B] font-medium">{t.dueDate}</td>
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedTaskId(t.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] shadow-2xs transition-colors cursor-pointer"
                              title="Open Task Workspace"
                            >
                              <Eye className="h-3.5 w-3.5 text-[#2563EB]" />
                              <span>View</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(t)}
                              className="p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Task"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingTaskId(t.id)}
                              className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Task"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <Link
                              href={`/tasks/${t.id}`}
                              className="inline-flex p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors"
                              title="Open Full Page"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-over Task Workspace Drawer */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-2xs">
          <div className="h-full w-full max-w-xl border-l border-[#E2E8F0] bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Drawer Header & Content */}
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {selectedTask.taskKey}
                    </span>
                    <span className="text-xs text-[#64748B] font-semibold">
                      {selectedTask.projectName}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-[#0F172A]">{selectedTask.title}</h2>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(selectedTask)}
                    className="p-1.5 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-blue-50 cursor-pointer"
                    title="Edit Task"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeletingTaskId(selectedTask.id)}
                    className="p-1.5 rounded-lg text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 cursor-pointer"
                    title="Delete Task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <Link
                    href={`/tasks/${selectedTask.id}`}
                    className="p-1.5 rounded-lg text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A]"
                    title="Open Full Page"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => setSelectedTaskId(null)}
                    className="p-1.5 rounded-lg text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A] cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Status & Priority Selectors */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div>
                  <label className="text-[11px] font-semibold text-[#64748B] block mb-1">
                    Workflow Status
                  </label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => {
                      updateTaskStatus(selectedTask.id, e.target.value as TaskStatus);
                      showToast(`Status updated to ${e.target.value}`);
                    }}
                    className={`w-full rounded-lg border px-2.5 py-1.5 text-xs font-bold focus:outline-hidden cursor-pointer ${getStatusBadgeStyle(
                      selectedTask.status
                    )}`}
                  >
                    {KANBAN_COLUMNS.map((c) => (
                      <option key={c.status} value={c.status}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#64748B] block mb-1">
                    Priority Level
                  </label>
                  <span
                    className={`inline-flex items-center w-full justify-center rounded-lg border px-2.5 py-1.5 text-xs font-bold ${getPriorityStyle(
                      selectedTask.priority
                    )}`}
                  >
                    {selectedTask.priority} Priority
                  </span>
                </div>
              </div>

              {/* Assignee Card */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                    <UserCheck className="h-4 w-4 text-[#2563EB]" />
                    Task Assignee
                  </span>
                  <span className="text-[10px] text-[#64748B]">Click to reassign</span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={selectedTask.assignedToAvatar}
                    alt={selectedTask.assignedToName}
                    className="h-9 w-9 rounded-full object-cover border border-[#E2E8F0]"
                  />
                  <div className="flex-1">
                    <select
                      value={selectedTask.assignedTo}
                      onChange={(e) => handleAssigneeChange(selectedTask.id, e.target.value)}
                      className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-xs font-semibold text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                    >
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.fullName} — ({u.role}, {u.team})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Task Details Row */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white space-y-1">
                  <span className="text-[#64748B]">Estimated Time</span>
                  <div className="text-sm font-bold text-[#0F172A]">{selectedTask.estimatedHours} Hours</div>
                </div>
                <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white space-y-1">
                  <span className="text-[#64748B]">Due Deadline</span>
                  <div className="text-sm font-semibold text-[#0F172A]">{selectedTask.dueDate}</div>
                </div>
              </div>

              {/* Blocker Action Card */}
              <div
                className={`p-3.5 rounded-xl border transition-colors ${
                  selectedTask.isBlocked
                    ? "bg-red-50 border-red-200 text-red-900"
                    : "bg-[#F8FAFC] border-[#E2E8F0]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={`h-4 w-4 ${selectedTask.isBlocked ? "text-[#DC2626]" : "text-[#64748B]"}`}
                    />
                    <span className="text-xs font-bold">
                      {selectedTask.isBlocked ? "Task is Currently Blocked" : "Report Blocker / Impediment"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      toggleTaskBlock(selectedTask.id, blockerReasonInput || "Waiting for backend API specs");
                      showToast(selectedTask.isBlocked ? "Blocker resolved" : "Task marked as blocked");
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                      selectedTask.isBlocked
                        ? "bg-white text-red-700 border border-red-200 hover:bg-red-100"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {selectedTask.isBlocked ? "Resolve Blocker" : "Mark as Blocked"}
                  </button>
                </div>
                {selectedTask.isBlocked && selectedTask.blockReason && (
                  <p className="text-xs text-red-700 mt-2 font-medium bg-white/80 p-2 rounded-lg border border-red-200">
                    Reason: {selectedTask.blockReason}
                  </p>
                )}
              </div>

              {/* Subtasks / Checklist Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                    <CheckSquare className="h-4 w-4 text-[#2563EB]" />
                    Subtasks / Checklist ({selectedTask.checklist?.filter((c) => c.done).length || 0}/
                    {selectedTask.checklist?.length || 0})
                  </h3>
                </div>

                {/* Add Subtask Form */}
                <form onSubmit={handleAddChecklist} className="flex gap-2">
                  <input
                    type="text"
                    value={newChecklistTitle}
                    onChange={(e) => setNewChecklistTitle(e.target.value)}
                    placeholder="Add new subtask item..."
                    className="flex-1 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:bg-white focus:outline-hidden focus:border-[#2563EB]"
                  />
                  <button
                    type="submit"
                    disabled={!newChecklistTitle.trim()}
                    className="rounded-xl bg-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    Add
                  </button>
                </form>

                {/* Checklist items list */}
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {(!selectedTask.checklist || selectedTask.checklist.length === 0) ? (
                    <div className="p-3 text-center text-xs text-[#94A3B8] bg-[#F8FAFC] rounded-lg">
                      No subtasks added yet. Add items above.
                    </div>
                  ) : (
                    selectedTask.checklist.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleChecklistItem(selectedTask.id, item.id)}
                        className="flex items-center gap-2.5 p-2 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] cursor-pointer transition-colors text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={item.done}
                          onChange={() => {}}
                          className="h-4 w-4 rounded text-[#2563EB] focus:ring-0 cursor-pointer"
                        />
                        <span
                          className={`flex-1 font-medium ${
                            item.done ? "line-through text-[#94A3B8]" : "text-[#0F172A]"
                          }`}
                        >
                          {item.text}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Developer Comments & Activity */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-[#2563EB]" />
                  Discussion & Work Notes ({selectedTask.comments?.length || 0})
                </h3>

                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="space-y-2">
                  <textarea
                    rows={2}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder={`Post comment as ${currentUser?.fullName || "Admin"}...`}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:bg-white focus:outline-hidden focus:border-[#2563EB]"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newCommentText.trim()}
                      className="flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      <Send className="h-3 w-3" />
                      <span>Post Comment</span>
                    </button>
                  </div>
                </form>

                {/* Comments Stream */}
                <div className="space-y-2 max-h-44 overflow-y-auto">
                  {(!selectedTask.comments || selectedTask.comments.length === 0) ? (
                    <div className="p-3 text-center text-xs text-[#94A3B8] bg-[#F8FAFC] rounded-lg">
                      No comments yet. Start the discussion above.
                    </div>
                  ) : (
                    selectedTask.comments.map((comm) => (
                      <div
                        key={comm.id}
                        className="p-3 rounded-lg border border-[#E2E8F0] bg-white space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between text-[#64748B]">
                          <div className="flex items-center gap-1.5">
                            <img
                              src={comm.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                              alt=""
                              className="h-4 w-4 rounded-full object-cover"
                            />
                            <span className="font-bold text-[#0F172A]">{comm.author}</span>
                          </div>
                          <span className="text-[10px]">{comm.timestamp}</span>
                        </div>
                        <p className="text-[#0F172A] pl-5 leading-relaxed">{comm.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Drawer Actions */}
            <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3 mt-4">
              <button
                type="button"
                onClick={() => setSelectedTaskId(null)}
                className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
              >
                Close
              </button>
              {selectedTask.status !== "COMPLETED" && (
                <button
                  type="button"
                  onClick={() => {
                    updateTaskStatus(selectedTask.id, "COMPLETED");
                    showToast("Task marked as Completed!");
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-[#16A34A] px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 shadow-xs transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Mark as Completed</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add New Task Modal */}
      {isAddModalOpen && (
        <div
          onClick={() => setIsAddModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-2xs p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">
                  <Plus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0F172A]">Create Delivery Task</h3>
                  <p className="text-[11px] text-[#64748B]">Add a new task to sprint backlog or board.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#0F172A] block mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Implement Razorpay webhook payment handler"
                  className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-[#0F172A] block mb-1">Description & Acceptance Criteria</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief specifications and acceptance criteria..."
                  className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Associated Project *</label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-2 text-xs text-[#0F172A] focus:border-[#2563EB]"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.projectName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Assignee</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-2 text-xs text-[#0F172A] focus:border-[#2563EB]"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Initial Status</label>
                  <select
                    value={targetColumnStatus}
                    onChange={(e) => setTargetColumnStatus(e.target.value as TaskStatus)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-2 py-2 text-xs text-[#0F172A] focus:border-[#2563EB]"
                  >
                    {KANBAN_COLUMNS.map((c) => (
                      <option key={c.status} value={c.status}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-2 py-2 text-xs text-[#0F172A] focus:border-[#2563EB]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-2 py-1.5 text-xs text-[#0F172A] focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Est. Hours</label>
                  <input
                    type="number"
                    min="1"
                    value={estHours}
                    onChange={(e) => setEstHours(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-2 py-1.5 text-xs text-[#0F172A] focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] pt-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-[#E2E8F0] px-4 py-2 font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Create Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-2xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#0F172A]">Edit Task: {editingTask.taskKey}</h3>
                <p className="text-xs text-[#64748B]">Update task assignee, priority, deadline, or workflow status</p>
              </div>
              <button
                onClick={() => setEditingTask(null)}
                className="rounded-lg p-1 text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#0F172A] block mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#0F172A] block mb-1">Description & Acceptance Criteria</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Project</label>
                  <select
                    value={editProjectId}
                    onChange={(e) => setEditProjectId(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-2 text-xs text-[#0F172A] focus:border-[#2563EB]"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.projectName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Assignee</label>
                  <select
                    value={editAssignedTo}
                    onChange={(e) => setEditAssignedTo(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-2 text-xs text-[#0F172A] focus:border-[#2563EB]"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Workflow Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as TaskStatus)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-2 py-2 text-xs text-[#0F172A] focus:border-[#2563EB]"
                  >
                    {KANBAN_COLUMNS.map((c) => (
                      <option key={c.status} value={c.status}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Priority</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-2 py-2 text-xs text-[#0F172A] focus:border-[#2563EB]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-2 py-1.5 text-xs text-[#0F172A] focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Est. Hours</label>
                  <input
                    type="number"
                    min="1"
                    value={editEstHours}
                    onChange={(e) => setEditEstHours(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-2 py-1.5 text-xs text-[#0F172A] focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] pt-3 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="rounded-xl border border-[#E2E8F0] px-4 py-2 font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Task Confirm Dialog */}
      {deletingTaskId && (
        <ConfirmDialog
          isOpen={!!deletingTaskId}
          onClose={() => setDeletingTaskId(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Task?"
          message="Are you sure you want to permanently delete this task? All subtasks and logged comments will be removed."
          confirmLabel="Delete Task"
          variant="danger"
        />
      )}
    </div>
  );
}
