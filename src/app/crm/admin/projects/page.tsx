"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  FolderKanban,
  Users,
  Calendar,
  AlertCircle,
  Eye,
  CheckCircle2,
  X,
  FileText,
  Printer,
  Download,
  ExternalLink,
  Shield,
  IndianRupee,
  Clock,
  ArrowRight,
  CheckSquare,
  Sparkles,
  Edit2,
  Trash2,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ProjectStatus, Project } from "@/types";

export default function ProjectListPage() {
  const router = useRouter();
  const { projects, addProject, updateProject, updateProjectStatus, deleteProject, users, tasks } = useAppStore();

  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [managerFilter, setManagerFilter] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [welcomeNoteProject, setWelcomeNoteProject] = useState<Project | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  // Edit Form state
  const [editProjectName, setEditProjectName] = useState("");
  const [editClientName, setEditClientName] = useState("");
  const [editManagerId, setEditManagerId] = useState("");
  const [editBudget, setEditBudget] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editProgressPct, setEditProgressPct] = useState(0);
  const [editStatus, setEditStatus] = useState<ProjectStatus>("In Progress");
  const [editDescription, setEditDescription] = useState("");

  // Form state
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [managerId, setManagerId] = useState(users[0]?.id || "");
  const [budget, setBudget] = useState("150000");
  const [deadline, setDeadline] = useState("2026-11-30");
  const [description, setDescription] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.projectName.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.projectCode.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    const matchesManager = managerFilter === "All" || p.managerId === managerFilter;
    return matchesSearch && matchesStatus && matchesManager;
  });

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const pm = users.find((u) => u.id === managerId);
    const newCode = `PRJ-${projectName.substring(0, 4).toUpperCase()}`;

    const newProjectData: Omit<Project, "id"> = {
      projectCode: newCode,
      projectName,
      clientName,
      managerId,
      managerName: pm?.fullName || "Tamil Selvan",
      teamMembers: [managerId, "usr-002", "usr-003"],
      teamMemberNames: [pm?.fullName || "Tamil Selvan", "Priya Raman", "Arun Kumar"],
      progressPct: 10,
      deadline,
      status: "In Progress",
      priority: "High",
      budget: Number(budget),
      milestones: [
        { id: "m1", title: "Project Kickoff & Specs", progressPct: 100, status: "Completed" },
        { id: "m2", title: "UI/UX Figma Prototypes", progressPct: 40, status: "In Progress" },
        { id: "m3", title: "Core Backend & Frontend APIs", progressPct: 0, status: "Pending" },
        { id: "m4", title: "QA Testing & Staging Deploy", progressPct: 0, status: "Pending" },
      ],
      description: description || `Software delivery agreement & engineering project for ${clientName}`,
    };

    addProject(newProjectData);

    const createdProject: Project = {
      ...newProjectData,
      id: `prj-${Date.now()}`,
    };

    setIsAddModalOpen(false);
    setProjectName("");
    setClientName("");
    setDescription("");
    showToast("Project created successfully!");

    // Automatically offer the Welcome & Kickoff Note PDF
    setWelcomeNoteProject(createdProject);
  };

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    updateProjectStatus(projectId, newStatus);
    showToast(`Project status updated to ${newStatus}`);
  };

  const handleOpenEditModal = (prj: Project) => {
    setEditingProject(prj);
    setEditProjectName(prj.projectName);
    setEditClientName(prj.clientName);
    setEditManagerId(prj.managerId);
    setEditBudget(prj.budget ? prj.budget.toString() : "0");
    setEditDeadline(prj.deadline);
    setEditProgressPct(prj.progressPct || 0);
    setEditStatus(prj.status);
    setEditDescription(prj.description || "");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editProjectName.trim()) return;

    const pm = users.find((u) => u.id === editManagerId);

    updateProject(editingProject.id, {
      projectName: editProjectName.trim(),
      clientName: editClientName.trim(),
      managerId: editManagerId,
      managerName: pm?.fullName || editingProject.managerName,
      budget: Number(editBudget) || 0,
      deadline: editDeadline,
      progressPct: Number(editProgressPct) || 0,
      status: editStatus,
      description: editDescription.trim(),
    });

    showToast(`Project "${editProjectName}" updated.`);
    setEditingProject(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingProjectId) return;
    const target = projects.find((p) => p.id === deletingProjectId);
    deleteProject(deletingProjectId);
    showToast(`Project "${target?.projectName || "Record"}" deleted.`);
    setDeletingProjectId(null);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const getStatusBadgeStyle = (status: ProjectStatus) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "At Risk":
        return "bg-red-50 text-red-700 border-red-200";
      case "Planning":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "On Hold":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
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
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Delivery Projects</h1>
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#2563EB] border border-blue-100">
              {projects.length} Active Workspaces
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage software delivery sprints, milestone roadmaps and client kickoff notes.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-medium">Active Delivery</span>
            <div className="p-2 rounded-lg bg-blue-50 text-[#2563EB]">
              <FolderKanban className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#0F172A]">{projects.length}</span>
            <span className="text-[11px] font-medium text-[#64748B]">In Pipeline</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-medium">In Progress</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-[#16A34A]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#16A34A]">
              {projects.filter((p) => p.status === "In Progress").length}
            </span>
            <span className="text-[11px] font-medium text-[#16A34A]">On Track</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-medium">At Risk / Delayed</span>
            <div className="p-2 rounded-lg bg-red-50 text-[#DC2626]">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#DC2626]">
              {projects.filter((p) => p.status === "At Risk").length}
            </span>
            <span className="text-[11px] font-medium text-[#DC2626]">Needs Review</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-medium">Completed</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#0F172A]">
              {projects.filter((p) => p.status === "Completed").length + 0}
            </span>
            <span className="text-[11px] font-medium text-[#16A34A]">Delivered</span>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3 shadow-2xs">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search project name, code (PRJ-...) or client..."
            className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-9 pr-3 py-1.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-hidden focus:border-[#2563EB] font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0F172A] focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="At Risk">At Risk</option>
            <option value="Completed">Completed</option>
            <option value="Planning">Planning</option>
            <option value="On Hold">On Hold</option>
          </select>

          {/* Manager Filter */}
          <select
            value={managerFilter}
            onChange={(e) => setManagerFilter(e.target.value)}
            className="rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0F172A] focus:outline-hidden"
          >
            <option value="All">All PMs</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.fullName}
              </option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-0.5">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === "table"
                  ? "bg-white shadow-2xs text-[#2563EB]"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
              title="Table View"
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === "card"
                  ? "bg-white shadow-2xs text-[#2563EB]"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
              title="Card View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content (Table or Card View) */}
      {viewMode === "table" ? (
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left table-compact">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Manager</th>
                  <th>Team</th>
                  <th>Progress</th>
                  <th>Deadline</th>
                  <th>Status (Quick Update)</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-xs text-[#64748B]">
                      No projects found matching filter.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((prj) => {
                    const projectTasksCount = tasks.filter((t) => t.projectId === prj.id).length;

                    return (
                      <tr
                        key={prj.id}
                        onClick={() => setSelectedProjectId(prj.id)}
                        className={`cursor-pointer transition-colors hover:bg-blue-50/40 ${
                          selectedProjectId === prj.id ? "bg-blue-50/70" : ""
                        }`}
                      >
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                              {prj.projectCode}
                            </span>
                            <span className="font-semibold text-xs text-[#0F172A] hover:text-[#2563EB]">
                              {prj.projectName}
                            </span>
                          </div>
                        </td>
                        <td className="text-xs text-[#64748B]">{prj.clientName}</td>
                        <td className="text-xs font-medium text-[#0F172A]">{prj.managerName}</td>
                        <td className="text-xs text-[#64748B]">
                          <span className="inline-flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-0.5 rounded text-[11px] font-semibold text-[#0F172A]">
                            <Users className="h-3 w-3 text-[#64748B]" />
                            {prj.teamMembers.length} Members
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  prj.status === "At Risk" ? "bg-[#DC2626]" : "bg-[#2563EB]"
                                }`}
                                style={{ width: `${prj.progressPct}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-[#0F172A]">{prj.progressPct}%</span>
                          </div>
                        </td>
                        <td className="text-xs text-[#64748B]">{prj.deadline}</td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <select
                            value={prj.status}
                            onChange={(e) => handleStatusChange(prj.id, e.target.value as ProjectStatus)}
                            className={`rounded-lg border px-2 py-1 text-[11px] font-semibold focus:outline-hidden cursor-pointer shadow-2xs ${getStatusBadgeStyle(
                              prj.status
                            )}`}
                          >
                            <option value="In Progress">In Progress</option>
                            <option value="At Risk">At Risk</option>
                            <option value="Completed">Completed</option>
                            <option value="Planning">Planning</option>
                            <option value="On Hold">On Hold</option>
                          </select>
                        </td>
                        <td className="text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setWelcomeNoteProject(prj)}
                            className="inline-flex p-1.5 text-[#16A34A] hover:bg-emerald-50 rounded-lg transition-colors"
                            title="View Welcome Note & PDF"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setSelectedProjectId(prj.id)}
                            className="inline-flex p-1.5 text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Quick Details Drawer"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(prj)}
                            className="inline-flex p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Project"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeletingProjectId(prj.id)}
                            className="inline-flex p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <Link
                            href={`/crm/admin/projects/${prj.id}`}
                            className="inline-flex p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors"
                            title="Open Full Workspace"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Corporate Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((prj) => (
            <div
              key={prj.id}
              onClick={() => setSelectedProjectId(prj.id)}
              className={`rounded-2xl border bg-white p-5 shadow-2xs space-y-4 cursor-pointer transition-all hover:shadow-md hover:border-[#2563EB]/40 group ${
                selectedProjectId === prj.id ? "border-[#2563EB] ring-2 ring-blue-100" : "border-[#E2E8F0]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {prj.projectCode}
                  </span>
                  <h3 className="font-bold text-sm text-[#0F172A] mt-1.5 group-hover:text-[#2563EB] transition-colors">
                    {prj.projectName}
                  </h3>
                  <div className="text-xs text-[#64748B]">{prj.clientName}</div>
                </div>
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(
                    prj.status
                  )}`}
                >
                  {prj.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#64748B] pt-1">
                <div className="flex justify-between">
                  <span>Manager:</span>
                  <span className="font-semibold text-[#0F172A]">{prj.managerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Team:</span>
                  <span className="font-semibold text-[#0F172A]">{prj.teamMembers.length} Members</span>
                </div>
                <div className="flex justify-between">
                  <span>Deadline:</span>
                  <span className="font-semibold text-[#0F172A]">{prj.deadline}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#F1F5F9]">
                <div className="flex justify-between text-xs font-bold text-[#0F172A]">
                  <span>Progress</span>
                  <span>{prj.progressPct}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      prj.status === "At Risk" ? "bg-[#DC2626]" : "bg-[#2563EB]"
                    }`}
                    style={{ width: `${prj.progressPct}%` }}
                  />
                </div>
              </div>

              <div
                className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setWelcomeNoteProject(prj)}
                  className="text-xs font-bold text-[#16A34A] flex items-center gap-1 hover:underline"
                >
                  <FileText className="h-3.5 w-3.5" /> Welcome Note
                </button>
                <Link
                  href={`/projects/${prj.id}`}
                  className="text-xs font-bold text-[#2563EB] flex items-center gap-1 hover:underline"
                >
                  Workspace <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-over Project Details Drawer */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-2xs">
          <div className="h-full w-full max-w-xl border-l border-[#E2E8F0] bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {selectedProject.projectCode}
                    </span>
                    <h2 className="text-lg font-bold text-[#0F172A]">{selectedProject.projectName}</h2>
                  </div>
                  <p className="text-xs text-[#64748B]">Client: {selectedProject.clientName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWelcomeNoteProject(selectedProject)}
                    className="p-1.5 rounded-lg text-[#16A34A] hover:bg-emerald-50"
                    title="Welcome Note PDF"
                  >
                    <FileText className="h-4 w-4" />
                  </button>
                  <Link
                    href={`/crm/admin/projects/${selectedProject.id}`}
                    className="p-1.5 rounded-lg text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A]"
                    title="Full Workspace"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => setSelectedProjectId(null)}
                    className="p-1.5 rounded-lg text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Status & Progress Row */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                <div>
                  <span className="text-[#64748B] block mb-1 font-semibold">Delivery Status</span>
                  <select
                    value={selectedProject.status}
                    onChange={(e) => handleStatusChange(selectedProject.id, e.target.value as ProjectStatus)}
                    className={`w-full rounded-lg border px-2.5 py-1.5 text-xs font-bold focus:outline-hidden cursor-pointer ${getStatusBadgeStyle(
                      selectedProject.status
                    )}`}
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Completed">Completed</option>
                    <option value="Planning">Planning</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
                <div>
                  <span className="text-[#64748B] block mb-1 font-semibold">Completion</span>
                  <span className="font-bold text-sm text-[#0F172A]">{selectedProject.progressPct}%</span>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full rounded-full bg-[#2563EB]"
                      style={{ width: `${selectedProject.progressPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Commercials & Timeline */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white space-y-1">
                  <span className="text-[#64748B]">Project Budget</span>
                  <div className="text-sm font-bold text-[#0F172A]">
                    ₹{selectedProject.budget?.toLocaleString("en-IN") || "1,50,000"}
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white space-y-1">
                  <span className="text-[#64748B]">Target Deadline</span>
                  <div className="text-xs font-semibold text-[#0F172A]">{selectedProject.deadline}</div>
                </div>
                <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white space-y-1">
                  <span className="text-[#64748B]">Project Manager</span>
                  <div className="text-xs font-semibold text-[#0F172A] truncate">
                    {selectedProject.managerName}
                  </div>
                </div>
              </div>

              {/* Assigned Team Members */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                  <span className="font-bold text-xs text-[#0F172A] flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-[#2563EB]" />
                    Assigned Engineering Team ({selectedProject.teamMembers.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.teamMembers.map((memberId) => {
                    const member = users.find((u) => u.id === memberId);
                    return (
                      <div
                        key={memberId}
                        className="flex items-center gap-2 p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs"
                      >
                        <img
                          src={member?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                          alt=""
                          className="h-6 w-6 rounded-full object-cover border border-[#E2E8F0]"
                        />
                        <div>
                          <div className="font-semibold text-[#0F172A]">{member?.fullName || "Staff"}</div>
                          <div className="text-[10px] text-[#64748B]">{member?.role || "Developer"}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Milestones Roadmap */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-3">
                <span className="font-bold text-xs text-[#0F172A] block border-b border-[#E2E8F0] pb-2">
                  Milestone Roadmap
                </span>
                <div className="space-y-2.5 text-xs">
                  {selectedProject.milestones?.map((m) => (
                    <div key={m.id} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="font-semibold text-[#0F172A]">{m.title}</span>
                        <span className="font-bold text-[#2563EB]">{m.progressPct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            m.progressPct === 100 ? "bg-[#16A34A]" : "bg-[#2563EB]"
                          }`}
                          style={{ width: `${m.progressPct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Description */}
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-xs space-y-1">
                <span className="font-bold text-[#0F172A]">Scope Overview</span>
                <p className="text-[#64748B] leading-relaxed">{selectedProject.description}</p>
              </div>
            </div>

            {/* Bottom Drawer Actions */}
            <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3 mt-4">
              <button
                type="button"
                onClick={() => setWelcomeNoteProject(selectedProject)}
                className="flex items-center gap-1.5 rounded-xl border border-[#16A34A] bg-emerald-50 px-4 py-2 text-xs font-semibold text-[#16A34A] hover:bg-emerald-100"
              >
                <FileText className="h-4 w-4" />
                <span>Kickoff Note (PDF)</span>
              </button>
              <Link
                href={`/projects/${selectedProject.id}`}
                className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors"
              >
                <span>Open Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* PROJECT WELCOME & KICKOFF NOTE MODAL / PDF EXPORTER */}
      {welcomeNoteProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-2xs p-4 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
          <div className="w-full max-w-3xl rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-2xl space-y-6 my-8 print:border-none print:shadow-none print:p-0 print:m-0">
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
                  onClick={handlePrintPDF}
                  className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs"
                >
                  <Printer className="h-4 w-4" />
                  <span>Download / Print PDF</span>
                </button>
                <button
                  onClick={() => setWelcomeNoteProject(null)}
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
                    {welcomeNoteProject.projectCode}
                  </div>
                  <div className="text-[11px] text-[#64748B]">Date: {new Date().toISOString().split("T")[0]}</div>
                </div>
              </div>

              {/* Greeting & Welcome Statement */}
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-[#0F172A]">
                  Welcome to Your Project Kickoff: {welcomeNoteProject.projectName}
                </h2>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Dear <span className="font-bold text-[#0F172A]">{welcomeNoteProject.clientName}</span> team,
                  welcome to TS DEV! We are delighted to formally initiate your software delivery engagement.
                  Our engineering and design teams have been allocated and configured to build and deliver your product with enterprise-grade quality and agile execution.
                </p>
              </div>

              {/* Project Key Details Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                <div>
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Client Organization</span>
                  <span className="font-bold text-[#0F172A]">{welcomeNoteProject.clientName}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Project Manager</span>
                  <span className="font-bold text-[#0F172A]">{welcomeNoteProject.managerName}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Commercial Budget</span>
                  <span className="font-bold text-[#16A34A]">
                    ₹{welcomeNoteProject.budget?.toLocaleString("en-IN") || "1,50,000"}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Estimated Delivery</span>
                  <span className="font-bold text-[#0F172A]">{welcomeNoteProject.deadline}</span>
                </div>
              </div>

              {/* Engineering Team Allocation */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#64748B] border-b border-[#E2E8F0] pb-1">
                  1. Dedicated Engineering & Design Team
                </h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg border border-[#E2E8F0] bg-white">
                    <span className="font-bold block text-[#0F172A]">{welcomeNoteProject.managerName}</span>
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
                    {welcomeNoteProject.milestones?.map((m, idx) => (
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
                    <span className="text-[10px] text-[#64748B]">{welcomeNoteProject.clientName}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions (Hidden in Print) */}
            <div className="flex items-center justify-end gap-3 print:hidden">
              <button
                type="button"
                onClick={() => setWelcomeNoteProject(null)}
                className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrintPDF}
                className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs"
              >
                <Download className="h-4 w-4" />
                <span>Save as PDF / Print</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-2xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#0F172A]">Create New Project</h3>
                <p className="text-xs text-[#64748B]">Initiates delivery workspace and creates Welcome Note</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 text-[#64748B] hover:bg-[#F8FAFC]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#0F172A] block mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Matrimony Web & App Platform"
                  className="w-full rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#0F172A] block mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. ABC Matrimony Pvt Ltd"
                  className="w-full rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Commercial Budget (₹) *</label>
                  <input
                    type="number"
                    required
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="150000"
                    className="w-full rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Project Manager *</label>
                  <select
                    value={managerId}
                    onChange={(e) => setManagerId(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-hidden"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#0F172A] block mb-1">Target Deadline *</label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-[#0F172A] block mb-1">Scope & Specifications Summary</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief deliverables, tech stack requirements, and client expectations..."
                  className="w-full rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center gap-2.5 text-xs text-[#2563EB]">
                <FileText className="h-4 w-4 shrink-0" />
                <span>A formal Client Welcome & Kickoff Note PDF will be generated immediately upon creation.</span>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] pt-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-[#E2E8F0] px-3.5 py-2 font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#2563EB] px-4 py-2 font-semibold text-white hover:bg-blue-700 shadow-xs"
                >
                  Create & View Kickoff Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-2xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#0F172A]">Edit Project: {editingProject.projectCode}</h3>
                <p className="text-xs text-[#64748B]">Update project milestones, deadline, budget, or manager</p>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                className="rounded-lg p-1 text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#0F172A] block mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={editProjectName}
                  onChange={(e) => setEditProjectName(e.target.value)}
                  className="w-full rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#0F172A] block mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={editClientName}
                  onChange={(e) => setEditClientName(e.target.value)}
                  className="w-full rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Budget (₹)</label>
                  <input
                    type="number"
                    value={editBudget}
                    onChange={(e) => setEditBudget(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Project Manager</label>
                  <select
                    value={editManagerId}
                    onChange={(e) => setEditManagerId(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-hidden"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Target Deadline</label>
                  <input
                    type="date"
                    value={editDeadline}
                    onChange={(e) => setEditDeadline(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as ProjectStatus)}
                    className="w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-hidden"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Completed">Completed</option>
                    <option value="Planning">Planning</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#0F172A] block mb-1">Progress Percentage: {editProgressPct}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editProgressPct}
                  onChange={(e) => setEditProgressPct(Number(e.target.value))}
                  className="w-full accent-[#2563EB]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#0F172A] block mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] pt-3 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="rounded-xl border border-[#E2E8F0] px-3.5 py-2 font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#2563EB] px-4 py-2 font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingProjectId && (
        <ConfirmDialog
          isOpen={!!deletingProjectId}
          onClose={() => setDeletingProjectId(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Project?"
          message="Are you sure you want to permanently delete this project? Associated tasks and documents may be orphaned."
          confirmLabel="Delete Project"
          variant="danger"
        />
      )}
    </div>
  );
}
