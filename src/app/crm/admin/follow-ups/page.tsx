"use client";

import { useState } from "react";
import {
  CalendarCheck,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Phone,
  Search,
  Edit2,
  Trash2,
  Check,
  UserPlus,
  ArrowRight,
  ChevronDown,
  X,
} from "lucide-react";
import { clsx } from "clsx";
import { useAppStore } from "@/store/useAppStore";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FollowUpItem } from "@/types";

const FOLLOWUP_STATUS_CONFIG: Record<
  FollowUpItem["status"],
  {
    label: string;
    dot: string;
    bg: string;
    text: string;
    border: string;
    hoverBg: string;
  }
> = {
  Scheduled: {
    label: "Scheduled",
    dot: "bg-blue-500 ring-2 ring-blue-200",
    bg: "bg-blue-50/90",
    text: "text-blue-700",
    border: "border-blue-200",
    hoverBg: "hover:bg-blue-100/80 hover:border-blue-300",
  },
  Interested: {
    label: "Interested",
    dot: "bg-emerald-500 ring-2 ring-emerald-200",
    bg: "bg-emerald-50/90",
    text: "text-emerald-700",
    border: "border-emerald-200",
    hoverBg: "hover:bg-emerald-100/80 hover:border-emerald-300",
  },
  Ghosting: {
    label: "Ghosting (No Reply)",
    dot: "bg-purple-500 ring-2 ring-purple-200",
    bg: "bg-purple-50/90",
    text: "text-purple-700",
    border: "border-purple-200",
    hoverBg: "hover:bg-purple-100/80 hover:border-purple-300",
  },
  Lost: {
    label: "Deal Lost",
    dot: "bg-red-500 ring-2 ring-red-200",
    bg: "bg-red-50/90",
    text: "text-red-700",
    border: "border-red-200",
    hoverBg: "hover:bg-red-100/80 hover:border-red-300",
  },
  Completed: {
    label: "Completed",
    dot: "bg-emerald-600 ring-2 ring-emerald-300",
    bg: "bg-emerald-100/90",
    text: "text-emerald-800",
    border: "border-emerald-300",
    hoverBg: "hover:bg-emerald-200/80 hover:border-emerald-400",
  },
  Overdue: {
    label: "Overdue",
    dot: "bg-rose-500 ring-2 ring-rose-200",
    bg: "bg-rose-50/90",
    text: "text-rose-700",
    border: "border-rose-200",
    hoverBg: "hover:bg-rose-100/80 hover:border-rose-300",
  },
  Rescheduled: {
    label: "Rescheduled",
    dot: "bg-amber-500 ring-2 ring-amber-200",
    bg: "bg-amber-50/90",
    text: "text-amber-700",
    border: "border-amber-200",
    hoverBg: "hover:bg-amber-100/80 hover:border-amber-300",
  },
};

interface FollowUpStatusDropdownProps {
  currentStatus: FollowUpItem["status"];
  onStatusChange: (status: FollowUpItem["status"]) => void;
  isOpen: boolean;
  onToggle: (e: React.MouseEvent) => void;
  onClose: () => void;
  isDisabled?: boolean;
}

