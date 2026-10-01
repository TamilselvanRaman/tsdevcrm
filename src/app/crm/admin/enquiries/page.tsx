"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Calendar,
  UserCheck,
  MessageSquare,
  ChevronDown,
  X,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  FolderPlus,
  Send,
  Clock,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Check,
  UserPlus,
  Building2,
  IndianRupee,
  Layers,
  Edit2,
  Trash2,
  Users,
  CalendarCheck,
  ArrowRight,
} from "lucide-react";
import { useAppStore, SYSTEM_FALLBACK_USER } from "@/store/useAppStore";
import { EnquiryStatus, EnquiryPriority, Enquiry } from "@/types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { clsx } from "clsx";

const STATUS_CONFIG: Record<
  EnquiryStatus,
  {
    label: string;
    dot: string;
    bg: string;
    text: string;
    border: string;
    hoverBg: string;
  }
> = {
  New: {
    label: "New Lead",
    dot: "bg-blue-500 ring-2 ring-blue-200",
    bg: "bg-blue-50/90",
    text: "text-blue-700",
    border: "border-blue-200",
    hoverBg: "hover:bg-blue-100/80 hover:border-blue-300",
  },
  Contacted: {
    label: "Contacted",
    dot: "bg-amber-500 ring-2 ring-amber-200",
    bg: "bg-amber-50/90",
    text: "text-amber-700",
    border: "border-amber-200",
    hoverBg: "hover:bg-amber-100/80 hover:border-amber-300",
  },
  Qualified: {
    label: "Qualified",
    dot: "bg-emerald-500 ring-2 ring-emerald-200",
    bg: "bg-emerald-50/90",
    text: "text-emerald-700",
    border: "border-emerald-200",
    hoverBg: "hover:bg-emerald-100/80 hover:border-emerald-300",
  },
  Proposal: {
    label: "Proposal Sent",
    dot: "bg-purple-500 ring-2 ring-purple-200",
    bg: "bg-purple-50/90",
    text: "text-purple-700",
    border: "border-purple-200",
    hoverBg: "hover:bg-purple-100/80 hover:border-purple-300",
  },
  Negotiation: {
    label: "Negotiation",
    dot: "bg-orange-500 ring-2 ring-orange-200",
    bg: "bg-orange-50/90",
    text: "text-orange-700",
    border: "border-orange-200",
    hoverBg: "hover:bg-orange-100/80 hover:border-orange-300",
  },
  Won: {
    label: "Deal Won",
    dot: "bg-emerald-600 ring-2 ring-emerald-300",
    bg: "bg-emerald-100/90",
    text: "text-emerald-800",
    border: "border-emerald-300",
    hoverBg: "hover:bg-emerald-200/80 hover:border-emerald-400",
  },
  Lost: {
    label: "Lost",
    dot: "bg-red-500 ring-2 ring-red-200",
    bg: "bg-red-50/90",
    text: "text-red-700",
    border: "border-red-200",
    hoverBg: "hover:bg-red-100/80 hover:border-red-300",
  },
};

