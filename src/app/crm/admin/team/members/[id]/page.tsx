"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Edit2,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { UserRole, UserTeam } from "@/types";

export default function TeamMemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;
  const { users, tasks, projects, dailyReports, attendance, updateUser, deleteUser } = useAppStore();

  const [activeTab, setActiveTab] = useState<"Overview" | "Tasks" | "Projects" | "Daily Work" | "Attendance">("Overview");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const member = users.find((u) => u.id === userId) || users[0];

  // Edit form state
  const [formName, setFormName] = useState(member?.fullName || "");
  const [formEmail, setFormEmail] = useState(member?.email || "");
  const [formPhone, setFormPhone] = useState(member?.phone || "");
  const [formRole, setFormRole] = useState<UserRole>(member?.role || "Developer");
  const [formTeam, setFormTeam] = useState<UserTeam>(member?.team || "Development");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">(member?.status || "Active");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenEdit = () => {
    if (!member) return;
    setFormName(member.fullName);
    setFormEmail(member.email);
    setFormPhone(member.phone);
    setFormRole(member.role);
    setFormTeam(member.team);
    setFormStatus(member.status);
    setIsEditOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;
    updateUser(member.id, {
      fullName: formName,
      email: formEmail,
      phone: formPhone,
      role: formRole,
      team: formTeam,
      status: formStatus,
    });
    setIsEditOpen(false);
    showToast("Team member updated successfully.");
  };

  const handleDeleteConfirm = () => {
    if (!member) return;
    deleteUser(member.id);
    setIsDeleteOpen(false);
    router.replace("/crm/admin/team/members");
  };

  if (!member) {
    return (
      <div className="p-8 text-center text-xs text-[#64748B]">
        Team member not found. <Link href="/crm/admin/team/members" className="text-[#2563EB]">Return to list</Link>
      </div>
    );
  }

  const memberTasks = tasks.filter((t) => t.assignedTo === member?.id || t.assignedToName === member?.fullName);
  const memberProjects = projects.filter((p) => p.teamMembers.includes(member?.id) || p.managerId === member?.id);
  const memberLogs = dailyReports.filter((r) => r.memberId === member?.id || r.memberName === member?.fullName);
  const memberAttendance = attendance.filter((a) => a.memberId === member?.id || a.memberName === member?.fullName);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#0F172A] text-white px-4 py-3 font-semibold shadow-lg text-xs animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-[#16A34A]" /> {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xs">
        <div className="flex items-center gap-4">
          <Link
            href="/crm/admin/team/members"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <img src={member.avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover border-2 border-[#2563EB]" />

          <div className="space-y-1">
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
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-[#2563EB]" /> {member.email}</span>
              <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-[#2563EB]" /> {member.phone}</span>
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-[#2563EB]" /> Team: {member.team}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenEdit}
            className="flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] shadow-2xs transition-colors"
          >
            <Edit2 className="h-3.5 w-3.5 text-[#2563EB]" />
            <span>Edit Member</span>
          </button>
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 shadow-2xs transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs">
        <div className="flex items-center gap-6 border-b border-[#E2E8F0] px-6 pt-3">
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

        <div className="p-6">
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
                <span className="text-[#64748B] font-medium">Assigned Tasks</span>
                <div className="text-xl font-bold text-[#0F172A]">{memberTasks.length}</div>
              </div>
              <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
                <span className="text-[#64748B] font-medium">Active Projects</span>
                <div className="text-xl font-bold text-[#2563EB]">{memberProjects.length}</div>
              </div>
              <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
                <span className="text-[#64748B] font-medium">Daily Reports Submitted</span>
                <div className="text-xl font-bold text-[#16A34A]">{memberLogs.length}</div>
              </div>
              <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
                <span className="text-[#64748B] font-medium">Attendance Records</span>
                <div className="text-xl font-bold text-[#0F172A]">{memberAttendance.length}</div>
              </div>
            </div>
          )}

          {activeTab === "Tasks" && (
            <div className="space-y-3">
              {memberTasks.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#64748B]">No tasks assigned to this member.</div>
              ) : (
                memberTasks.map((t) => (
                  <div key={t.id} className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-[#2563EB] mr-2">[{t.taskKey}]</span>
                      <span className="font-bold text-[#0F172A]">{t.title}</span>
                      <div className="text-[#64748B] text-[11px] mt-0.5">Project: {t.projectName} • Due: {t.dueDate}</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {t.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "Projects" && (
            <div className="space-y-3">
              {memberProjects.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#64748B]">No projects associated with this member.</div>
              ) : (
                memberProjects.map((p) => (
                  <div key={p.id} className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-[#0F172A]">{p.projectName}</div>
                      <div className="text-[11px] text-[#64748B]">Client: {p.clientName}</div>
                    </div>
                    <span className="text-xs font-bold text-[#2563EB]">{p.progressPct}% Progress</span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "Daily Work" && (
            <div className="space-y-2">
              {memberLogs.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#64748B]">No daily work logs recorded for this member.</div>
              ) : (
                memberLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs">
                    <div className="font-bold text-[#0F172A]">{log.date} - Logged: {log.currentHours}</div>
                    <p className="text-[#64748B] mt-1">{log.completedTasks?.join(", ") || "No tasks listed"}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "Attendance" && (
            <div className="space-y-2">
              {memberAttendance.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#64748B]">No attendance logs found for this member.</div>
              ) : (
                memberAttendance.map((att) => (
                  <div key={att.id} className="p-3.5 rounded-xl border border-[#E2E8F0] flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#0F172A]">{att.date}</span>
                    <span className="text-[#16A34A] font-bold">{att.status} ({att.checkInTime})</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Member Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4 bg-[#F8FAFC]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB]">
                  <Edit2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0F172A]">Edit Member Details</h3>
                  <p className="text-xs text-[#64748B]">Update profile information, role and department</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:bg-[#E2E8F0] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Account Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as "Active" | "Inactive")}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Role
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Team Leader">Team Leader</option>
                    <option value="Developer">Developer</option>
                    <option value="Designer">Designer</option>
                    <option value="SEO">SEO</option>
                    <option value="Content">Content</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Team Department
                  </label>
                  <select
                    value={formTeam}
                    onChange={(e) => setFormTeam(e.target.value as UserTeam)}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  >
                    <option value="Management">Management</option>
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="SEO">SEO</option>
                    <option value="Content">Content</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1D4ED8] transition-colors"
                >
                  <Check className="h-4 w-4" />
                  <span>Update Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Team Member"
        description={`Are you sure you want to permanently remove "${member.fullName}"? This will revoke all portal access.`}
        confirmText="Delete Member"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
