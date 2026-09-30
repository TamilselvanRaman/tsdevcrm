"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderKanban,
  CheckSquare,
  ChevronRight,
  TrendingUp,
  X,
  FileText,
  FileSignature,
  Printer,
  Download,
  Eye,
  Building2,
  ExternalLink,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { TaskStatus, TaskPriority, ProjectDocument } from "@/types";

export default function ProjectDashboardPage() {
  const params = useParams();
  const projectId = params?.id as string;
  const { projects, tasks, users, documents, addTask } = useAppStore();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [welcomeNoteOpen, setWelcomeNoteOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<ProjectDocument | null>(null);

  // New task form state
  const [taskTitle, setTaskTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState(users[0]?.id || "");
  const [priority, setPriority] = useState<TaskPriority>("High");
  const [dueDate, setDueDate] = useState("2026-10-05");
  const [estHours, setEstHours] = useState("8");

  const project = projects.find((p) => p.id === projectId) || projects[0];
  const projectTasks = tasks.filter((t) => t.projectId === project?.id || t.projectName === project?.projectName);
  const projectDocs = documents.filter(
    (d) => d.projectId === project?.id || d.projectName.toLowerCase() === project?.projectName.toLowerCase()
  );


  if (!project) {
    return (
      <div className="p-8 text-center text-xs text-[#64748B]">
        Project not found. <Link href="/crm/admin/projects" className="text-[#2563EB]">Return to list</Link>
      </div>
    );
  }

  const completedTasksCount = projectTasks.filter((t) => t.status === "COMPLETED").length;
  const overdueTasksCount = projectTasks.filter((t) => t.status === "CHANGES REQUESTED" || t.isBlocked).length;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedUser = users.find((u) => u.id === assignedTo);
    addTask({
      title: taskTitle,
      description: `Task for ${project.projectName}`,
      projectId: project.id,
      projectName: project.projectName,
      assignedTo,
      assignedToName: assignedUser?.fullName || "Tamil Selvan",
      assignedToAvatar: assignedUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      priority,
      status: "TODO",
      dueDate,
      estimatedHours: Number(estHours),
    });

    setIsTaskModalOpen(false);
    setTaskTitle("");
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/crm/admin/projects"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">{project.projectName}</h1>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#2563EB] border border-blue-200">
                {project.status}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Client: <span className="font-semibold text-[#0F172A]">{project.clientName}</span> • Project Manager:{" "}
              <span className="font-semibold text-[#0F172A]">{project.managerName}</span> • Deadline:{" "}
              <span className="font-semibold text-[#0F172A]">{project.deadline}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/crm/admin/projects/documents"
            className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/50 px-3.5 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors shadow-2xs"
          >
            <FileSignature className="h-4 w-4" />
            <span>+ Quotation / MSA</span>
          </Link>
          <button
            onClick={() => setWelcomeNoteOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-[#16A34A] bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-[#16A34A] hover:bg-emerald-100 transition-colors shadow-xs"
          >
            <FileText className="h-4 w-4" />
            <span>Welcome Note (PDF)</span>
          </button>
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Progress</span>
          <div className="text-xl font-bold text-[#2563EB]">{project.progressPct}%</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Tasks</span>
          <div className="text-xl font-bold text-[#0F172A]">{projectTasks.length} Total</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Completed</span>
          <div className="text-xl font-bold text-[#16A34A]">{completedTasksCount}</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Overdue / Blocked</span>
          <div className="text-xl font-bold text-[#DC2626]">{overdueTasksCount}</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Team</span>
          <div className="text-xl font-bold text-[#0F172A]">{project.teamMembers.length} Members</div>
        </div>
      </div>

      {/* Project Progress Bar */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-2">
        <div className="flex justify-between text-xs font-bold text-[#0F172A]">
          <span>Overall Completion Progress</span>
          <span>{project.progressPct}%</span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[#2563EB] transition-all duration-300"
            style={{ width: `${project.progressPct}%` }}
          />
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Milestones & Upcoming Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Milestones Card */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-3">
              Delivery Milestones
            </h3>
            <div className="space-y-3">
              {project.milestones.map((m) => (
                <div key={m.id} className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#0F172A]">{m.title}</span>
                    <span className="font-bold text-[#2563EB]">{m.progressPct}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${m.progressPct === 100 ? "bg-[#16A34A]" : "bg-[#2563EB]"}`}
                      style={{ width: `${m.progressPct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Tasks Table */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-sm text-[#0F172A]">Project Tasks</h3>
              <Link href="/crm/admin/tasks" className="text-xs font-semibold text-[#2563EB]">
                Kanban View
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left table-compact">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Assignee</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {projectTasks.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-xs text-[#64748B]">
                        No tasks yet. Click + Add Task above.
                      </td>
                    </tr>
                  ) : (
                    projectTasks.map((t) => (
                      <tr key={t.id}>
                        <td className="font-semibold text-[#0F172A]">
                          <Link href={`/crm/admin/tasks/${t.id}`} className="hover:text-[#2563EB]">
                            [{t.taskKey}] {t.title}
                          </Link>
                        </td>
                        <td className="text-[#64748B]">{t.assignedToName}</td>
                        <td>
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${
                              t.priority === "High" || t.priority === "Urgent"
                                ? "bg-red-50 text-red-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {t.priority}
                          </span>
                        </td>
                        <td className="text-[#64748B]">{t.dueDate}</td>
                        <td>
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              t.status === "COMPLETED"
                                ? "bg-emerald-50 text-emerald-700"
                                : t.status === "IN PROGRESS"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Project Quotations & Service Agreements (Stored Documents) */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden space-y-0">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <FileSignature className="h-4 w-4 text-[#2563EB]" />
                <h3 className="font-bold text-sm text-[#0F172A]">
                  Stored Quotations & Service Agreements
                </h3>
              </div>
              <Link
                href="/crm/admin/projects/documents"
                className="text-xs font-semibold text-[#2563EB] hover:underline"
              >
                + Create New
              </Link>
            </div>

            <div className="p-4 space-y-3">
              {projectDocs.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#64748B] space-y-2">
                  <p>No formal quotation or service agreement attached to this project yet.</p>
                  <Link
                    href="/crm/admin/projects/documents"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#2563EB] border border-blue-200"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Create Quotation / Agreement</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {projectDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#2563EB]/40 hover:bg-slate-50/50 transition-all gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${
                              doc.type === "Quotation"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-indigo-50 text-indigo-700 border-indigo-200"
                            }`}
                          >
                            {doc.type}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#0F172A]">
                            {doc.docNumber}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                              doc.status === "Signed" || doc.status === "Accepted"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-700 border-slate-300"
                            }`}
                          >
                            {doc.status}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#0F172A]">{doc.title}</p>
                        <p className="text-[11px] text-[#64748B]">
                          Issued: {doc.createdDate} • Valid Until: {doc.validUntil} • Total:{" "}
                          <span className="font-bold text-[#0F172A]">
                            ₹{doc.totalAmount.toLocaleString("en-IN")}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          className="flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] shadow-2xs transition-all"
                        >
                          <Eye className="h-3.5 w-3.5 text-[#2563EB]" />
                          <span>View PDF</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewDoc(doc);
                            setTimeout(() => window.print(), 300);
                          }}
                          className="flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition-all"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Team Members & Recent Activity */}
        <div className="space-y-6">
          {/* Team Members Panel */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-3">
              Assigned Team Members
            </h3>
            <div className="space-y-3">
              {users.slice(0, 4).map((u) => (
                <div key={u.id} className="flex items-center gap-3">
                  <img src={u.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                  <div className="flex flex-col text-xs">
                    <span className="font-semibold text-[#0F172A]">{u.fullName}</span>
                    <span className="text-[10px] text-[#64748B]">{u.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-3">
              Recent Project Activity
            </h3>
            <div className="space-y-3 text-xs">
              <div className="border-l-2 border-[#2563EB] pl-3 py-1 space-y-0.5">
                <div className="font-semibold text-[#0F172A]">Task TS-1042 status updated to IN PROGRESS</div>
                <div className="text-[10px] text-[#64748B]">Tamil Selvan • 28 Sep 10:00 AM</div>
              </div>
              <div className="border-l-2 border-emerald-500 pl-3 py-1 space-y-0.5">
                <div className="font-semibold text-[#0F172A]">Milestone UI/UX Design completed</div>
                <div className="text-[10px] text-[#64748B]">Priya Raman • 27 Sep 04:30 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-2xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="font-bold text-base text-[#0F172A]">+ Add Task to {project.projectName}</h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="rounded-lg p-1 text-[#64748B]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#0F172A] block mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Fix Payment Webhook Handler"
                  className="w-full rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs text-[#0F172A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Assigned Member</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-xs text-[#0F172A]"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-xs text-[#0F172A]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-xs text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Est. Hours</label>
                  <input
                    type="number"
                    value={estHours}
                    onChange={(e) => setEstHours(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs text-[#0F172A]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] pt-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="rounded-xl border border-[#E2E8F0] px-3.5 py-2 font-semibold text-[#64748B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#2563EB] px-4 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROJECT WELCOME & KICKOFF NOTE MODAL / PDF EXPORTER */}
      {welcomeNoteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-2xs p-4 print:p-0 print:bg-white print:fixed print:inset-0">
          <div className="w-full max-w-3xl rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar print:border-none print:shadow-none print:p-0 print:m-0">
            {/* Modal Controls (Hidden in Print) */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 print:hidden">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-[#16A34A]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0F172A]">Project Welcome & Kickoff Note</h3>
                  <p className="text-xs text-[#64748B]">
                    Client Onboarding Document • Printable PDF format
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs"
                >
                  <Printer className="h-4 w-4" />
                  <span>Download / Print PDF</span>
                </button>
                <button
                  onClick={() => setWelcomeNoteOpen(false)}
                  className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#F8FAFC]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Printable Formal Document Content */}
            <div className="space-y-6 text-[#0F172A] bg-white p-6 rounded-xl border border-slate-200 print:border-none print:p-0">
              {/* Document Header */}
              <div className="flex items-start justify-between border-b-2 border-[#2563EB] pb-4">
                <div>
                  <span className="font-extrabold text-xl text-[#2563EB] tracking-tight">TS DEV CRM</span>
                  <div className="text-xs text-[#64748B] font-medium">Internal CRM & Software Development Operations</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">Chennai, Tamil Nadu, India • contact@tsdevcrm.com</div>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#2563EB] border border-blue-200">
                    KICKOFF AGREEMENT
                  </span>
                  <div className="text-xs font-bold text-[#0F172A] mt-1.5">
                    {project.projectCode}
                  </div>
                  <div className="text-[11px] text-[#64748B]">Date: {new Date().toISOString().split("T")[0]}</div>
                </div>
              </div>

              {/* Greeting & Welcome Statement */}
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-[#0F172A]">
                  Welcome to Your Project Kickoff: {project.projectName}
                </h2>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Dear <span className="font-bold text-[#0F172A]">{project.clientName}</span> team,
                  welcome to TS DEV! We are delighted to formally initiate your software delivery engagement.
                  Our engineering and design teams have been allocated and configured to build and deliver your product with enterprise-grade quality and agile execution.
                </p>
              </div>

              {/* Project Key Details Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                <div>
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Client Organization</span>
                  <span className="font-bold text-[#0F172A]">{project.clientName}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Project Manager</span>
                  <span className="font-bold text-[#0F172A]">{project.managerName}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Commercial Budget</span>
                  <span className="font-bold text-[#16A34A]">
                    ₹{project.budget?.toLocaleString("en-IN") || "1,50,000"}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Estimated Delivery</span>
                  <span className="font-bold text-[#0F172A]">{project.deadline}</span>
                </div>
              </div>

              {/* Engineering Team Allocation */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#64748B] border-b border-[#E2E8F0] pb-1">
                  1. Dedicated Engineering & Design Team
                </h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg border border-[#E2E8F0] bg-white">
                    <span className="font-bold block text-[#0F172A]">{project.managerName}</span>
                    <span className="text-[10px] text-[#64748B]">Lead Project Manager & Architecture</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-[#E2E8F0] bg-white">
                    <span className="font-bold block text-[#0F172A]">Priya Raman</span>
                    <span className="text-[10px] text-[#64748B]">Senior UI/UX Designer</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-[#E2E8F0] bg-white">
                    <span className="font-bold block text-[#0F172A]">Arun Kumar</span>
                    <span className="text-[10px] text-[#64748B]">Backend & Cloud Infrastructure</span>
                  </div>
                </div>
              </div>

              {/* Milestone Roadmap */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#64748B] border-b border-[#E2E8F0] pb-1">
                  2. Delivery Milestone Schedule
                </h4>
                <table className="w-full text-left text-xs border border-[#E2E8F0] rounded-lg overflow-hidden">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <tr>
                      <th className="p-2 font-bold text-[#0F172A]">Milestone Phase</th>
                      <th className="p-2 font-bold text-[#0F172A]">Target Output</th>
                      <th className="p-2 font-bold text-[#0F172A]">Initial Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {project.milestones?.map((m, idx) => (
                      <tr key={m.id}>
                        <td className="p-2 font-semibold text-[#0F172A]">Phase {idx + 1}: {m.title}</td>
                        <td className="p-2 text-[#64748B]">Approved Deliverables</td>
                        <td className="p-2 font-medium text-[#2563EB]">{m.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Working Protocol & Communication */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#64748B] border-b border-[#E2E8F0] pb-1">
                  3. Communication & Sprint Cadence
                </h4>
                <div className="grid grid-cols-2 gap-3 text-[#475569]">
                  <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <span className="font-bold text-[#0F172A] block">Weekly Sprint Review</span>
                    <p className="text-[11px]">Every Friday at 4:00 PM IST via Google Meet / Zoom with live feature demos.</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <span className="font-bold text-[#0F172A] block">Dedicated Support Channel</span>
                    <p className="text-[11px]">Direct WhatsApp Business group & email response within 2 hours on business days.</p>
                  </div>
                </div>
              </div>

              {/* Signature Footer */}
              <div className="pt-6 border-t border-[#E2E8F0] grid grid-cols-2 gap-8 text-xs">
                <div className="space-y-4">
                  <div className="h-10 border-b border-slate-300"></div>
                  <div>
                    <span className="font-bold text-[#0F172A] block">Authorized Agency Signatory</span>
                    <span className="text-[10px] text-[#64748B]">TS DEV CRM Software Agency</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-10 border-b border-slate-300"></div>
                  <div>
                    <span className="font-bold text-[#0F172A] block">Client Representative</span>
                    <span className="text-[10px] text-[#64748B]">{project.clientName}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions (Hidden in Print) */}
            <div className="flex items-center justify-end gap-3 print:hidden">
              <button
                type="button"
                onClick={() => setWelcomeNoteOpen(false)}
                className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs"
              >
                <Download className="h-4 w-4" />
                <span>Save as PDF / Print</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PROJECT QUOTATION / MSA DOCUMENT PREVIEW & PRINT MODAL                     */}
      {/* ========================================================================= */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-2xs p-4">
          <div className="w-full max-w-4xl rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Modal Control Bar (Hidden in Print) */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 print:hidden">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-bold border ${
                    previewDoc.type === "Quotation"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-indigo-50 text-indigo-700 border-indigo-200"
                  }`}
                >
                  {previewDoc.type}
                </span>
                <span className="font-mono text-xs font-bold text-[#0F172A]">
                  {previewDoc.docNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs"
                >
                  <Printer className="h-4 w-4" />
                  <span>Download / Print PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="rounded-xl border border-[#E2E8F0] p-1.5 text-[#64748B] hover:bg-[#F8FAFC]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* FORMAL CORPORATE DOCUMENT CONTAINER (Printable A4 Sheet) */}
            <div className="border border-slate-200 rounded-xl p-8 space-y-6 text-[#0F172A] bg-white print:border-none print:p-0">
              {/* Corporate Letterhead Header */}
              <div className="flex items-start justify-between border-b-2 border-[#0F172A] pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB] text-white font-bold text-sm">
                      TS
                    </div>
                    <span className="font-extrabold text-base tracking-tight text-[#0F172A]">
                      TS DEV CRM ENTERPRISE
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">
                    Software Engineering • Cloud Architecture • Enterprise Solutions
                  </p>
                  <p className="text-[10px] text-[#64748B] mt-0.5">
                    GSTIN: 33AAACT1234F1Z8 • Reg No: CIN-U72200TN2026PTC
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block text-base font-extrabold tracking-tight uppercase px-3 py-1 rounded-md ${
                      previewDoc.type === "Quotation"
                        ? "bg-blue-50 text-[#2563EB]"
                        : "bg-indigo-50 text-indigo-700"
                    }`}
                  >
                    {previewDoc.type === "Quotation"
                      ? "COMMERCIAL QUOTATION"
                      : "MASTER SERVICE AGREEMENT"}
                  </span>
                  <div className="mt-2 text-xs space-y-0.5">
                    <div>
                      <span className="text-[#64748B]">Document #:</span>{" "}
                      <span className="font-mono font-bold">{previewDoc.docNumber}</span>
                    </div>
                    <div>
                      <span className="text-[#64748B]">Date Issued:</span>{" "}
                      <span className="font-semibold">{previewDoc.createdDate}</span>
                    </div>
                    <div>
                      <span className="text-[#64748B]">Valid Until:</span>{" "}
                      <span className="font-semibold">{previewDoc.validUntil}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client & Project Information */}
              <div className="grid grid-cols-2 gap-6 text-xs">
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#64748B] block mb-1">
                    Issued / Billed To:
                  </span>
                  <div className="font-bold text-sm text-[#0F172A]">{previewDoc.clientName}</div>
                  <div className="text-[#64748B]">{previewDoc.clientAddress || "Corporate Client"}</div>
                  <div className="text-[#64748B]">
                    Email: {previewDoc.clientEmail || "contact@client.com"}
                  </div>
                  <div className="text-[#64748B]">Phone: {previewDoc.clientPhone || "+91 98401 23456"}</div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#64748B] block mb-1">
                    Project Reference:
                  </span>
                  <div className="font-bold text-sm text-[#2563EB]">{previewDoc.projectName}</div>
                  <div className="text-[#64748B]">
                    Document Title: <span className="font-medium text-[#0F172A]">{previewDoc.title}</span>
                  </div>
                  <div className="text-[#64748B]">
                    Status: <span className="font-semibold text-emerald-600">{previewDoc.status}</span>
                  </div>
                </div>
              </div>

              {/* Scope Overview */}
              {previewDoc.scopeOfWork && (
                <div className="space-y-1.5 text-xs">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#64748B] border-b border-[#E2E8F0] pb-1">
                    1. Scope of Work & Deliverables
                  </h4>
                  <p className="text-xs text-[#334155] leading-relaxed p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    {previewDoc.scopeOfWork}
                  </p>
                </div>
              )}

              {/* Line Items Table */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#64748B] border-b border-[#E2E8F0] pb-1">
                  2. Pricing Schedule & Commercial Breakdown
                </h4>
                <table className="w-full text-left text-xs border border-[#E2E8F0] rounded-lg overflow-hidden">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <tr>
                      <th className="p-2.5 font-bold text-[#0F172A]">Item / Description</th>
                      <th className="p-2.5 font-bold text-[#0F172A]">Deliverable Specifications</th>
                      <th className="p-2.5 font-bold text-[#0F172A] text-center w-16">Qty</th>
                      <th className="p-2.5 font-bold text-[#0F172A] text-right w-28">Rate (₹)</th>
                      <th className="p-2.5 font-bold text-[#0F172A] text-right w-28">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {previewDoc.items.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td className="p-2.5 font-semibold text-[#0F172A]">{item.description}</td>
                        <td className="p-2.5 text-[#64748B] text-[11px]">
                          {item.deliverable || "Standard Deliverable"}
                        </td>
                        <td className="p-2.5 text-center text-[#64748B]">{item.quantity}</td>
                        <td className="p-2.5 text-right font-medium text-[#64748B]">
                          ₹{(item.rate || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="p-2.5 text-right font-bold text-[#0F172A]">
                          ₹{(item.amount || 0).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Subtotal & Total Box */}
                <div className="flex justify-end pt-2">
                  <div className="w-72 space-y-1.5 text-xs p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className="flex justify-between text-[#64748B]">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-[#0F172A]">
                        ₹{previewDoc.subtotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#64748B]">
                      <span>GST Tax ({previewDoc.taxPercent}%):</span>
                      <span className="font-semibold text-[#0F172A]">
                        ₹{previewDoc.taxAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-[#CBD5E1] pt-1.5 font-bold text-sm text-[#0F172A]">
                      <span>Grand Total (INR):</span>
                      <span className="text-[#2563EB]">
                        ₹{previewDoc.totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Terms & Milestone Conditions */}
              {previewDoc.paymentTerms && (
                <div className="space-y-1.5 text-xs">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#64748B] border-b border-[#E2E8F0] pb-1">
                    3. Payment Milestones & Invoicing Protocol
                  </h4>
                  <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] whitespace-pre-line text-[#334155] leading-relaxed">
                    {previewDoc.paymentTerms}
                  </div>
                </div>
              )}

              {/* Terms and Conditions / Legal Clauses */}
              {previewDoc.termsAndConditions?.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#64748B] border-b border-[#E2E8F0] pb-1">
                    4. Terms, Conditions & SLA Clauses
                  </h4>
                  <div className="space-y-1 text-[#334155]">
                    {previewDoc.termsAndConditions.map((term, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="font-bold text-[#64748B]">•</span>
                        <span className="text-[11px] leading-relaxed">{term}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dual Signature Section */}
              <div className="pt-8 border-t border-[#E2E8F0] grid grid-cols-2 gap-12 text-xs">
                <div className="space-y-4">
                  <div className="h-12 border-b border-slate-400"></div>
                  <div>
                    <span className="font-bold text-[#0F172A] block">
                      {previewDoc.preparedBy || "Tamil Selvan (Lead Director)"}
                    </span>
                    <span className="text-[10px] text-[#64748B]">
                      Authorized Signatory • TS DEV CRM ENTERPRISE
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-12 border-b border-slate-400"></div>
                  <div>
                    <span className="font-bold text-[#0F172A] block">
                      {previewDoc.authorizedSignatory || previewDoc.clientName}
                    </span>
                    <span className="text-[10px] text-[#64748B]">
                      Accepted & Confirmed By Client Signatory
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