function FollowUpStatusDropdown({
  currentStatus,
  onStatusChange,
  isOpen,
  onToggle,
  onClose,
  isDisabled = false,
}: FollowUpStatusDropdownProps) {
  const current = FOLLOWUP_STATUS_CONFIG[currentStatus] || FOLLOWUP_STATUS_CONFIG.Scheduled;
  const statuses: FollowUpItem["status"][] = [
    "Scheduled",
    "Interested",
    "Ghosting",
    "Lost",
    "Rescheduled",
    "Completed",
    "Overdue",
  ];

  return (
    <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        disabled={isDisabled}
        onClick={onToggle}
        className={clsx(
          "group inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all duration-150 shadow-2xs cursor-pointer select-none disabled:opacity-70 disabled:cursor-not-allowed",
          current.bg,
          current.text,
          current.border,
          current.hoverBg,
          isOpen ? "ring-2 ring-blue-500/25 shadow-xs scale-[1.02]" : ""
        )}
      >
        <span className={clsx("h-1.5 w-1.5 rounded-full shrink-0 transition-transform group-hover:scale-110", current.dot)} />
        <span className="leading-tight">{current.label}</span>
        {!isDisabled && (
          <ChevronDown
            className={clsx(
              "h-3 w-3 opacity-70 transition-transform duration-200 shrink-0",
              isOpen ? "rotate-180 opacity-100" : "group-hover:opacity-100"
            )}
          />
        )}
      </button>

      {isOpen && !isDisabled && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <div className="absolute left-0 top-full mt-1.5 z-50 w-48 origin-top-left rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-xl shadow-slate-900/10 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Update Follow-Up Status
            </div>
            <div className="space-y-0.5 mt-0.5">
              {statuses.map((st) => {
                const cfg = FOLLOWUP_STATUS_CONFIG[st];
                const isSelected = st === currentStatus;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      onStatusChange(st);
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
                      <span>{cfg.label}</span>
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

export default function FollowUpsPage() {
  const { followUps, addFollowUp, updateFollowUp, deleteFollowUp, convertFollowUpToClient, enquiries, users } = useAppStore();
  const [filterTab, setFilterTab] = useState<"Today" | "Upcoming" | "Overdue" | "Completed" | "All" | "All History">("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<FollowUpItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeDropdownFollowUpId, setActiveDropdownFollowUpId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  // Move to Client State
  const [moveToClientFollowUp, setMoveToClientFollowUp] = useState<FollowUpItem | null>(null);
  const [newClientCompany, setNewClientCompany] = useState("");
  const [newClientContact, setNewClientContact] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientCategory, setNewClientCategory] = useState("Software Development");

  // Add Form State
  const [leadName, setLeadName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [type, setType] = useState<FollowUpItem["type"]>("Phone Call");
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split("T")[0]);
  const [scheduledTime, setScheduledTime] = useState("11:00 AM");
  const [assignedTo, setAssignedTo] = useState(users[0]?.fullName || "Unassigned");
  const [purpose, setPurpose] = useState("");

  // Edit Form State
  const [editLeadName, setEditLeadName] = useState("");
  const [editBusinessName, setEditBusinessName] = useState("");
  const [editContactNumber, setEditContactNumber] = useState("");
  const [editType, setEditType] = useState<FollowUpItem["type"]>("Phone Call");
  const [editScheduledDate, setEditScheduledDate] = useState("");
  const [editScheduledTime, setEditScheduledTime] = useState("");
  const [editAssignedTo, setEditAssignedTo] = useState("");
  const [editPurpose, setEditPurpose] = useState("");
  const [editStatus, setEditStatus] = useState<FollowUpItem["status"]>("Scheduled");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleOpenAddModal = () => {
    setLeadName("");
    setBusinessName("");
    setContactNumber("");
    setType("Phone Call");
    setScheduledDate(new Date().toISOString().split("T")[0]);
    setScheduledTime("11:00 AM");
    setAssignedTo(users[0]?.fullName || "Unassigned");
    setPurpose("");
    setIsAddModalOpen(true);
  };

  const handleScheduleFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !scheduledDate) return;

    addFollowUp({
      leadName: leadName.trim(),
      businessName: businessName.trim() || "Direct Client",
      contactNumber: contactNumber.trim() || "+91 98765 00000",
      type,
      scheduledDate,
      scheduledTime,
      assignedTo: assignedTo || users[0]?.fullName || "Admin",
      purpose: purpose.trim() || "Requirement & Proposal discussion",
      status: "Scheduled",
    });

    setIsAddModalOpen(false);
    showToast(`Follow-up scheduled with ${leadName}.`);
  };

  const handleOpenEditModal = (item: FollowUpItem) => {
    if (item.isLocked) {
      showToast("🔒 Follow-up is locked (already converted to Client).");
      return;
    }
    setEditingFollowUp(item);
    setEditLeadName(item.leadName);
    setEditBusinessName(item.businessName);
    setEditContactNumber(item.contactNumber);
    setEditType(item.type);
    setEditScheduledDate(item.scheduledDate);
    setEditScheduledTime(item.scheduledTime);
    setEditAssignedTo(item.assignedTo);
    setEditPurpose(item.purpose);
    setEditStatus(item.status);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFollowUp || !editLeadName.trim()) return;

    updateFollowUp(editingFollowUp.id, {
      leadName: editLeadName.trim(),
      businessName: editBusinessName.trim(),
      contactNumber: editContactNumber.trim(),
      type: editType,
      scheduledDate: editScheduledDate,
      scheduledTime: editScheduledTime,
      assignedTo: editAssignedTo,
      purpose: editPurpose.trim(),
      status: editStatus,
    });

    showToast(`Follow-up with ${editLeadName} updated.`);
    setEditingFollowUp(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingId) return;
    deleteFollowUp(deletingId);
    showToast("Follow-up deleted successfully.");
    setDeletingId(null);
  };

  const handleMarkDone = (id: string, name: string) => {
    updateFollowUp(id, { status: "Completed" });
    showToast(`Marked follow-up with ${name} as completed.`);
  };

  const handleOpenMoveToClientModal = (item: FollowUpItem) => {
    if (item.isLocked) {
      showToast("🔒 Follow-up already converted to Client.");
      return;
    }

    const matchingEnquiry = enquiries.find(
      (e) => e.id === item.leadId || e.clientName.toLowerCase() === item.leadName.toLowerCase()
    );

    const autoEmail =
      matchingEnquiry?.email ||
      `${item.leadName.trim().toLowerCase().replace(/[^a-z0-9]/g, ".")}@gmail.com`;

    setMoveToClientFollowUp(item);
    setNewClientCompany(item.businessName || matchingEnquiry?.company || item.leadName);
    setNewClientContact(item.leadName || matchingEnquiry?.clientName || "Client Contact");
    setNewClientEmail(autoEmail);
    setNewClientPhone(item.contactNumber || matchingEnquiry?.phone || "+91 98765 00000");
    setNewClientCategory(matchingEnquiry?.projectType || "Software Development");
  };

  const handleMoveToClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moveToClientFollowUp) return;

    convertFollowUpToClient(moveToClientFollowUp.id, {
      companyName: newClientCompany.trim() || moveToClientFollowUp.businessName,
      primaryContact: newClientContact.trim() || moveToClientFollowUp.leadName,
      email: newClientEmail.trim() || `${moveToClientFollowUp.leadName.toLowerCase().replace(/[^a-z0-9]/g, ".")}@gmail.com`,
      phone: newClientPhone.trim() || moveToClientFollowUp.contactNumber,
      category: newClientCategory,
    });

    setMoveToClientFollowUp(null);
    showToast(`🎉 Converted ${newClientContact || moveToClientFollowUp.leadName} to Client profile!`);
  };

  const todayStr = new Date().toISOString().split("T")[0];

  const filteredFollowUps = followUps.filter((f) => {
    // Hide converted follow-ups from active view once advanced to Client stage (remains safely stored in DB)
    const isConverted = f.isLocked || f.stageStatus === "Client" || f.stageStatus === "Project" || !!f.convertedClientId;
    if (isConverted && filterTab !== "All History") return false;

    if (filterTab === "All") return true;
    if (filterTab === "Today") return f.scheduledDate === todayStr;
    if (filterTab === "Upcoming") return f.scheduledDate > todayStr && f.status !== "Completed";
    if (filterTab === "Overdue") return (f.scheduledDate < todayStr && f.status !== "Completed") || f.status === "Overdue";
    if (filterTab === "Completed") return f.status === "Completed";
    return true;
  });

  const columns: ColumnDef<FollowUpItem>[] = [
    {
      id: "leadName",
      header: "Lead / Client",
      accessorKey: "leadName",
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-bold text-[#0F172A] hover:text-[#2563EB] cursor-pointer">
            {row.leadName}
          </div>
          <div className="text-[11px] text-[#64748B]">{row.businessName}</div>
        </div>
      ),
    },
    {
      id: "type",
      header: "Follow-up Type",
      accessorKey: "type",
      sortable: true,
      cell: (row) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <Phone className="h-3 w-3 text-[#2563EB]" />
          {row.type}
        </span>
      ),
    },
    {
      id: "schedule",
      header: "Schedule",
      accessorKey: "scheduledDate",
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-semibold text-[#0F172A]">{row.scheduledDate}</div>
          <div className="text-[11px] text-[#64748B]">{row.scheduledTime}</div>
        </div>
      ),
    },
    {
      id: "assignedTo",
      header: "Assigned To",
      accessorKey: "assignedTo",
      sortable: true,
    },
    {
      id: "purpose",
      header: "Purpose / Note",
      accessorKey: "purpose",
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (row) => (
        <FollowUpStatusDropdown
          currentStatus={row.status}
          onStatusChange={(newStatus) => {
            updateFollowUp(row.id, { status: newStatus });
            showToast(`Status updated to "${newStatus}"`);
          }}
          isOpen={activeDropdownFollowUpId === row.id}
          onToggle={(e) => {
            e.stopPropagation();
            if (!row.isLocked) {
              setActiveDropdownFollowUpId(activeDropdownFollowUpId === row.id ? null : row.id);
            }
          }}
          onClose={() => setActiveDropdownFollowUpId(null)}
          isDisabled={row.isLocked}
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      align: "right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          {row.isLocked ? (
            <span className="px-2 py-1 text-xs font-bold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              🔒 Client Converted
            </span>
          ) : (
            <>
              {row.status !== "Completed" && (
                <button
                  onClick={() => handleMarkDone(row.id, row.leadName)}
                  title="Mark as Completed"
                  className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-[#16A34A] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Done</span>
                </button>
              )}
              <button
                onClick={() => handleOpenMoveToClientModal(row)}
                title="Move to Client"
                className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>To Client</span>
              </button>
              <button
                onClick={() => handleOpenEditModal(row)}
                title="Edit Follow-up"
                className="p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeletingId(row.id)}
                title="Delete Follow-up"
                className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const todayCount = followUps.filter((f) => f.scheduledDate === todayStr).length;
  const overdueCount = followUps.filter((f) => (f.scheduledDate < todayStr && f.status !== "Completed") || f.status === "Overdue").length;
  const upcomingCount = followUps.filter((f) => f.scheduledDate > todayStr && f.status !== "Completed").length;
  const completedCount = followUps.filter((f) => f.status === "Completed").length;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Follow-ups Management</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Track client calls, meeting schedules, demos, and pipeline communications.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule Follow-up</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          title="Today's Calls"
          value={todayCount}
          subtext="Action items for today"
          icon={CalendarCheck}
          variant="blue"
        />
        <MetricCard
          title="Upcoming"
          value={upcomingCount}
          subtext="Pipeline pipeline reminders"
          icon={Calendar}
          variant="indigo"
        />
        <MetricCard
          title="Overdue"
          value={overdueCount}
          subtext="Immediate attention needed"
          icon={AlertCircle}
          variant="rose"
        />
        <MetricCard
          title="Completed"
          value={completedCount}
          subtext="Total executed calls"
          icon={CheckCircle2}
          variant="emerald"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#E2E8F0] pb-3">
        {(["All", "Today", "Upcoming", "Overdue", "Completed", "All History"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterTab === tab
                ? "bg-[#2563EB] text-white shadow-2xs"
                : "text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A]"
            }`}
          >
            {tab === "All" ? "Active Follow-ups" : tab === "All History" ? "🔒 All History (Inc. Converted)" : tab}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredFollowUps}
        columns={columns}
        searchPlaceholder="Search lead name, company, or purpose..."
        emptyTitle="No follow-ups found"
        emptyDescription="There are no follow-ups matching this filter. Schedule your first follow-up to keep in touch with leads."
      />

      {/* Add Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Schedule New Follow-up"
          subtitle="Set a reminder for a lead or client discussion."
          footer={
            <>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleScheduleFollowUp}
                className="rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
              >
                Schedule Follow-up
              </button>
            </>
          }
        >
          <form onSubmit={handleScheduleFollowUp} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Lead / Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="e.g. Suresh Kumar"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Company / Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. TechCorp Solutions"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Phone Number</label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+91 98765 00000"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Follow-up Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as FollowUpItem["type"])}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden"
                >
                  <option value="Phone Call">Phone Call</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Email">Email</option>
                  <option value="Demo">Demo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Scheduled Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Scheduled Time</label>
                <input
                  type="text"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  placeholder="e.g. 11:30 AM"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">Assigned Executive</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.fullName}>
                    {u.fullName} ({u.role})
                  </option>
                ))}
                {users.length === 0 && <option value="Tamil Selvan R">Tamil Selvan R</option>}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">Purpose / Notes</label>
              <textarea
                rows={2}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Key points to discuss or agenda..."
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {editingFollowUp && (
        <Modal
          isOpen={!!editingFollowUp}
          onClose={() => setEditingFollowUp(null)}
          title={`Edit Follow-up: ${editingFollowUp.leadName}`}
          subtitle="Update scheduled date, time, or assigned team member."
          footer={
            <>
              <button
                type="button"
                onClick={() => setEditingFollowUp(null)}
                className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </>
          }
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Lead / Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editLeadName}
                  onChange={(e) => setEditLeadName(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Company / Business Name</label>
                <input
                  type="text"
                  value={editBusinessName}
                  onChange={(e) => setEditBusinessName(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editContactNumber}
                  onChange={(e) => setEditContactNumber(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Follow-up Type</label>
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value as FollowUpItem["type"])}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden"
                >
                  <option value="Phone Call">Phone Call</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Email">Email</option>
                  <option value="Demo">Demo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Scheduled Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={editScheduledDate}
                  onChange={(e) => setEditScheduledDate(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Scheduled Time</label>
                <input
                  type="text"
                  value={editScheduledTime}
                  onChange={(e) => setEditScheduledTime(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as FollowUpItem["status"])}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Rescheduled">Rescheduled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Assigned Executive</label>
                <select
                  value={editAssignedTo}
                  onChange={(e) => setEditAssignedTo(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.fullName}>
                      {u.fullName} ({u.role})
                    </option>
                  ))}
                  {users.length === 0 && <option value="Tamil Selvan R">Tamil Selvan R</option>}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">Purpose / Notes</label>
              <textarea
                rows={2}
                value={editPurpose}
                onChange={(e) => setEditPurpose(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingId && (
        <ConfirmDialog
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Follow-up?"
          message="Are you sure you want to remove this follow-up reminder?"
          confirmLabel="Delete Follow-up"
          variant="danger"
        />
      )}

      {/* ── MODAL: Move to Client ────────────────────────────────────────── */}
      {moveToClientFollowUp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[#E2E8F0] px-5 py-4 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <UserPlus className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm text-[#0F172A]">Convert to Client</h3>
                <p className="text-[11px] text-[#64748B] truncate">Move {moveToClientFollowUp.leadName} to Client Roster</p>
              </div>
              <button onClick={() => setMoveToClientFollowUp(null)} className="p-1.5 rounded-lg text-[#64748B] hover:bg-slate-100 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Pipeline Indicator */}
            <div className="flex items-center gap-1 px-5 py-2 bg-blue-50/60 text-[10px] text-blue-700 font-semibold">
              <span className="h-4 w-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">2</span>
              <span>Step 2 of 3 — Follow-up → Client</span>
            </div>

            <form onSubmit={handleMoveToClient} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Company / Brand *</label>
                  <input type="text" required value={newClientCompany} onChange={(e) => setNewClientCompany(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#0F172A] focus:outline-hidden focus:border-blue-400" />
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Primary Contact *</label>
                  <input type="text" required value={newClientContact} onChange={(e) => setNewClientContact(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#0F172A] focus:outline-hidden focus:border-blue-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Phone Number</label>
                  <input type="text" value={newClientPhone} onChange={(e) => setNewClientPhone(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-blue-400" />
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Email Address</label>
                  <input type="email" value={newClientEmail} onChange={(e) => setNewClientEmail(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-blue-400" />
                </div>
              </div>
              <div>
                <label className="font-semibold text-[#0F172A] block mb-1">Client Category</label>
                <select value={newClientCategory} onChange={(e) => setNewClientCategory(e.target.value)}
                  className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-blue-400">
                  <option>Software Development</option>
                  <option>Digital Marketing</option>
                  <option>IT Consulting</option>
                  <option>Retainer</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="text-[10px] text-[#64748B] flex items-center gap-1">
                  <ArrowRight className="h-3 w-3 text-blue-600" />
                  Follow-up will be marked Completed
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setMoveToClientFollowUp(null)}
                    className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors">Cancel</button>
                  <button type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition-colors cursor-pointer">
                    <UserPlus className="h-3.5 w-3.5" />
                    Move to Client
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
