"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Shield,
  Check,
  Edit2,
  Trash2,
  UserCheck,
  X,
  CheckCircle2,
  FolderKanban,
  UserPlus,
  Briefcase,
  Layers,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { UserTeam, TeamGroup } from "@/types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";

export default function TeamsManagementPage() {
  const { teams, users, addTeam, updateTeam, deleteTeam } = useAppStore();

  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamGroup | null>(null);
  const [deletingTeam, setDeletingTeam] = useState<TeamGroup | null>(null);
  const [teamName, setTeamName] = useState<string>("Marketing");
  const [isCustomName, setIsCustomName] = useState(false);
  const [customNameInput, setCustomNameInput] = useState("");
  const [teamLeadId, setTeamLeadId] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleOpenCreateModal = () => {
    setEditingTeam(null);
    if (users.length > 0) {
      setTeamLeadId(users[0].id);
      setSelectedMemberIds([users[0].id]);
    }
    setTeamName("Marketing");
    setIsCustomName(false);
    setCustomNameInput("");
    setDescription("");
    setIsAddTeamModalOpen(true);
  };

  const handleOpenEditModal = (t: TeamGroup) => {
    setEditingTeam(t);
    setTeamName(t.name);
    setIsCustomName(false);
    setCustomNameInput("");
    setTeamLeadId(t.teamLeadId);
    setSelectedMemberIds(t.memberIds || []);
    setDescription(t.description || "");
    setIsAddTeamModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingTeam) return;
    deleteTeam(deletingTeam.id);
    setDeletingTeam(null);
    showToast("Department team removed.");
  };

  const toggleMemberSelection = (memberId: string) => {
    if (selectedMemberIds.includes(memberId)) {
      setSelectedMemberIds(selectedMemberIds.filter((id) => id !== memberId));
    } else {
      setSelectedMemberIds([...selectedMemberIds, memberId]);
    }
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = isCustomName ? customNameInput.trim() : teamName;
    if (!finalName) return;

    const leadId = teamLeadId || (users[0]?.id ?? "usr-001");
    const lead = users.find((u) => u.id === leadId) || users[0];

    const allMemberIds = Array.from(new Set([leadId, ...selectedMemberIds]));

    if (editingTeam) {
      updateTeam(editingTeam.id, {
        name: finalName as UserTeam,
        teamLeadId: leadId,
        teamLeadName: lead?.fullName || "Tamil Selvan",
        memberIds: allMemberIds,
        description: description.trim() || `${finalName} department & operations team.`,
      });
      setIsAddTeamModalOpen(false);
      setEditingTeam(null);
      setDescription("");
      showToast(`Team "${finalName}" updated successfully!`);
      return;
    }

    addTeam({
      name: finalName as UserTeam,
      teamLeadId: leadId,
      teamLeadName: lead?.fullName || "Team Lead",
      memberIds: allMemberIds,
      description: description.trim() || `${finalName} department & operations team.`,
    });

    setIsAddTeamModalOpen(false);
    setDescription("");
    showToast(`Team "${finalName}" created successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 rounded-xl bg-[#0F172A] px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
              TEAM MANAGEMENT & RBAC
            </h1>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#2563EB] border border-blue-200">
              {teams.length} Department Teams
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Configure department teams, assign team leads, and manage global role permissions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ Create Team</span>
        </button>
      </div>

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No department teams configured"
          description="Create department teams to assign team leads, organize developers and designers, and manage role access."
          actionLabel="+ Create Team"
          onAction={handleOpenCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((t) => {
            const teamMembers = users.filter(
              (u) =>
                u.team.toLowerCase() === t.name.toLowerCase() ||
                (t.memberIds && t.memberIds.includes(u.id))
            );

            return (
              <div
                key={t.id}
                className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-3 hover:shadow-md hover:border-[#2563EB]/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#0F172A]">{t.name} Team</h3>
                        <span className="text-[11px] text-[#64748B]">Lead: {t.teamLeadName}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#2563EB] border border-blue-200">
                        {teamMembers.length} Members
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(t)}
                        className="p-1 rounded text-[#64748B] hover:text-[#2563EB] hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Edit Team"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingTeam(t)}
                        className="p-1 rounded text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Team"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#64748B] leading-relaxed">{t.description}</p>
                </div>

                <div className="pt-3 border-t border-[#F1F5F9] space-y-2">
                  <span className="text-[11px] font-semibold text-[#0F172A] block">
                    Assigned Team Members:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {teamMembers.length === 0 ? (
                      <span className="text-[11px] text-[#94A3B8]">Lead assigned ({t.teamLeadName})</span>
                    ) : (
                      teamMembers.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center gap-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-1 text-[11px] font-medium text-[#0F172A]"
                        >
                          <img
                            src={m.avatarUrl}
                            alt={m.fullName}
                            className="h-4 w-4 rounded-full object-cover"
                          />
                          <span>{m.fullName}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RBAC Permission Matrix */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden space-y-4 p-5">
        <div className="border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#2563EB]" />
            <h3 className="font-bold text-sm text-[#0F172A]">
              Global Role Permissions Matrix (RBAC)
            </h3>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Module access and capabilities granted per user role.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <tr>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Role</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Enquiries (CRM)</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Projects</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Tasks & Kanban</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Daily Work</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Attendance</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Finance & Invoices</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Admin Users</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              <tr className="hover:bg-[#F8FAFC]">
                <td className="py-3 px-4 font-bold text-[#0F172A]">Super Admin / Admin</td>
                <td className="py-3 px-4 text-[#16A34A] font-semibold">Full Access</td>
                <td className="py-3 px-4 text-[#16A34A] font-semibold">Full Access</td>
                <td className="py-3 px-4 text-[#16A34A] font-semibold">Full Access</td>
                <td className="py-3 px-4 text-[#16A34A] font-semibold">Full Access</td>
                <td className="py-3 px-4 text-[#16A34A] font-semibold">Full Access</td>
                <td className="py-3 px-4 text-[#16A34A] font-semibold">Full Access</td>
                <td className="py-3 px-4 text-[#16A34A] font-semibold">Full Access</td>
              </tr>
              <tr className="hover:bg-[#F8FAFC]">
                <td className="py-3 px-4 font-bold text-[#0F172A]">Project Manager</td>
                <td className="py-3 px-4 text-[#2563EB] font-medium">Assigned Only</td>
                <td className="py-3 px-4 text-[#16A34A] font-semibold">Full Access</td>
                <td className="py-3 px-4 text-[#16A34A] font-semibold">Full Access</td>
                <td className="py-3 px-4 text-[#2563EB] font-medium">Submit & Review</td>
                <td className="py-3 px-4 text-[#2563EB] font-medium">Self Attendance</td>
                <td className="py-3 px-4 text-[#64748B]">View Only</td>
                <td className="py-3 px-4 text-[#64748B]">No Access</td>
              </tr>
              <tr className="hover:bg-[#F8FAFC]">
                <td className="py-3 px-4 font-bold text-[#0F172A]">Developer / Designer / SEO</td>
                <td className="py-3 px-4 text-[#64748B]">No Access</td>
                <td className="py-3 px-4 text-[#2563EB] font-medium">Assigned Only</td>
                <td className="py-3 px-4 text-[#2563EB] font-medium">Assigned Only</td>
                <td className="py-3 px-4 text-[#2563EB] font-medium">Submit Daily Logs</td>
                <td className="py-3 px-4 text-[#2563EB] font-medium">Clock In / Out</td>
                <td className="py-3 px-4 text-[#64748B]">No Access</td>
                <td className="py-3 px-4 text-[#64748B]">No Access</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CREATE DEPARTMENT TEAM                                             */}
      {/* ========================================================================= */}
      {isAddTeamModalOpen && (
        <div
          onClick={() => setIsAddTeamModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-2xs p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xl space-y-4 my-8"
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">
                  {editingTeam ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0F172A]">
                    {editingTeam ? "Edit Department Team" : "Create Department Team"}
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    {editingTeam
                      ? "Update team details, department lead, and member allocations."
                      : "Set up a new operational department, assign a lead and add members."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddTeamModalOpen(false);
                  setEditingTeam(null);
                }}
                className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#F8FAFC]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-4 text-xs">
              {/* Team Name Selection / Custom Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-[#0F172A]">Team Name *</label>
                  <button
                    type="button"
                    onClick={() => setIsCustomName(!isCustomName)}
                    className="text-[11px] font-semibold text-[#2563EB] hover:underline"
                  >
                    {isCustomName ? "Choose from standard list" : "+ Enter custom team name"}
                  </button>
                </div>

                {isCustomName ? (
                  <input
                    type="text"
                    required
                    autoFocus
                    value={customNameInput}
                    onChange={(e) => setCustomNameInput(e.target.value)}
                    placeholder="e.g. Quality Assurance (QA) / Mobile App"
                    className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  />
                ) : (
                  <select
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-2 text-xs text-[#0F172A] focus:border-[#2563EB]"
                  >
                    <option value="Marketing">Marketing</option>
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="SEO">SEO</option>
                    <option value="Content">Content</option>
                    <option value="Management">Management</option>
                    <option value="DevOps">DevOps & Cloud</option>
                    <option value="Support">Customer Support</option>
                  </select>
                )}
              </div>

              {/* Team Lead */}
              <div>
                <label className="font-semibold text-[#0F172A] block mb-1">Assigned Team Lead *</label>
                <select
                  value={teamLeadId}
                  onChange={(e) => setTeamLeadId(e.target.value)}
                  className="w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-2 text-xs text-[#0F172A] focus:border-[#2563EB]"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} ({u.role} - {u.team})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Initial Members */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#0F172A] block">
                  Add Team Members ({selectedMemberIds.length} Selected)
                </label>
                <div className="max-h-36 overflow-y-auto border border-[#E2E8F0] rounded-xl p-2 space-y-1 bg-[#F8FAFC]">
                  {users.map((u) => {
                    const isChecked = selectedMemberIds.includes(u.id);
                    return (
                      <div
                        key={u.id}
                        onClick={() => toggleMemberSelection(u.id)}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                          isChecked
                            ? "bg-blue-50 border border-blue-200 text-[#2563EB]"
                            : "bg-white hover:bg-slate-100/60 border border-transparent text-[#0F172A]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={u.avatarUrl}
                            alt=""
                            className="h-5 w-5 rounded-full object-cover border border-[#E2E8F0]"
                          />
                          <span className="font-medium text-xs">{u.fullName}</span>
                          <span className="text-[10px] text-[#64748B]">({u.role})</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-[#2563EB] pointer-events-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold text-[#0F172A] block mb-1">
                  Department Scope & Objectives
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline key functions, tools, and sprint responsibilities..."
                  className="w-full rounded-lg border border-[#E2E8F0] p-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] pt-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddTeamModalOpen(false);
                    setEditingTeam(null);
                  }}
                  className="rounded-xl border border-[#E2E8F0] px-4 py-2 font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{editingTeam ? "Save Team Changes" : "Create Team"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Team Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingTeam}
        title="Delete Department Team"
        message={`Are you sure you want to permanently delete the "${deletingTeam?.name} Team"? Team members will not be deleted.`}
        confirmLabel="Delete Team"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingTeam(null)}
      />
    </div>
  );
}
