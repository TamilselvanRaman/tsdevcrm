"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  UserCheck,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  FileText,
  Paperclip,
  Plus,
  CheckCircle2,
  Share2,
  FolderPlus,
  Edit2,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { EnquiryStatus, EnquiryPriority } from "@/types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function EnquiryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const enquiryId = params?.id as string;
  const {
    enquiries,
    updateEnquiryStatus,
    assignEnquiry,
    addEnquiryNote,
    users,
    addProject,
    currentUserId,
    updateEnquiry,
    deleteEnquiry,
  } = useAppStore();
  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const [activeTab, setActiveTab] = useState<"Overview" | "Activity" | "Notes" | "Files">("Overview");
  const [noteInput, setNoteInput] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for editing
  const enquiry = enquiries.find((e) => e.id === enquiryId) || enquiries[0];

  const [editClientName, setEditClientName] = useState(enquiry?.clientName || "");
  const [editCompany, setEditCompany] = useState(enquiry?.company || "");
  const [editEmail, setEditEmail] = useState(enquiry?.email || "");
  const [editPhone, setEditPhone] = useState(enquiry?.phone || "");
  const [editLocation, setEditLocation] = useState(enquiry?.location || "");
  const [editRequirement, setEditRequirement] = useState(enquiry?.requirement || "");
  const [editEstimatedBudget, setEditEstimatedBudget] = useState(enquiry?.estimatedBudget || 50000);
  const [editPriority, setEditPriority] = useState<EnquiryPriority>(enquiry?.priority || "Medium");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenEdit = () => {
    if (!enquiry) return;
    setEditClientName(enquiry.clientName);
    setEditCompany(enquiry.company);
    setEditEmail(enquiry.email);
    setEditPhone(enquiry.phone);
    setEditLocation(enquiry.location);
    setEditRequirement(enquiry.requirement);
    setEditEstimatedBudget(enquiry.estimatedBudget);
    setEditPriority(enquiry.priority);
    setIsEditOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiry) return;
    updateEnquiry(enquiry.id, {
      clientName: editClientName,
      company: editCompany,
      email: editEmail,
      phone: editPhone,
      location: editLocation,
      requirement: editRequirement,
      estimatedBudget: Number(editEstimatedBudget),
      priority: editPriority,
    });
    setIsEditOpen(false);
    showToast("Enquiry updated successfully.");
  };

  const handleDeleteConfirm = () => {
    if (!enquiry) return;
    deleteEnquiry(enquiry.id);
    setIsDeleteOpen(false);
    router.replace("/crm/admin/enquiries");
  };

  if (!enquiry) {
    return (
      <div className="p-8 text-center text-xs text-[#64748B]">
        Enquiry not found. <Link href="/crm/admin/enquiries" className="text-[#2563EB]">Return to list</Link>
      </div>
    );
  }

  const handleCreateProject = () => {
    addProject({
      projectCode: `PRJ-${enquiry.company.substring(0, 4).toUpperCase()}`,
      projectName: `${enquiry.company} Delivery Project`,
      clientName: enquiry.company,
      managerId: enquiry.assignedTo,
      managerName: enquiry.assignedToName,
      teamMembers: [enquiry.assignedTo, "usr-002", "usr-003"],
      teamMemberNames: [enquiry.assignedToName, "Priya Raman", "Arun Kumar"],
      progressPct: 5,
      deadline: "2026-11-15",
      status: "In Progress",
      priority: enquiry.priority === "Urgent" ? "High" : enquiry.priority,
      budget: enquiry.estimatedBudget,
      milestones: [
        { id: "m1", title: "Project Kickoff & Specs", progressPct: 100, status: "Completed" },
        { id: "m2", title: "UI/UX Figma Prototypes", progressPct: 20, status: "In Progress" },
      ],
      description: enquiry.description,
    });

    updateEnquiryStatus(enquiry.id, "Won");
    router.push("/crm/admin/projects");
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#0F172A] text-white px-4 py-3 font-semibold shadow-lg text-xs animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-[#16A34A]" /> {toastMessage}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/crm/admin/enquiries"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">{enquiry.clientName}</h1>
              <span className="text-xs font-medium text-[#64748B]">({enquiry.company})</span>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#2563EB] border border-blue-200">
                {enquiry.status}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              {enquiry.requirement} • ₹{enquiry.estimatedBudget.toLocaleString("en-IN")} Estimated Budget
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCreateProject}
            className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
          >
            <FolderPlus className="h-4 w-4" />
            <span>Create Project</span>
          </button>
          <button
            onClick={handleOpenEdit}
            className="flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] transition-colors shadow-2xs"
          >
            <Edit2 className="h-3.5 w-3.5 text-[#2563EB]" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors shadow-2xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Workspace & Right Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Information Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CLIENT Card */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 space-y-2 shadow-2xs">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block border-b border-[#E2E8F0] pb-1.5">
                Client Info
              </span>
              <div className="space-y-1 text-xs">
                <div className="font-bold text-[#0F172A]">{enquiry.clientName}</div>
                <div className="flex items-center gap-1.5 text-[#64748B]">
                  <Phone className="h-3.5 w-3.5 text-[#2563EB]" /> {enquiry.phone}
                </div>
                <div className="flex items-center gap-1.5 text-[#64748B]">
                  <Mail className="h-3.5 w-3.5 text-[#2563EB]" /> {enquiry.email}
                </div>
                <div className="flex items-center gap-1.5 text-[#64748B]">
                  <MapPin className="h-3.5 w-3.5 text-[#2563EB]" /> {enquiry.location}
                </div>
              </div>
            </div>

            {/* REQUIREMENT Card */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 space-y-2 shadow-2xs">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block border-b border-[#E2E8F0] pb-1.5">
                Requirement
              </span>
              <div className="space-y-1 text-xs">
                <div className="font-bold text-[#0F172A]">{enquiry.projectType}</div>
                <div className="text-[#64748B]">Budget: ₹{enquiry.estimatedBudget.toLocaleString("en-IN")}</div>
                <div className="text-[#64748B]">Timeline: {enquiry.expectedTimeline}</div>
                <div className="text-[#64748B]">Source: {enquiry.source}</div>
              </div>
            </div>

            {/* ASSIGNMENT Card */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 space-y-2 shadow-2xs">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block border-b border-[#E2E8F0] pb-1.5">
                Assignment
              </span>
              <div className="space-y-1 text-xs">
                <div className="font-bold text-[#0F172A]">{enquiry.assignedToName}</div>
                <div className="text-[#64748B]">Priority: {enquiry.priority}</div>
                <div className="text-[#64748B]">Created: {enquiry.createdDate}</div>
                <div className="text-[#64748B]">Follow-up: {enquiry.nextFollowUp}</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs">
            <div className="flex items-center gap-6 border-b border-[#E2E8F0] px-5 pt-3">
              {(["Overview", "Activity", "Notes", "Files"] as const).map((tab) => (
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

            <div className="p-5 text-xs">
              {activeTab === "Overview" && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-sm text-[#0F172A] mb-1">Project Overview & Description</h4>
                    <p className="text-[#64748B] leading-relaxed">{enquiry.description}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-[#0F172A] mb-2">Scope Services Needed</h4>
                    <div className="flex flex-wrap gap-2">
                      {enquiry.services.map((s, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 text-xs font-medium text-[#0F172A]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Activity" && (
                <div className="space-y-3">
                  {enquiry.activities.map((act) => (
                    <div key={act.id} className="flex gap-3 border-l-2 border-[#2563EB] pl-3 py-1">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-[#0F172A]">{act.text}</div>
                        <div className="text-[10px] text-[#64748B]">
                          {act.timestamp} • by {act.author}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "Notes" && (
                <div className="space-y-4">
                  {/* Note Composer */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!noteInput.trim()) return;
                      addEnquiryNote(enquiry.id, noteInput.trim(), currentUser.fullName);
                      setNoteInput("");
                    }}
                    className="space-y-2 p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]"
                  >
                    <label className="font-bold text-xs text-[#0F172A] block">Add Internal Note / Update</label>
                    <textarea
                      rows={2}
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder={`Write a note as ${currentUser.fullName}...`}
                      className="w-full rounded-lg border border-[#E2E8F0] bg-white p-2.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-hidden focus:border-[#2563EB]"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!noteInput.trim()}
                        className="rounded-lg bg-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        Save Note
                      </button>
                    </div>
                  </form>

                  {/* Notes List */}
                  <div className="space-y-3">
                    {(!enquiry.notes || enquiry.notes.length === 0) ? (
                      <div className="p-4 text-center text-[#64748B] bg-[#F8FAFC] rounded-xl">
                        No notes yet. Use the form above to add an update.
                      </div>
                    ) : (
                      enquiry.notes.map((n) => (
                        <div key={n.id} className="p-3.5 rounded-xl border border-[#E2E8F0] bg-white space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                            <span className="font-bold text-[#0F172A]">{n.author}</span>
                            <span>{n.timestamp}</span>
                          </div>
                          <p className="text-xs text-[#0F172A] leading-relaxed">{n.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === "Files" && (
                <div className="space-y-2">
                  {enquiry.files.length === 0 ? (
                    <div className="py-6 text-center text-[#64748B]">No files attached</div>
                  ) : (
                    enquiry.files.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC]"
                      >
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4 text-[#2563EB]" />
                          <div>
                            <div className="font-semibold text-[#0F172A]">{f.name}</div>
                            <div className="text-[10px] text-[#64748B]">{f.size} • Uploaded {f.date}</div>
                          </div>
                        </div>
                        <button className="text-xs font-semibold text-[#2563EB]">Download</button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Lead Control Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2">
              Lead Control Panel
            </h3>

            {/* Lead Status selector */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-[#64748B] block">Pipeline Lead Status</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"] as EnquiryStatus[]).map((st) => {
                  const isActive = enquiry.status === st;
                  const dotColors: Record<EnquiryStatus, string> = {
                    New: "bg-blue-500",
                    Contacted: "bg-amber-500",
                    Qualified: "bg-emerald-500",
                    Proposal: "bg-purple-500",
                    Negotiation: "bg-orange-500",
                    Won: "bg-emerald-600",
                    Lost: "bg-red-500",
                  };
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateEnquiryStatus(enquiry.id, st)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        isActive
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                          : "bg-white text-[#334155] border-[#E2E8F0] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-white" : dotColors[st]}`} />
                      <span>{st}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Assigned Team Member */}
            <div className="space-y-1 text-xs">
              <label className="font-semibold text-[#64748B]">Assigned Team Member</label>
              <select
                value={enquiry.assignedTo}
                onChange={(e) => {
                  const u = users.find((usr) => usr.id === e.target.value);
                  if (u) assignEnquiry(enquiry.id, u.id, u.fullName);
                }}
                className="w-full rounded-lg border border-[#E2E8F0] bg-white p-2 font-semibold text-[#0F172A]"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Next Follow-Up */}
            <div className="space-y-1 text-xs">
              <label className="font-semibold text-[#64748B]">Next Follow-up Date</label>
              <input
                type="date"
                defaultValue={enquiry.nextFollowUp}
                className="w-full rounded-lg border border-[#E2E8F0] bg-white p-2 text-xs font-medium text-[#0F172A]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Enquiry Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4 bg-[#F8FAFC]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB]">
                  <Edit2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0F172A]">Edit Enquiry</h3>
                  <p className="text-xs text-[#64748B]">Update client requirements and budget</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:bg-[#E2E8F0] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editClientName}
                    onChange={(e) => setEditClientName(e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Requirement
                </label>
                <textarea
                  rows={2}
                  value={editRequirement}
                  onChange={(e) => setEditRequirement(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Estimated Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={editEstimatedBudget}
                    onChange={(e) => setEditEstimatedBudget(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Priority
                  </label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as EnquiryPriority)}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
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
                  <span>Update Enquiry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Enquiry"
        description={`Are you sure you want to permanently delete enquiry for "${enquiry.clientName}"? This action cannot be undone.`}
        confirmText="Delete Enquiry"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
