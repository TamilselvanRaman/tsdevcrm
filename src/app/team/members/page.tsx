"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  Shield,
  Key,
  UserX,
  UserCheck,
  X,
  CheckCircle2,
  Phone,
  Mail,
  Building,
  CheckSquare,
  Clock,
  LayoutGrid,
  List,
  Lock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { UserRole, UserTeam, UserPermissions, User } from "@/types";
import { DEFAULT_PERMISSIONS } from "@/lib/mockData";

export default function TeamMembersPage() {
  const { users, addUser, updateUserPermissions, toggleUserStatus, deleteUser, tasks } = useAppStore();

  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [teamFilter, setTeamFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  // Add Member Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Developer");
  const [team, setTeam] = useState<UserTeam>("Development");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  // Permission checkboxes state for add modal & drawer
  const [permissions, setPermissions] = useState<UserPermissions>({ ...DEFAULT_PERMISSIONS });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    const matchesTeam = teamFilter === "All" || u.team === teamFilter;
    const matchesStatus = statusFilter === "All" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesTeam && matchesStatus;
  });

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    addUser({
      fullName,
      email,
      username: username || email.split("@")[0],
      phone: phone || "+91 98765 00000",
      role,
      team,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      status,
      permissions,
    });

    setIsAddModalOpen(false);
    showToast("Team member created successfully.");

    // Reset Form
    setFullName("");
    setEmail("");
    setPhone("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setPermissions({ ...DEFAULT_PERMISSIONS });
  };

  const handleTogglePermission = (userId: string, key: keyof UserPermissions) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    const updated = {
      ...user.permissions,
      [key]: !user.permissions[key],
    };
    updateUserPermissions(userId, updated);
    showToast("RBAC permission updated");
  };

  const applyPresetPermissions = (preset: "admin" | "developer" | "pm" | "viewer") => {
    if (preset === "admin") {
      setPermissions({
        viewTasks: true,
        createTasks: true,
        editTasks: true,
        updateStatus: true,
        submitWork: true,
        viewAssignedProjects: true,
        viewProjectDetails: true,
        submitDailyReport: true,
        checkIn: true,
        checkOut: true,
        viewFinance: true,
        manageUsers: true,
        systemSettings: true,
      });
    } else if (preset === "developer") {
      setPermissions({
        viewTasks: true,
        createTasks: true,
        editTasks: false,
        updateStatus: true,
        submitWork: true,
        viewAssignedProjects: true,
        viewProjectDetails: true,
        submitDailyReport: true,
        checkIn: true,
        checkOut: true,
        viewFinance: false,
        manageUsers: false,
        systemSettings: false,
      });
    } else if (preset === "pm") {
      setPermissions({
        viewTasks: true,
        createTasks: true,
        editTasks: true,
        updateStatus: true,
        submitWork: true,
        viewAssignedProjects: true,
        viewProjectDetails: true,
        submitDailyReport: true,
        checkIn: true,
        checkOut: true,
        viewFinance: true,
        manageUsers: false,
        systemSettings: false,
      });
    }
    showToast(`Applied ${preset.toUpperCase()} permission preset`);
  };

  const getTeamBadgeStyle = (t: UserTeam) => {
    switch (t) {
      case "Development":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Design":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "SEO":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Content":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Management":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Team Members</h1>
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#2563EB] border border-blue-100">
              {users.length} Agency Staff
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage agency team members, account credentials and granular RBAC permissions.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-medium">Total Staff</span>
            <div className="p-2 rounded-lg bg-blue-50 text-[#2563EB]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#0F172A]">{users.length}</span>
            <span className="text-[11px] font-medium text-[#64748B]">Across 5 teams</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-medium">Active Accounts</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-[#16A34A]">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#16A34A]">
              {users.filter((u) => u.status === "Active").length}
            </span>
            <span className="text-[11px] font-medium text-[#16A34A]">Verified</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-medium">Inactive / Suspended</span>
            <div className="p-2 rounded-lg bg-red-50 text-[#DC2626]">
              <UserX className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#DC2626]">
              {users.filter((u) => u.status === "Inactive").length}
            </span>
            <span className="text-[11px] font-medium text-[#64748B]">No access</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-medium">Working Today</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#0F172A]">7</span>
            <span className="text-[11px] font-medium text-[#16A34A]">87.5% attendance</span>
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
            placeholder="Search member name, email or username..."
            className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-9 pr-3 py-1.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-hidden focus:border-[#2563EB] font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0F172A] focus:outline-hidden"
          >
            <option value="All">All Roles</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="SEO">SEO</option>
            <option value="Content">Content</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Accountant">Accountant</option>
          </select>

          {/* Team Filter */}
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0F172A] focus:outline-hidden"
          >
            <option value="All">All Teams</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="SEO">SEO</option>
            <option value="Content">Content</option>
            <option value="Management">Management</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0F172A] focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
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
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === "grid"
                  ? "bg-white shadow-2xs text-[#2563EB]"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Grid View */}
      {viewMode === "table" ? (
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left table-compact">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department / Team</th>
                  <th>Status</th>
                  <th>Last Active</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-[#64748B]">
                      No team members found matching search filter.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const memberTasksCount = tasks.filter((t) => t.assignedTo === u.id).length;
                    const isOnline = u.lastActive.includes("Just") || u.lastActive.includes("m ago");

                    return (
                      <tr
                        key={u.id}
                        onClick={() => setSelectedUserId(u.id)}
                        className={`cursor-pointer transition-colors hover:bg-blue-50/40 ${
                          selectedUserId === u.id ? "bg-blue-50/70" : ""
                        }`}
                      >
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={u.avatarUrl}
                                alt={u.fullName}
                                className="h-8 w-8 rounded-full object-cover border border-[#E2E8F0]"
                              />
                              <span
                                className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                                  isOnline ? "bg-[#16A34A]" : "bg-slate-300"
                                }`}
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-xs text-[#0F172A] hover:text-[#2563EB]">
                                {u.fullName}
                              </span>
                              <span className="text-[11px] text-[#64748B]">@{u.username}</span>
                            </div>
                          </div>
                        </td>
                        <td className="text-xs text-[#64748B] font-medium">{u.email}</td>
                        <td className="text-xs font-semibold text-[#0F172A]">{u.role}</td>
                        <td>
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${getTeamBadgeStyle(
                              u.team
                            )}`}
                          >
                            {u.team}
                          </span>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              toggleUserStatus(u.id);
                              showToast(`Status changed to ${u.status === "Active" ? "Inactive" : "Active"}`);
                            }}
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                              u.status === "Active"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${u.status === "Active" ? "bg-[#16A34A]" : "bg-[#DC2626]"}`} />
                            {u.status}
                          </button>
                        </td>
                        <td className="text-xs text-[#64748B]">{u.lastActive}</td>
                        <td className="text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedUserId(u.id)}
                            className="inline-flex p-1.5 text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
                            title="RBAC Permissions & Details"
                          >
                            <Shield className="h-4 w-4" />
                          </button>
                          <Link
                            href={`/team/members/${u.id}`}
                            className="inline-flex p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors"
                            title="Full Profile"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => {
                              deleteUser(u.id);
                              showToast("Team member removed.");
                            }}
                            className="inline-flex p-1.5 text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove Member"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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
        /* Corporate Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUsers.map((u) => {
            const memberTasksCount = tasks.filter((t) => t.assignedTo === u.id).length;
            const isOnline = u.lastActive.includes("Just") || u.lastActive.includes("m ago");

            return (
              <div
                key={u.id}
                onClick={() => setSelectedUserId(u.id)}
                className={`rounded-2xl border bg-white p-5 shadow-2xs space-y-4 cursor-pointer transition-all hover:shadow-md hover:border-[#2563EB]/40 group ${
                  selectedUserId === u.id ? "border-[#2563EB] ring-2 ring-blue-100" : "border-[#E2E8F0]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <img
                      src={u.avatarUrl}
                      alt={u.fullName}
                      className="h-12 w-12 rounded-xl object-cover border border-[#E2E8F0]"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${
                        isOnline ? "bg-[#16A34A]" : "bg-slate-300"
                      }`}
                    />
                  </div>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      u.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {u.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                    {u.fullName}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-[#64748B]">
                    <span className="font-medium text-[#0F172A]">{u.role}</span>
                    <span>•</span>
                    <span>@{u.username}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#F1F5F9] text-xs text-[#64748B]">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-[#94A3B8]" />
                    <span className="truncate">{u.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#94A3B8]" />
                    <span>{u.phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] text-xs">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold border ${getTeamBadgeStyle(
                      u.team
                    )}`}
                  >
                    {u.team}
                  </span>
                  <span className="text-[11px] font-bold text-[#2563EB]">
                    {memberTasksCount} Active Tasks
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Slide-over Profile & RBAC Permissions Drawer */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-2xs">
          <div className="h-full w-full max-w-xl border-l border-[#E2E8F0] bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedUser.avatarUrl}
                    alt={selectedUser.fullName}
                    className="h-12 w-12 rounded-xl object-cover border border-[#E2E8F0]"
                  />
                  <div>
                    <h2 className="text-lg font-bold text-[#0F172A]">{selectedUser.fullName}</h2>
                    <div className="flex items-center gap-2 text-xs text-[#64748B]">
                      <span className="font-semibold text-[#0F172A]">{selectedUser.role}</span>
                      <span>•</span>
                      <span>{selectedUser.team} Team</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/team/members/${selectedUser.id}`}
                    className="p-1.5 rounded-lg text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A]"
                    title="Full Profile"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => setSelectedUserId(null)}
                    className="p-1.5 rounded-lg text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Status & Account Info */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                <div>
                  <span className="text-[#64748B] block mb-1 font-semibold">Account Status</span>
                  <button
                    onClick={() => {
                      toggleUserStatus(selectedUser.id);
                      showToast(`Status toggled to ${selectedUser.status === "Active" ? "Inactive" : "Active"}`);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                      selectedUser.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    }`}
                  >
                    {selectedUser.status}
                  </button>
                </div>
                <div>
                  <span className="text-[#64748B] block mb-1 font-semibold">Username</span>
                  <span className="font-bold text-[#0F172A]">@{selectedUser.username}</span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 space-y-2 text-xs">
                <span className="font-bold text-xs text-[#0F172A] block border-b border-[#E2E8F0] pb-2">
                  Contact Information
                </span>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-[#64748B]">Email Address</span>
                    <div className="font-medium text-[#0F172A] truncate">{selectedUser.email}</div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-[#64748B]">Phone Number</span>
                    <div className="font-medium text-[#0F172A]">{selectedUser.phone}</div>
                  </div>
                </div>
              </div>

              {/* RBAC Access Control Matrix */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#2563EB]" />
                    <span className="font-bold text-xs text-[#0F172A]">
                      Granular RBAC Permissions
                    </span>
                  </div>
                  <span className="text-[10px] text-[#64748B]">Click toggles to edit</span>
                </div>

                {/* Permissions Categories */}
                <div className="space-y-3 text-xs">
                  {/* Category 1: Tasks & Workflow */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      Tasks & Daily Work
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          { key: "viewTasks", label: "View Tasks" },
                          { key: "createTasks", label: "Create Tasks" },
                          { key: "editTasks", label: "Edit / Delete Tasks" },
                          { key: "updateStatus", label: "Change Task Status" },
                          { key: "submitDailyReport", label: "Submit Daily Work" },
                          { key: "checkIn", label: "Attendance Check-In" },
                        ] as const
                      ).map((perm) => (
                        <label
                          key={perm.key}
                          className="flex items-center gap-2 p-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={!!selectedUser.permissions[perm.key]}
                            onChange={() => handleTogglePermission(selectedUser.id, perm.key)}
                            className="h-4 w-4 rounded text-[#2563EB] focus:ring-0 cursor-pointer"
                          />
                          <span className="text-xs font-medium text-[#0F172A]">{perm.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Category 2: Projects & Finance & Admin */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      Projects & Administration
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          { key: "viewAssignedProjects", label: "View Projects" },
                          { key: "viewProjectDetails", label: "Project Details" },
                          { key: "viewFinance", label: "Finance & Invoices" },
                          { key: "manageUsers", label: "Manage Staff / RBAC" },
                          { key: "systemSettings", label: "System Settings" },
                        ] as const
                      ).map((perm) => (
                        <label
                          key={perm.key}
                          className="flex items-center gap-2 p-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={!!selectedUser.permissions[perm.key]}
                            onChange={() => handleTogglePermission(selectedUser.id, perm.key)}
                            className="h-4 w-4 rounded text-[#2563EB] focus:ring-0 cursor-pointer"
                          />
                          <span className="text-xs font-medium text-[#0F172A]">{perm.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Active Tasks Summary */}
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-2">
                <span className="font-bold text-xs text-[#0F172A] flex items-center justify-between">
                  <span>Assigned Delivery Tasks</span>
                  <span className="text-[11px] text-[#2563EB]">
                    {tasks.filter((t) => t.assignedTo === selectedUser.id).length} Active
                  </span>
                </span>
                <div className="space-y-1.5 text-xs">
                  {tasks.filter((t) => t.assignedTo === selectedUser.id).length === 0 ? (
                    <div className="text-[#64748B] text-center py-2">No active tasks assigned</div>
                  ) : (
                    tasks
                      .filter((t) => t.assignedTo === selectedUser.id)
                      .slice(0, 3)
                      .map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E2E8F0]"
                        >
                          <span className="font-semibold text-[#0F172A] truncate max-w-[240px]">
                            [{task.taskKey}] {task.title}
                          </span>
                          <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded">
                            {task.status}
                          </span>
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
                onClick={() => setSelectedUserId(null)}
                className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedUserId(null);
                  showToast("Profile & RBAC changes saved!");
                }}
                className="rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD TEAM MEMBER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-2xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#0F172A]">Add New Team Member</h3>
                <p className="text-xs text-[#64748B]">Create account credentials and configure RBAC roles.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="rounded-lg p-1 text-[#64748B] hover:bg-[#F8FAFC]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              {/* SECTION: PERSONAL INFORMATION */}
              <div className="space-y-2">
                <span className="font-bold text-xs text-[#2563EB] uppercase tracking-wider block border-b border-[#E2E8F0] pb-1">
                  1. Personal & Account Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Tamil Selvan"
                      className="w-full rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. tamil@example.com"
                      className="w-full rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">Username *</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. tamil"
                      className="w-full rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: ROLE & DEPARTMENT */}
              <div className="space-y-2 pt-2">
                <span className="font-bold text-xs text-[#2563EB] uppercase tracking-wider block border-b border-[#E2E8F0] pb-1">
                  2. Role & Department Assignment
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">Job Role *</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-hidden"
                    >
                      <option value="Developer">Developer</option>
                      <option value="Designer">Designer</option>
                      <option value="Backend Developer">Backend Developer</option>
                      <option value="Frontend Developer">Frontend Developer</option>
                      <option value="SEO">SEO</option>
                      <option value="Content">Content</option>
                      <option value="Project Manager">Project Manager</option>
                      <option value="Accountant">Accountant</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">Department Team *</label>
                    <select
                      value={team}
                      onChange={(e) => setTeam(e.target.value as UserTeam)}
                      className="w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-hidden"
                    >
                      <option value="Development">Development</option>
                      <option value="Design">Design</option>
                      <option value="SEO">SEO</option>
                      <option value="Content">Content</option>
                      <option value="Management">Management</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">Account Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
                      className="w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-hidden"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION: RBAC PERMISSIONS */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1">
                  <span className="font-bold text-xs text-[#2563EB] uppercase tracking-wider">
                    3. RBAC Permissions Matrix
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => applyPresetPermissions("developer")}
                      className="px-2 py-0.5 rounded bg-blue-50 text-[10px] font-bold text-[#2563EB] hover:bg-blue-100"
                    >
                      Dev Preset
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetPermissions("pm")}
                      className="px-2 py-0.5 rounded bg-indigo-50 text-[10px] font-bold text-indigo-700 hover:bg-indigo-100"
                    >
                      PM Preset
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetPermissions("admin")}
                      className="px-2 py-0.5 rounded bg-emerald-50 text-[10px] font-bold text-emerald-700 hover:bg-emerald-100"
                    >
                      Admin Preset
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    [
                      { key: "viewTasks", label: "View Tasks" },
                      { key: "createTasks", label: "Create Tasks" },
                      { key: "editTasks", label: "Edit / Delete Tasks" },
                      { key: "updateStatus", label: "Change Task Status" },
                      { key: "submitDailyReport", label: "Submit Daily Work" },
                      { key: "checkIn", label: "Check-In / Out" },
                      { key: "viewAssignedProjects", label: "View Projects" },
                      { key: "viewFinance", label: "View Finance" },
                      { key: "manageUsers", label: "Manage Users" },
                    ] as const
                  ).map((p) => (
                    <label
                      key={p.key}
                      className="flex items-center gap-2 p-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={!!permissions[p.key]}
                        onChange={() =>
                          setPermissions((prev) => ({ ...prev, [p.key]: !prev[p.key] }))
                        }
                        className="h-4 w-4 rounded text-[#2563EB] focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs font-medium text-[#0F172A]">{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-[#E2E8F0] px-4 py-2 font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#2563EB] px-4 py-2 font-semibold text-white hover:bg-blue-700 shadow-xs"
                >
                  Create Team Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
