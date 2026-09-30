"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Plus,
  Users,
  FolderKanban,
  IndianRupee,
  Mail,
  Phone,
  Edit2,
  Trash2,
  MapPin,
  CheckCircle2,
  FolderPlus,
  ArrowRight,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ClientRecord } from "@/types";

export default function ClientsPage() {
  const router = useRouter();
  const { clients, addClient, updateClient, deleteClient, convertClientToProject, users } = useAppStore();

  const [projectClient, setProjectClient] = useState<ClientRecord | null>(null);
  const [prjName, setPrjName] = useState("");
  const [prjBudget, setPrjBudget] = useState("150000");
  const [prjDeadline, setPrjDeadline] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]);
  const [prjPriority, setPrjPriority] = useState<"Low" | "Medium" | "High">("High");
  const [prjDescription, setPrjDescription] = useState("");

  const handleOpenProjectModal = (c: ClientRecord) => {
    if (c.linkedProjectId) {
      showToast(`🔒 Client already converted to project: ${c.linkedProjectName || "PRJ"}`);
      return;
    }
    setProjectClient(c);
    setPrjName(`${c.companyName} Web App & System`);
    setPrjBudget((c.totalBilled || 150000).toString());
    setPrjDeadline(new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]);
    setPrjPriority("High");
    setPrjDescription(`Official project kick-off for ${c.companyName}. Primary contact: ${c.primaryContact}`);
  };

  const handleCreateProjectFromClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectClient || !prjName.trim()) return;

    convertClientToProject(projectClient.id, {
      projectName: prjName.trim(),
      budget: parseFloat(prjBudget) || projectClient.totalBilled || 0,
      deadline: prjDeadline,
      priority: prjPriority,
      description: prjDescription.trim(),
    });

    setProjectClient(null);
    showToast(`🎉 Project "${prjName}" created & linked to ${projectClient.companyName}!`);
    setTimeout(() => router.push("/crm/admin/projects"), 1200);
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientRecord | null>(null);
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  // Add Form State
  const [companyName, setCompanyName] = useState("");
  const [primaryContact, setPrimaryContact] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("Software Development");
  const [assignedManager, setAssignedManager] = useState(users[0]?.fullName || "Unassigned");

  // Edit Form State
  const [editCompanyName, setEditCompanyName] = useState("");
  const [editPrimaryContact, setEditPrimaryContact] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editAssignedManager, setEditAssignedManager] = useState("");
  const [editStatus, setEditStatus] = useState<"Active" | "Inactive">("Active");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleOpenAddModal = () => {
    setCompanyName("");
    setPrimaryContact("");
    setEmail("");
    setPhone("");
    setAddress("");
    setCategory("Software Development");
    setAssignedManager(users[0]?.fullName || "Unassigned");
    setIsAddModalOpen(true);
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !primaryContact.trim()) return;

    addClient({
      companyName: companyName.trim(),
      primaryContact: primaryContact.trim(),
      email: email.trim() || "contact@client.com",
      phone: phone.trim() || "+91 98765 00000",
      address: address.trim(),
      category,
      assignedManager: assignedManager || users[0]?.fullName || "Unassigned",
      totalProjects: 0,
      totalBilled: 0,
      totalCollected: 0,
      outstanding: 0,
      status: "Active",
    });

    setIsAddModalOpen(false);
    showToast(`Client "${companyName}" added successfully.`);
  };

  const handleOpenEditModal = (client: ClientRecord) => {
    setEditingClient(client);
    setEditCompanyName(client.companyName);
    setEditPrimaryContact(client.primaryContact);
    setEditEmail(client.email);
    setEditPhone(client.phone);
    setEditAddress(client.address || "");
    setEditCategory(client.category);
    setEditAssignedManager(client.assignedManager);
    setEditStatus(client.status);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient || !editCompanyName.trim()) return;

    updateClient(editingClient.id, {
      companyName: editCompanyName.trim(),
      primaryContact: editPrimaryContact.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      address: editAddress.trim(),
      category: editCategory,
      assignedManager: editAssignedManager,
      status: editStatus,
    });

    showToast(`Updated client "${editCompanyName}".`);
    setEditingClient(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingClientId) return;
    const target = clients.find((c) => c.id === deletingClientId);
    deleteClient(deletingClientId);
    showToast(`Deleted client "${target?.companyName || "Record"}".`);
    setDeletingClientId(null);
  };

  const columns: ColumnDef<ClientRecord>[] = [
    {
      id: "company",
      header: "Company & Contact",
      accessorKey: "companyName",
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-bold text-[#0F172A] hover:text-[#2563EB] cursor-pointer flex items-center gap-1.5">
            {row.companyName}
          </div>
          <div className="text-[11px] text-[#64748B] flex items-center gap-1">
            <span>{row.primaryContact}</span>
            <span>•</span>
            <span>{row.category}</span>
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      header: "Contact Details",
      cell: (row) => (
        <div className="space-y-0.5 text-xs text-[#64748B]">
          <div className="flex items-center gap-1.5">
            <Mail className="h-3 w-3 text-[#94A3B8]" />
            <span>{row.email}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="h-3 w-3 text-[#94A3B8]" />
            <span>{row.phone}</span>
          </div>
        </div>
      ),
    },
    {
      id: "manager",
      header: "Account Manager",
      accessorKey: "assignedManager",
      sortable: true,
    },
    {
      id: "projects",
      header: "Projects",
      accessorKey: "totalProjects",
      sortable: true,
      align: "center",
      cell: (row) => (
        <span className="font-bold text-xs text-[#0F172A] bg-slate-100 px-2 py-0.5 rounded-md">
          {row.totalProjects}
        </span>
      ),
    },
    {
      id: "financials",
      header: "Billed / Outstanding",
      align: "right",
      cell: (row) => (
        <div className="text-right">
          <div className="font-bold text-[#0F172A]">₹{row.totalBilled.toLocaleString("en-IN")}</div>
          <div className="text-[11px] font-semibold text-[#DC2626]">
            {row.outstanding > 0 ? `₹${row.outstanding.toLocaleString("en-IN")} due` : "Settled"}
          </div>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: "actions",
      header: "Actions",
      align: "right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          {row.linkedProjectId ? (
            <button
              onClick={() => router.push("/crm/admin/projects")}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
              title="View Linked Project"
            >
              <span>🔒 Active Project</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          ) : (
            <button
              onClick={() => handleOpenProjectModal(row)}
              title="Move to Project Section"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <FolderPlus className="h-3.5 w-3.5" />
              <span>Create Project</span>
            </button>
          )}
          <button
            onClick={() => handleOpenEditModal(row)}
            title="Edit Client"
            className="p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeletingClientId(row.id)}
            title="Delete Client"
            className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const totalBilled = clients.reduce((acc, c) => acc + c.totalBilled, 0);
  const totalOutstanding = clients.reduce((acc, c) => acc + c.outstanding, 0);
  const activeProjectsCount = clients.reduce((acc, c) => acc + c.totalProjects, 0);

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
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Client Directory</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Comprehensive 360° overview of client accounts, contracts, invoices, and projects.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          title="Total Clients"
          value={clients.length}
          subtext="Active business accounts"
          icon={Building2}
          variant="blue"
        />
        <MetricCard
          title="Active Projects"
          value={activeProjectsCount}
          subtext="Under delivery"
          icon={FolderKanban}
          variant="indigo"
        />
        <MetricCard
          title="Total Invoiced"
          value={`₹${totalBilled > 0 ? (totalBilled / 100000).toFixed(1) + "L" : "0"}`}
          subtext="Lifetime billed value"
          icon={IndianRupee}
          variant="emerald"
        />
        <MetricCard
          title="Outstanding Amount"
          value={`₹${totalOutstanding > 0 ? (totalOutstanding / 100000).toFixed(1) + "L" : "0"}`}
          subtext="Pending payment receivables"
          icon={IndianRupee}
          variant="rose"
        />
      </div>

      {/* Data Table */}
      <DataTable
        data={clients}
        columns={columns}
        searchPlaceholder="Search company, contact person, or category..."
        emptyTitle="No clients found"
        emptyDescription="There are no client records yet. Click '+ Add Client' to register your first client."
      />

      {/* Add Client Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Client"
          subtitle="Register an existing business client account or organization."
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
                onClick={handleAddClient}
                className="rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
              >
                Save Client
              </button>
            </>
          }
        >
          <form onSubmit={handleAddClient} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Global Solutions"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Primary Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={primaryContact}
                  onChange={(e) => setPrimaryContact(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rajesh@acmeglobal.in"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Industry / Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden"
                >
                  <option value="Software Development">Software Development</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Media & Branding">Media & Branding</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Enterprise">Enterprise</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Account Manager</label>
                <select
                  value={assignedManager}
                  onChange={(e) => setAssignedManager(e.target.value)}
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
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">Office / Billing Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 42 Tech Park, Outer Ring Road, Bangalore"
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Client Modal */}
      {editingClient && (
        <Modal
          isOpen={!!editingClient}
          onClose={() => setEditingClient(null)}
          title={`Edit Client: ${editingClient.companyName}`}
          subtitle="Update company details, assigned personnel, or account status."
          footer={
            <>
              <button
                type="button"
                onClick={() => setEditingClient(null)}
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
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editCompanyName}
                  onChange={(e) => setEditCompanyName(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Primary Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editPrimaryContact}
                  onChange={(e) => setEditPrimaryContact(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Industry / Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden"
                >
                  <option value="Software Development">Software Development</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Media & Branding">Media & Branding</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Enterprise">Enterprise</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Account Manager</label>
                <select
                  value={editAssignedManager}
                  onChange={(e) => setEditAssignedManager(e.target.value)}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Account Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as "Active" | "Inactive")}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Office Address</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="Address or location"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Kickoff Project Modal */}
      {projectClient && (
        <Modal
          isOpen={!!projectClient}
          onClose={() => setProjectClient(null)}
          title={`🚀 Create Project for ${projectClient.companyName}`}
          footer={
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setProjectClient(null)}
                className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="create-project-form"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm transition-colors cursor-pointer"
              >
                Launch Project Section
              </button>
            </div>
          }
        >
          <form id="create-project-form" onSubmit={handleCreateProjectFromClient} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-emerald-600" />
                <span>Client Account: {projectClient.companyName}</span>
              </div>
              <div className="text-[11px] text-emerald-700">
                Contact: {projectClient.primaryContact} ({projectClient.phone})
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">Project Name *</label>
              <input
                type="text"
                required
                value={prjName}
                onChange={(e) => setPrjName(e.target.value)}
                placeholder="e.g. Mobile App & Dashboard Redesign"
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Project Budget (₹)</label>
                <input
                  type="number"
                  value={prjBudget}
                  onChange={(e) => setPrjBudget(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Deadline Date</label>
                <input
                  type="date"
                  required
                  value={prjDeadline}
                  onChange={(e) => setPrjDeadline(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Priority Level</label>
                <select
                  value={prjPriority}
                  onChange={(e) => setPrjPriority(e.target.value as "Low" | "Medium" | "High")}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">Project Requirements & Scope</label>
              <textarea
                rows={3}
                value={prjDescription}
                onChange={(e) => setPrjDescription(e.target.value)}
                placeholder="Outline core deliverables, modules, and scope..."
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingClientId && (
        <ConfirmDialog
          isOpen={!!deletingClientId}
          onClose={() => setDeletingClientId(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Client Account?"
          message="Are you sure you want to permanently delete this client? Associated projects, quotes, and records may be affected."
          confirmLabel="Delete Client"
          variant="danger"
        />
      )}
    </div>
  );
}