function StatusDropdown({
  currentStatus,
  onStatusChange,
  isOpen,
  onToggle,
  onClose,
}: {
  currentStatus: EnquiryStatus;
  onStatusChange: (status: EnquiryStatus) => void;
  isOpen: boolean;
  onToggle: (e: React.MouseEvent) => void;
  onClose: () => void;
}) {
  const current = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.New;
  const statuses: EnquiryStatus[] = [
    "New",
    "Contacted",
    "Qualified",
    "Proposal",
    "Negotiation",
    "Won",
    "Lost",
  ];

  return (
    <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={onToggle}
        className={clsx(
          "group inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all duration-150 shadow-2xs cursor-pointer select-none",
          current.bg,
          current.text,
          current.border,
          current.hoverBg,
          isOpen ? "ring-2 ring-blue-500/25 shadow-xs scale-[1.02]" : ""
        )}
      >
        <span className={clsx("h-1.5 w-1.5 rounded-full shrink-0 transition-transform group-hover:scale-110", current.dot)} />
        <span className="leading-tight">{currentStatus}</span>
        <ChevronDown
          className={clsx("h-3 w-3 opacity-70 transition-transform duration-200 shrink-0", isOpen ? "rotate-180 opacity-100" : "group-hover:opacity-100")}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <div className="absolute left-0 top-full mt-1.5 z-50 w-44 origin-top-left rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-xl shadow-slate-900/10 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Update Pipeline Status
            </div>
            <div className="space-y-0.5 mt-0.5">
              {statuses.map((status) => {
                const cfg = STATUS_CONFIG[status];
                const isSelected = status === currentStatus;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      onStatusChange(status);
                      onClose();
                    }}
                    className={clsx(
                      "flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors text-left cursor-pointer",
                      isSelected
                        ? `${cfg.bg} ${cfg.text} font-semibold border ${cfg.border}`
                        : "text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className={clsx("h-2 w-2 rounded-full shrink-0", cfg.dot)} />
                      <span>{status}</span>
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

export default function EnquiryListPage() {
  const router = useRouter();
  const {
    enquiries,
    addEnquiry,
    updateEnquiry,
    deleteEnquiry,
    updateEnquiryStatus,
    assignEnquiry,
    addEnquiryNote,
    addProject,
    addFollowUp,
    addClient,
    convertEnquiryToFollowUp,
    convertEnquiryToClient,
    users,
    currentUserId,
  } = useAppStore();

  const currentUser = users.find((u) => u.id === currentUserId) || users[0] || SYSTEM_FALLBACK_USER;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [assignedFilter, setAssignedFilter] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState<Enquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Enquiry | null>(null);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null);
  const [activeDropdownEnquiryId, setActiveDropdownEnquiryId] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // ── PIPELINE: Schedule Follow-up ──────────────────────────────────────
  const [followUpEnquiry, setFollowUpEnquiry] = useState<Enquiry | null>(null);
  const [fuType, setFuType] = useState<"Phone Call" | "WhatsApp" | "Email" | "Video Call" | "Site Visit" | "In-Person">("Phone Call");
  const [fuDate, setFuDate] = useState(new Date(Date.now() + 86400000).toISOString().split("T")[0]);
  const [fuTime, setFuTime] = useState("11:00 AM");
  const [fuPurpose, setFuPurpose] = useState("");
  const [fuAssignedTo, setFuAssignedTo] = useState(users[0]?.fullName || "");

  const handleOpenFollowUpModal = (enq: Enquiry) => {
    if (enq.isLocked) {
      showToast("🔒 Lead is locked. Stage already advanced.");
      return;
    }
    setFollowUpEnquiry(enq);
    setFuType("Phone Call");
    setFuDate(new Date(Date.now() + 86400000).toISOString().split("T")[0]);
    setFuTime("11:00 AM");
    setFuPurpose(`Follow up with ${enq.clientName} regarding ${enq.requirement}`);
    const assignedUser = users.find((u) => u.id === enq.assignedTo);
    setFuAssignedTo(assignedUser?.fullName || users[0]?.fullName || "");
  };

  const handleScheduleFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpEnquiry) return;
    convertEnquiryToFollowUp(followUpEnquiry.id, {
      type: fuType,
      scheduledDate: fuDate,
      scheduledTime: fuTime,
      assignedTo: fuAssignedTo,
      purpose: fuPurpose.trim() || `Follow up with ${followUpEnquiry.clientName}`,
    });
    setFollowUpEnquiry(null);
    showToast("✅ Follow-up scheduled & Enquiry locked! Redirecting to Follow-ups...");
    setTimeout(() => router.push("/crm/admin/follow-ups"), 1200);
  };

  // ── PIPELINE: Convert to Client ─────────────────────────────────────────
  const [clientEnquiry, setClientEnquiry] = useState<Enquiry | null>(null);
  const [cliCategory, setCliCategory] = useState("Software Development");
  const [cliAddress, setCliAddress] = useState("");
  const [cliManager, setCliManager] = useState(users[0]?.fullName || "");

  const handleOpenClientModal = (enq: Enquiry) => {
    if (enq.isLocked && enq.stageStatus === "Client") {
      showToast("🔒 Lead already converted to Client.");
      return;
    }
    setClientEnquiry(enq);
    setCliCategory(enq.projectType || "Software Development");
    setCliAddress(enq.location || "Chennai, Tamil Nadu");
    const assignedUser = users.find((u) => u.id === enq.assignedTo);
    setCliManager(assignedUser?.fullName || users[0]?.fullName || "");
  };

  const handleConvertToClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEnquiry) return;
    convertEnquiryToClient(clientEnquiry.id);
    setClientEnquiry(null);
    showToast("🎉 Client profile created & Enquiry locked! Redirecting to Clients...");
    setTimeout(() => router.push("/crm/admin/clients"), 1200);
  };

  // Create/Edit Form state
  const [clientName, setClientName] = useState("");
  const [company, setCompany] = useState("");
  const [requirement, setRequirement] = useState("");
  const [budget, setBudget] = useState("150000");
  const [source, setSource] = useState("Instagram");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [whatsapp, setWhatsapp] = useState("+91 98765 43210");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("Chennai, Tamil Nadu");
  const [projectType, setProjectType] = useState("Website + Android App");
  const [timeline, setTimeline] = useState("4 Weeks");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState(users[0]?.id || "usr-001");
  const [priority, setPriority] = useState<EnquiryPriority>("High");
  const [initialStatus, setInitialStatus] = useState<EnquiryStatus>("New");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleOpenAddModal = () => {
    setEditingEnquiry(null);
    setClientName("");
    setCompany("");
    setRequirement("");
    setBudget("");
    setSource("Instagram");
    setPhone("");
    setWhatsapp("");
    setEmail("");
    setLocation("");
    setProjectType("Website");
    setTimeline("4 Weeks");
    setDescription("");
    setPriority("High");
    setInitialStatus("New");
    setAssignedTo(users[0]?.id || currentUserId || "usr-001");
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (enq: Enquiry) => {
    setEditingEnquiry(enq);
    setClientName(enq.clientName || "");
    setCompany(enq.company || "");
    setRequirement(enq.requirement || "");
    setBudget(enq.estimatedBudget ? enq.estimatedBudget.toString() : "150000");
    setSource(enq.source || "Instagram");
    setPhone(enq.phone || "");
    setWhatsapp(enq.whatsapp || "");
    setEmail(enq.email || "");
    setLocation(enq.location || "Chennai, Tamil Nadu");
    setProjectType(enq.projectType || "Website + Android App");
    setTimeline(enq.expectedTimeline || "4 Weeks");
    setDescription(enq.description || "");
    setPriority(enq.priority || "High");
    setInitialStatus(enq.status || "New");
    setAssignedTo(enq.assignedTo || users[0]?.id || "usr-001");
    setIsAddModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteEnquiry(deleteTarget.id);
    if (selectedEnquiryId === deleteTarget.id) {
      setSelectedEnquiryId(null);
    }
    setDeleteTarget(null);
    showToast("Enquiry deleted successfully.");
  };

  const filteredEnquiries = enquiries.filter((e) => {
    // Hide moved/locked/converted enquiries from active view once advanced to next stage
    const isMoved =
      Boolean(e.isLocked) ||
      Boolean(e.stageStatus && e.stageStatus !== "Enquiry") ||
      Boolean(e.convertedFollowUpId) ||
      Boolean(e.convertedClientId) ||
      Boolean(e.convertedProjectId) ||
      e.status === "Won";

    if (isMoved && statusFilter !== "Moved to Next Stage" && statusFilter !== "All History") {
      return false;
    }

    const matchesSearch =
      e.clientName.toLowerCase().includes(search.toLowerCase()) ||
      e.company.toLowerCase().includes(search.toLowerCase()) ||
      e.requirement.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || statusFilter === "Moved to Next Stage" || statusFilter === "All History"
        ? true
        : e.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || e.priority === priorityFilter;
    const matchesAssigned = assignedFilter === "All" || e.assignedTo === assignedFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesAssigned;
  });

  const selectedEnquiry = enquiries.find((e) => e.id === selectedEnquiryId);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      showToast("Please enter client name");
      return;
    }
    if (!requirement.trim()) {
      showToast("Please enter project requirement");
      return;
    }

    const assignedUser = users.find((u) => u.id === assignedTo) || users[0];
    const generatedEmail = email.trim() || `${clientName.toLowerCase().replace(/[^a-z0-9]/g, "")}@example.com`;

    if (editingEnquiry) {
      updateEnquiry(editingEnquiry.id, {
        clientName: clientName.trim(),
        company: company.trim() || clientName.trim(),
        requirement: requirement.trim(),
        estimatedBudget: Number(budget) || 0,
        source: source || "Direct Call",
        assignedTo: assignedUser?.id || "usr-001",
        assignedToName: assignedUser?.fullName || "Tamil Selvan",
        priority,
        status: initialStatus,
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        email: generatedEmail,
        location: location.trim(),
        projectType: projectType || requirement.trim(),
        services: [projectType || "Web Development", "UI/UX Design"],
        description: description.trim(),
        expectedTimeline: timeline || "4 Weeks",
      });
      setIsAddModalOpen(false);
      setEditingEnquiry(null);
      showToast("Enquiry updated successfully!");
      return;
    }

    addEnquiry({
      clientName: clientName.trim(),
      company: company.trim() || clientName.trim(),
      requirement: requirement.trim(),
      estimatedBudget: Number(budget) || 0,
      source: source || "Direct Call",
      assignedTo: assignedUser?.id || "usr-001",
      assignedToName: assignedUser?.fullName || "Tamil Selvan",
      priority,
      status: initialStatus,
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      email: generatedEmail,
      location: location.trim(),
      projectType: projectType || requirement.trim(),
      services: [projectType || "Web Development", "UI/UX Design"],
      description:
        description.trim() ||
        `New client enquiry for ${requirement.trim()} with estimated budget ₹${Number(
          budget || 0
        ).toLocaleString("en-IN")}.`,
      expectedTimeline: timeline || "4 Weeks",
      nextFollowUp: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
    });

    setIsAddModalOpen(false);
    showToast("🎉 New Enquiry Created & Tracked in Pipeline!");
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedEnquiryId) return;
    addEnquiryNote(selectedEnquiryId, newNoteText.trim(), currentUser?.fullName || "Admin");
    setNewNoteText("");
    showToast("Note added to lead record");
  };

  const handleStatusChange = (id: string, newStatus: EnquiryStatus) => {
    updateEnquiryStatus(id, newStatus);
    showToast(`Status updated to ${newStatus}`);
  };

  const handleAssigneeChange = (enquiryId: string, memberId: string) => {
    const member = users.find((u) => u.id === memberId);
    if (!member) return;
    assignEnquiry(enquiryId, memberId, member.fullName);
    showToast(`Assigned to ${member.fullName}`);
  };

  const handleConvertToProject = (enq: typeof enquiries[0]) => {
    addProject({
      projectCode: `PRJ-${enq.company.substring(0, 4).toUpperCase()}`,
      projectName: `${enq.company} Delivery Project`,
      clientName: enq.company,
      managerId: enq.assignedTo,
      managerName: enq.assignedToName,
      teamMembers: [enq.assignedTo, "usr-002", "usr-003"],
      teamMemberNames: [enq.assignedToName, "Priya Raman", "Arun Kumar"],
      progressPct: 5,
      deadline: "2026-11-15",
      status: "In Progress",
      priority: enq.priority === "Urgent" ? "High" : enq.priority,
      budget: enq.estimatedBudget,
      milestones: [
        { id: "m1", title: "Project Kickoff & Specs", progressPct: 100, status: "Completed" },
        { id: "m2", title: "UI/UX Figma Prototypes", progressPct: 20, status: "In Progress" },
      ],
      description: enq.description,
    });
    updateEnquiry(enq.id, {
      status: "Won",
      isLocked: true,
      stageStatus: "Project",
    });
    showToast("Converted to delivery project!");
    router.push("/crm/admin/projects");
  };

  const getStatusBadgeStyle = (status: EnquiryStatus) => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Contacted":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Qualified":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Proposal":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Negotiation":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Won":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Lost":
        return "bg-red-50 text-red-700 border-red-200";
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

      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Enquiries</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage incoming client leads, team assignments, pipeline status & notes.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm cursor-pointer active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>New Enquiry</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">New Leads</span>
          <div className="text-xl font-bold text-[#0F172A]">
            {enquiries.filter((e) => e.status === "New").length}
          </div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Contacted / In Progress</span>
          <div className="text-xl font-bold text-[#0F172A]">
            {enquiries.filter((e) => e.status === "Contacted" || e.status === "Qualified").length}
          </div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Proposal / Negotiation</span>
          <div className="text-xl font-bold text-[#0F172A]">
            {enquiries.filter((e) => e.status === "Proposal" || e.status === "Negotiation").length}
          </div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Won Deals</span>
          <div className="text-xl font-bold text-[#16A34A]">
            {enquiries.filter((e) => e.status === "Won").length}
          </div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Lost</span>
          <div className="text-xl font-bold text-[#DC2626]">
            {enquiries.filter((e) => e.status === "Lost").length}
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
            placeholder="Search client, company or requirement..."
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
            <option value="All">Active Enquiries (Default)</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal">Proposal</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
            <option value="Moved to Next Stage">🔒 Moved to Next Stage</option>
            <option value="All History">All History (Inc. Moved)</option>
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

          {/* Assigned Member Filter */}
          <select
            value={assignedFilter}
            onChange={(e) => setAssignedFilter(e.target.value)}
            className="rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0F172A] focus:outline-hidden"
          >
            <option value="All">All Team Members</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.fullName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Corporate Table with Clickable Rows & Inline Status Dropdown */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-compact">
            <thead>
              <tr>
                <th>Client</th>
                <th>Company</th>
                <th>Requirement</th>
                <th>Budget</th>
                <th>Source</th>
                <th>Assigned To</th>
                <th>Priority</th>
                <th>Status (Quick Update)</th>
                <th>Created</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center">
                    <EmptyState
                      icon={Users}
                      title="No enquiries found"
                      description="Create an enquiry lead or adjust your filter criteria."
                      actionLabel="+ New Enquiry"
                      onAction={handleOpenAddModal}
                    />
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enq) => {
                  const assignedUser = users.find((u) => u.id === enq.assignedTo);
                  return (
                    <tr
                      key={enq.id}
                      onClick={() => setSelectedEnquiryId(enq.id)}
                      className={`cursor-pointer transition-colors hover:bg-blue-50/50 ${
                        selectedEnquiryId === enq.id ? "bg-blue-50/75 ring-1 ring-blue-200" : ""
                      }`}
                      title="Click anywhere to view enquiry details"
                    >
                      <td className="font-semibold text-[#0F172A]">
                        <span className="hover:text-[#2563EB] transition-colors inline-flex items-center gap-1.5">
                          {enq.clientName}
                          {enq.isLocked && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-0.5">
                              🔒 {enq.stageStatus || "Advanced"}
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="text-[#64748B]">{enq.company}</td>
                      <td className="text-[#0F172A] font-medium">{enq.requirement}</td>
                      <td className="font-semibold text-[#0F172A]">
                        ₹{enq.estimatedBudget.toLocaleString("en-IN")}
                      </td>
                      <td className="text-[#64748B]">{enq.source}</td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <img
                            src={assignedUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                            alt={enq.assignedToName}
                            className="h-5 w-5 rounded-full object-cover border border-[#E2E8F0]"
                          />
                          <span className="text-[#0F172A] font-medium text-xs">{enq.assignedToName}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${
                            enq.priority === "High" || enq.priority === "Urgent"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {enq.priority}
                        </span>
                      </td>
                      {/* Interactive Status Selector Dropdown */}
                      <td onClick={(e) => e.stopPropagation()}>
                        <StatusDropdown
                          currentStatus={enq.status}
                          onStatusChange={(newStatus) => handleStatusChange(enq.id, newStatus)}
                          isOpen={activeDropdownEnquiryId === enq.id}
                          onToggle={(e) => {
                            e.stopPropagation();
                            setActiveDropdownEnquiryId(activeDropdownEnquiryId === enq.id ? null : enq.id);
                          }}
                          onClose={() => setActiveDropdownEnquiryId(null)}
                        />
                      </td>
                      <td className="text-[#64748B]">{enq.createdDate}</td>
                      <td onClick={(e) => e.stopPropagation()} className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenFollowUpModal(enq)}
                            disabled={enq.isLocked}
                            className="p-1.5 text-[#64748B] hover:text-[#7C3AED] hover:bg-purple-50 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            title={enq.isLocked ? "Stage Locked" : "Schedule Follow-up"}
                          >
                            <CalendarCheck className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(enq)}
                            className="p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Lead"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(enq)}
                            className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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

      {/* Slide-over Full Details Drawer */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-2xs">
          <div className="h-full w-full max-w-xl border-l border-[#E2E8F0] bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[#0F172A]">{selectedEnquiry.clientName}</h2>
                    <span className="text-xs text-[#64748B]">({selectedEnquiry.company})</span>
                  </div>
                  <p className="text-xs text-[#64748B]">{selectedEnquiry.requirement}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(selectedEnquiry)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Edit Lead"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-[#2563EB]" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(selectedEnquiry)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50 text-xs font-semibold text-[#DC2626] hover:bg-red-100 transition-colors cursor-pointer"
                    title="Delete Lead"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                  <Link
                    href={`/crm/admin/enquiries/${selectedEnquiry.id}`}
                    className="p-1.5 rounded-lg text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A]"
                    title="Full Page"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => setSelectedEnquiryId(null)}
                    className="p-1.5 rounded-lg text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Status & Priority Row */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div>
                  <label className="text-[11px] font-semibold text-[#64748B] block mb-1">
                    Pipeline Status
                  </label>
                  <StatusDropdown
                    currentStatus={selectedEnquiry.status}
                    onStatusChange={(newStatus) => handleStatusChange(selectedEnquiry.id, newStatus)}
                    isOpen={activeDropdownEnquiryId === `drawer-${selectedEnquiry.id}`}
                    onToggle={(e) => {
                      e.stopPropagation();
                      setActiveDropdownEnquiryId(
                        activeDropdownEnquiryId === `drawer-${selectedEnquiry.id}`
                          ? null
                          : `drawer-${selectedEnquiry.id}`
                      );
                    }}
                    onClose={() => setActiveDropdownEnquiryId(null)}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#64748B] block mb-1">
                    Lead Priority
                  </label>
                  <span
                    className={`inline-flex items-center w-full justify-center rounded-lg border px-2.5 py-1.5 text-xs font-bold ${
                      selectedEnquiry.priority === "High" || selectedEnquiry.priority === "Urgent"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {selectedEnquiry.priority} Priority
                  </span>
                </div>
              </div>

              {/* Assigned Team Member Section */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                    <UserCheck className="h-4 w-4 text-[#2563EB]" />
                    Lead Assignee (Team Member)
                  </span>
                  <span className="text-[10px] text-[#64748B]">Click to reassign</span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={
                      users.find((u) => u.id === selectedEnquiry.assignedTo)?.avatarUrl ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                    }
                    alt={selectedEnquiry.assignedToName || "Assignee"}
                    className="h-10 w-10 rounded-full object-cover border border-[#E2E8F0] shadow-xs"
                  />
                  <div className="flex-1 relative">
                    <select
                      value={selectedEnquiry.assignedTo || "usr-001"}
                      onChange={(e) => handleAssigneeChange(selectedEnquiry.id, e.target.value)}
                      className="w-full appearance-none rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-3 pr-8 py-2 text-xs font-bold text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-xs transition-all"
                    >
                      {users.length > 0 ? (
                        users.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.fullName} ({u.role} - {u.team})
                          </option>
                        ))
                      ) : (
                        <option value={selectedEnquiry.assignedTo || "usr-001"}>
                          {selectedEnquiry.assignedToName || "Tamil Selvan"} (Admin)
                        </option>
                      )}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Lead Commercials, Source & Follow-up Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-3 rounded-xl border border-[#E2E8F0] bg-white space-y-1">
                  <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">Budget</span>
                  <div className="text-sm font-bold text-[#0F172A]">
                    ₹{Number(selectedEnquiry.estimatedBudget || 0).toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-[#E2E8F0] bg-white space-y-1">
                  <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">Project Type</span>
                  <div className="text-xs font-bold text-[#0F172A] truncate">
                    {selectedEnquiry.projectType || "Website"}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-[#E2E8F0] bg-white space-y-1">
                  <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">Source</span>
                  <div className="text-xs font-bold text-[#0F172A] truncate">
                    {selectedEnquiry.source || "Direct"}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-[#E2E8F0] bg-white space-y-1">
                  <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">Follow-Up</span>
                  <div className="text-xs font-bold text-[#2563EB] truncate">
                    {selectedEnquiry.nextFollowUp || "Not set"}
                  </div>
                </div>
              </div>

              {/* Direct Communication Channels */}
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 space-y-2.5 text-xs">
                <div className="font-bold text-[#0F172A] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-[#2563EB]" />
                    Contact Channels
                  </span>
                  {selectedEnquiry.location && (
                    <span className="text-[11px] font-medium text-[#64748B] flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      <span className="truncate max-w-[200px]">{selectedEnquiry.location}</span>
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[#0F172A]">
                  {selectedEnquiry.phone && (
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-[#E2E8F0] hover:bg-blue-50/70 hover:border-blue-200 transition-colors truncate"
                      title="Call Phone"
                    >
                      <Phone className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                      <span className="truncate font-semibold">{selectedEnquiry.phone}</span>
                    </a>
                  )}
                  {(selectedEnquiry.whatsapp || selectedEnquiry.phone) && (
                    <a
                      href={`https://wa.me/${(selectedEnquiry.whatsapp || selectedEnquiry.phone || "").replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-emerald-200 hover:bg-emerald-50 transition-colors truncate"
                      title="Open WhatsApp Chat"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-[#16A34A] shrink-0" />
                      <span className="truncate font-bold text-[#16A34A]">
                        {selectedEnquiry.whatsapp || selectedEnquiry.phone}
                      </span>
                    </a>
                  )}
                  {selectedEnquiry.email && (
                    <a
                      href={`mailto:${selectedEnquiry.email}`}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-[#E2E8F0] hover:bg-blue-50/70 hover:border-blue-200 transition-colors truncate"
                      title="Send Email"
                    >
                      <Mail className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                      <span className="truncate font-medium">{selectedEnquiry.email}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Scope & Requirement Full Card */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-[#2563EB]" />
                    Project Scope & Requirements
                  </span>
                  {selectedEnquiry.expectedTimeline && (
                    <span className="text-[11px] font-semibold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                      ⏱️ {selectedEnquiry.expectedTimeline}
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#0F172A] leading-relaxed font-medium bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] space-y-1.5">
                  {selectedEnquiry.requirement && (
                    <div className="font-bold text-[#0F172A]">
                      🎯 {selectedEnquiry.requirement}
                    </div>
                  )}
                  {selectedEnquiry.description && (
                    <div className="text-[#475569] whitespace-pre-wrap">
                      {selectedEnquiry.description}
                    </div>
                  )}
                </div>
                {selectedEnquiry.services && selectedEnquiry.services.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedEnquiry.services.map((srv, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 text-[10px] font-semibold bg-blue-50 text-[#2563EB] rounded-md border border-blue-200"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes & Activity Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4 text-[#2563EB]" />
                    Lead Notes & Updates ({selectedEnquiry.notes?.length || 0})
                  </h3>
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    rows={2}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder={`Add update or note as ${currentUser?.fullName || "Admin"}...`}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-xs text-[#0F172A] placeholder-[#64748B] focus:bg-white focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newNoteText.trim()}
                      className="flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Add Note</span>
                    </button>
                  </div>
                </form>

                {/* Notes Stream */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(!selectedEnquiry.notes || selectedEnquiry.notes.length === 0) ? (
                    <div className="p-3 text-center text-xs text-[#64748B] bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                      No internal notes logged yet. Add the first note above.
                    </div>
                  ) : (
                    selectedEnquiry.notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 rounded-lg border border-[#E2E8F0] bg-white space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between text-[#64748B]">
                          <span className="font-bold text-[#0F172A]">{note.author}</span>
                          <span className="text-[10px]">{note.timestamp}</span>
                        </div>
                        <p className="text-[#0F172A] leading-relaxed">{note.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Activity Feed */}
                <div className="pt-3 border-t border-[#E2E8F0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-[#64748B] flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-[#2563EB]" />
                      Recent Activity History ({selectedEnquiry.activities?.length || 0})
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">Created: {selectedEnquiry.createdDate}</span>
                  </div>
                  <div className="space-y-1.5 text-xs max-h-40 overflow-y-auto pr-1">
                    {(!selectedEnquiry.activities || selectedEnquiry.activities.length === 0) ? (
                      <div className="text-[11px] text-[#94A3B8] italic p-2 bg-[#F8FAFC] rounded-lg">
                        No activity recorded yet.
                      </div>
                    ) : (
                      selectedEnquiry.activities.map((act) => (
                        <div key={act.id} className="flex items-start gap-2.5 p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                          <Clock className="h-3.5 w-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-[#0F172A]">{act.text}</span>
                              <span className="text-[10px] font-medium text-[#64748B]">{act.author || "Admin"}</span>
                            </div>
                            <span className="text-[10px] block text-[#94A3B8] mt-0.5">{act.timestamp}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Drawer Actions — Full Pipeline */}
            <div className="pt-4 border-t border-[#E2E8F0] space-y-3 mt-4">
              {/* Pipeline label */}
              <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest text-center">
                Move Lead Through Pipeline
              </div>

              {/* Pipeline stepper visual */}
              <div className="flex items-center justify-between gap-1 px-1">
                <div className="flex flex-col items-center gap-1">
                  <div className="h-6 w-6 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-amber-700">1</span>
                  </div>
                  <span className="text-[9px] text-amber-700 font-semibold">Follow-up</span>
                </div>
                <ArrowRight className="h-3 w-3 text-[#CBD5E1] shrink-0" />
                <div className="flex flex-col items-center gap-1">
                  <div className="h-6 w-6 rounded-full bg-blue-100 border-2 border-blue-400 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-blue-700">2</span>
                  </div>
                  <span className="text-[9px] text-blue-700 font-semibold">Client</span>
                </div>
                <ArrowRight className="h-3 w-3 text-[#CBD5E1] shrink-0" />
                <div className="flex flex-col items-center gap-1">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-emerald-700">3</span>
                  </div>
                  <span className="text-[9px] text-emerald-700 font-semibold">Project</span>
                </div>
              </div>

              {/* Action Button: Single Linear Progression (Move to Follow-Up) */}
              <button
                type="button"
                onClick={() => {
                  setSelectedEnquiryId(null);
                  handleOpenFollowUpModal(selectedEnquiry);
                }}
                disabled={selectedEnquiry.isLocked}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                <CalendarCheck className="h-4 w-4" />
                <span>
                  {selectedEnquiry.isLocked
                    ? `🔒 Lead Moved to ${selectedEnquiry.stageStatus || "Follow-up"} Stage`
                    : "Schedule Follow-Up Stage"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedEnquiryId(null)}
                className="w-full rounded-xl border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Schedule Follow-up ─────────────────────────────────── */}
      {followUpEnquiry && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[#E2E8F0] px-5 py-4 bg-gradient-to-r from-amber-50 to-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm text-[#0F172A]">Schedule Follow-up</h3>
                <p className="text-[11px] text-[#64748B] truncate">for {followUpEnquiry.clientName} · {followUpEnquiry.company}</p>
              </div>
              <button onClick={() => setFollowUpEnquiry(null)} className="p-1.5 rounded-lg text-[#64748B] hover:bg-slate-100 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Pipeline step indicator */}
            <div className="flex items-center gap-1 px-5 py-2 bg-amber-50/60 text-[10px] text-amber-700 font-semibold">
              <span className="h-4 w-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] font-bold">1</span>
              <span>Step 1 of 3 — Enquiry → Follow-up</span>
            </div>
            <form onSubmit={handleScheduleFollowUp} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Contact Type</label>
                  <select value={fuType} onChange={(e) => setFuType(e.target.value as typeof fuType)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-amber-400">
                    {["Phone Call","WhatsApp","Email","Video Call","Site Visit","In-Person"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Assigned To</label>
                  <select value={fuAssignedTo} onChange={(e) => setFuAssignedTo(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-amber-400">
                    {users.map(u => <option key={u.id} value={u.fullName}>{u.fullName}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Date <span className="text-red-500">*</span></label>
                  <input type="date" required value={fuDate} onChange={(e) => setFuDate(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-amber-400" />
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Time</label>
                  <input type="text" value={fuTime} onChange={(e) => setFuTime(e.target.value)} placeholder="11:00 AM"
                    className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-amber-400" />
                </div>
              </div>
              <div>
                <label className="font-semibold text-[#0F172A] block mb-1">Purpose / Agenda</label>
                <textarea rows={2} value={fuPurpose} onChange={(e) => setFuPurpose(e.target.value)}
                  placeholder="e.g. Discuss project scope and pricing..."
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-amber-400 resize-none" />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setFollowUpEnquiry(null)}
                  className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-white hover:bg-amber-600 shadow-sm transition-colors">
                  <CalendarCheck className="h-3.5 w-3.5" />
                  Schedule & Move to Follow-ups
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Convert to Client ─────────────────────────────────────── */}
      {clientEnquiry && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[#E2E8F0] px-5 py-4 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <UserCheck className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm text-[#0F172A]">Convert to Client</h3>
                <p className="text-[11px] text-[#64748B] truncate">{clientEnquiry.clientName} · {clientEnquiry.company}</p>
              </div>
              <button onClick={() => setClientEnquiry(null)} className="p-1.5 rounded-lg text-[#64748B] hover:bg-slate-100 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Pipeline step indicator */}
            <div className="flex items-center gap-1 px-5 py-2 bg-blue-50/60 text-[10px] text-blue-700 font-semibold">
              <span className="h-4 w-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">2</span>
              <span>Step 2 of 3 — Follow-up → Client</span>
            </div>
            <form onSubmit={handleConvertToClient} className="p-5 space-y-4 text-xs">
              {/* Auto-filled summary */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 space-y-1">
                <div className="text-[11px] font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-blue-600" />
                  Auto-filled from Enquiry
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-[#64748B]">
                  <span><b>Contact:</b> {clientEnquiry.clientName}</span>
                  <span><b>Company:</b> {clientEnquiry.company}</span>
                  <span><b>Phone:</b> {clientEnquiry.phone}</span>
                  <span><b>Budget:</b> ₹{clientEnquiry.estimatedBudget?.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Service Category</label>
                  <select value={cliCategory} onChange={(e) => setCliCategory(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-blue-400">
                    {["Software Development","Mobile App","E-Commerce","UI/UX Design","Digital Marketing","IT Consulting","Startup","Enterprise"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Assigned Manager</label>
                  <select value={cliManager} onChange={(e) => setCliManager(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-blue-400">
                    {users.map(u => <option key={u.id} value={u.fullName}>{u.fullName}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold text-[#0F172A] block mb-1">Address / Location</label>
                <input type="text" value={cliAddress} onChange={(e) => setCliAddress(e.target.value)}
                  placeholder="e.g. Chennai, Tamil Nadu"
                  className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-blue-400" />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setClientEnquiry(null)}
                  className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition-colors">
                  <UserCheck className="h-3.5 w-3.5" />
                  Create Client Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Enquiry Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-2xl rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4 bg-gradient-to-r from-blue-50/60 via-slate-50/40 to-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-sm">
                  {editingEnquiry ? <Edit2 className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0F172A]">
                    {editingEnquiry ? "Edit Lead / Enquiry Details" : "Create New Lead / Enquiry"}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {editingEnquiry
                      ? "Update client information, commercial budget, and assignment."
                      : "Add prospective client details, scope, budget and team assignment."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingEnquiry(null);
                }}
                className="rounded-lg p-1.5 text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreate} className="p-6 space-y-5 text-xs flex-1 overflow-y-auto custom-scrollbar">
              {/* Section 1: Client & Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-[#F1F5F9]">
                  <Building2 className="h-4 w-4 text-[#2563EB]" />
                  <span className="font-bold text-xs text-[#0F172A] uppercase tracking-wider">
                    Client & Contact Information
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">
                      Client Contact Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:bg-white focus:border-[#2563EB] focus:outline-hidden font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">Company / Brand Name</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Apex Matrimony Pvt Ltd"
                      className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:bg-white focus:border-[#2563EB] focus:outline-hidden font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">Phone / Mobile</label>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#94A3B8]" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (!whatsapp || whatsapp === phone) setWhatsapp(e.target.value);
                        }}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-8 pr-3 py-2 text-xs text-[#0F172A] focus:bg-white focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">WhatsApp Number</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#16A34A]" />
                      <input
                        type="text"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-8 pr-3 py-2 text-xs text-[#0F172A] focus:bg-white focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#94A3B8]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="client@domain.com"
                        className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-8 pr-3 py-2 text-xs text-[#0F172A] focus:bg-white focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">Location / City</label>
                    <div className="relative">
                      <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#94A3B8]" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Chennai, Tamil Nadu"
                        className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-8 pr-3 py-2 text-xs text-[#0F172A] focus:bg-white focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Requirements & Commercials */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-[#F1F5F9]">
                  <Briefcase className="h-4 w-4 text-[#2563EB]" />
                  <span className="font-bold text-xs text-[#0F172A] uppercase tracking-wider">
                    Project Scope & Commercials
                  </span>
                </div>

                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">
                    Requirement Summary <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    placeholder="e.g. Need to call regarding taxi & travel booking app"
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:bg-white focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">Project Type</label>
                    <input
                      type="text"
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      placeholder="e.g. Website + Mobile App"
                      className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:bg-white focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium transition-all"
                    />
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {["Website", "Mobile App", "UI/UX Design", "Custom ERP", "E-Commerce"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setProjectType(type)}
                          className={clsx(
                            "px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors cursor-pointer",
                            projectType === type
                              ? "bg-blue-50 text-[#2563EB] border-blue-200"
                              : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC]"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">Estimated Budget (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#94A3B8]" />
                      <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="0"
                        className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-8 pr-3 py-2 text-xs text-[#0F172A] focus:bg-white focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 font-bold transition-all"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {[
                        { label: "₹0", val: "0" },
                        { label: "₹50k", val: "50000" },
                        { label: "₹1.5L", val: "150000" },
                        { label: "₹3L", val: "300000" },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setBudget(item.val)}
                          className={clsx(
                            "px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors cursor-pointer",
                            budget === item.val
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC]"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">Lead Source</label>
                    <div className="relative">
                      <select
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-3 pr-8 py-2 text-xs text-[#0F172A] focus:bg-white focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium cursor-pointer shadow-xs transition-all"
                      >
                        <option value="Instagram">Instagram (Social Ad / DM)</option>
                        <option value="Referral">Client Referral / Network</option>
                        <option value="Website">Official Website Lead Form</option>
                        <option value="LinkedIn">LinkedIn Outreach</option>
                        <option value="Direct Call">Direct Phone Call / Walk-in</option>
                        <option value="Upwork">Upwork / Freelance Platform</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">Expected Timeline</label>
                    <input
                      type="text"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      placeholder="e.g. 4 Weeks"
                      className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:bg-white focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Assignment & Pipeline Stage */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-[#F1F5F9]">
                  <UserCheck className="h-4 w-4 text-[#2563EB]" />
                  <span className="font-bold text-xs text-[#0F172A] uppercase tracking-wider">
                    Assignment & Pipeline Status
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">Assigned Team Member</label>
                    <div className="relative">
                      <select
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-3 pr-8 py-2 text-xs text-[#0F172A] focus:bg-white focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium cursor-pointer shadow-xs transition-all"
                      >
                        {users.length > 0 ? (
                          users.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.fullName} ({u.role})
                            </option>
                          ))
                        ) : (
                          <option value="usr-001">Tamil Selvan (Admin)</option>
                        )}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">Lead Priority</label>
                    <div className="relative">
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as EnquiryPriority)}
                        className="w-full appearance-none rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-3 pr-8 py-2 text-xs text-[#0F172A] focus:bg-white focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium cursor-pointer shadow-xs transition-all"
                      >
                        <option value="Low">Low Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High Priority</option>
                        <option value="Urgent">Urgent / Hot Lead</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">Initial Status</label>
                    <div className="relative">
                      <select
                        value={initialStatus}
                        onChange={(e) => setInitialStatus(e.target.value as EnquiryStatus)}
                        className="w-full appearance-none rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-3 pr-8 py-2 text-xs text-[#0F172A] focus:bg-white focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium cursor-pointer shadow-xs transition-all"
                      >
                        <option value="New">New Lead</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Proposal">Proposal</option>
                        <option value="Negotiation">Negotiation</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">
                    Client Requirements / Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter any specific customer remarks, services details, or initial discussion points..."
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:bg-white focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium transition-all"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between gap-3 border-t border-[#E2E8F0] pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingEnquiry(null);
                  }}
                  className="rounded-xl border border-[#E2E8F0] px-4 py-2 font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2 font-semibold text-white hover:bg-blue-700 shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    {editingEnquiry ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Save Lead Changes</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Create & Track Enquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Lead / Enquiry"
        message={`Are you sure you want to permanently delete enquiry for "${deleteTarget?.clientName}" (${deleteTarget?.company})? This action cannot be undone.`}
        confirmLabel="Delete Lead"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
