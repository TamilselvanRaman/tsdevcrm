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
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { EnquiryStatus, EnquiryPriority } from "@/types";

export default function EnquiryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const enquiryId = params?.id as string;
  const { enquiries, updateEnquiryStatus, assignEnquiry, addEnquiryNote, users, addProject, currentUserId } = useAppStore();
  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const [activeTab, setActiveTab] = useState<"Overview" | "Activity" | "Notes" | "Files">("Overview");
  const [noteInput, setNoteInput] = useState("");

  const enquiry = enquiries.find((e) => e.id === enquiryId) || enquiries[0];

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
      {/* Back Button & Top Action Bar */}
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
    </div>
  );
}
