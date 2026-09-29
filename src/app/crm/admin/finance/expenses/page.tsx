"use client";

import { useState } from "react";
import {
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  AlertCircle,
  Edit2,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ExpenseRecord } from "@/types";

export default function ExpensesPage() {
  const { expenses, addExpense, updateExpense, deleteExpense, payments, users, projects } = useAppStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  // Add Form State
  const [category, setCategory] = useState("Software Subscriptions");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [projectName, setProjectName] = useState(projects[0]?.projectName || "General Operations");

  // Edit Form State
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editProjectName, setEditProjectName] = useState("");
  const [editStatus, setEditStatus] = useState<ExpenseRecord["status"]>("Approved");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleOpenAddModal = () => {
    setCategory("Software Subscriptions");
    setDescription("");
    setAmount("");
    setProjectName(projects[0]?.projectName || "General Operations");
    setIsAddModalOpen(true);
  };

  const handleRecordExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;

    addExpense({
      category,
      description: description.trim(),
      amount: parseFloat(amount) || 0,
      date: new Date().toISOString().split("T")[0],
      projectName,
      submittedBy: users[0]?.fullName || "Admin",
      status: "Approved",
    });

    setIsAddModalOpen(false);
    showToast(`Expense for "${description}" recorded.`);
  };

  const handleOpenEditModal = (exp: ExpenseRecord) => {
    setEditingExpense(exp);
    setEditCategory(exp.category);
    setEditDescription(exp.description);
    setEditAmount(exp.amount.toString());
    setEditProjectName(exp.projectName);
    setEditStatus(exp.status);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense || !editDescription.trim()) return;

    updateExpense(editingExpense.id, {
      category: editCategory,
      description: editDescription.trim(),
      amount: parseFloat(editAmount) || 0,
      projectName: editProjectName,
      status: editStatus,
    });

    showToast("Expense record updated.");
    setEditingExpense(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingId) return;
    deleteExpense(deletingId);
    showToast("Expense record deleted.");
    setDeletingId(null);
  };

  const columns: ColumnDef<ExpenseRecord>[] = [
    {
      id: "category",
      header: "Category & Description",
      accessorKey: "category",
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-bold text-[#0F172A]">{row.category}</div>
          <div className="text-[11px] text-[#64748B]">{row.description}</div>
        </div>
      ),
    },
    {
      id: "project",
      header: "Project",
      accessorKey: "projectName",
      sortable: true,
    },
    {
      id: "amount",
      header: "Amount",
      accessorKey: "amount",
      sortable: true,
      align: "right",
      cell: (row) => (
        <span className="font-bold text-xs text-[#DC2626]">
          -₹{row.amount.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      id: "submittedBy",
      header: "Submitted By",
      accessorKey: "submittedBy",
    },
    {
      id: "date",
      header: "Date",
      accessorKey: "date",
      sortable: true,
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
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => handleOpenEditModal(row)}
            title="Edit Expense"
            className="p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeletingId(row.id)}
            title="Delete Expense"
            className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const totalExpenseAmount = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalCollectedAmount = payments.reduce((acc, p) => acc + p.amount, 0);
  const netCashFlow = totalCollectedAmount - totalExpenseAmount;
  const pendingCount = expenses.filter((e) => e.status === "Pending").length;

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
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Expenses & Payment Ledger</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Operational cash flow, expenditures, vendor payouts, and incoming payments.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          title="Recorded Expenses"
          value={`₹${totalExpenseAmount.toLocaleString("en-IN")}`}
          subtext="Total expenditures"
          icon={ArrowDownLeft}
          variant="rose"
        />
        <MetricCard
          title="Pending Approvals"
          value={pendingCount}
          subtext="Awaiting review"
          icon={AlertCircle}
          variant="amber"
        />
        <MetricCard
          title="Client Receipts"
          value={`₹${totalCollectedAmount.toLocaleString("en-IN")}`}
          subtext="Cleared invoices"
          icon={ArrowUpRight}
          variant="emerald"
        />
        <MetricCard
          title="Net Cash Position"
          value={`₹${netCashFlow.toLocaleString("en-IN")}`}
          subtext="Revenue minus outlays"
          icon={CreditCard}
          variant={netCashFlow >= 0 ? "blue" : "rose"}
        />
      </div>

      {/* Data Table */}
      <DataTable
        data={expenses}
        columns={columns}
        searchPlaceholder="Search category, description, or project..."
        emptyTitle="No expenses logged"
        emptyDescription="There are no expense records logged yet. Click '+ Record Expense' to add operational costs."
      />

      {/* Record Expense Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Record New Expense"
          subtitle="Log outgoing operational or project-related expenditures."
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
                onClick={handleRecordExpense}
                className="rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
              >
                Save Expense
              </button>
            </>
          }
        >
          <form onSubmit={handleRecordExpense} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Expense Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden"
                >
                  <option value="Software Subscriptions">Software Subscriptions</option>
                  <option value="Hosting & Cloud Infrastructure">Hosting & Cloud Infrastructure</option>
                  <option value="Office & Logistics">Office & Logistics</option>
                  <option value="Client Travel & Meetings">Client Travel & Meetings</option>
                  <option value="Marketing & Ad Spend">Marketing & Ad Spend</option>
                  <option value="Contractor & Freelance Fees">Contractor & Freelance Fees</option>
                  <option value="Hardware & Equipment">Hardware & Equipment</option>
                  <option value="Other Operations">Other Operations</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Description / Purpose <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. AWS Cloud Production Hosting Charges"
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">Charge to Project</label>
              <select
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden"
              >
                <option value="General Operations">General Operations</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.projectName}>
                    {p.projectName}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Expense Modal */}
      {editingExpense && (
        <Modal
          isOpen={!!editingExpense}
          onClose={() => setEditingExpense(null)}
          title="Edit Expense Record"
          subtitle="Update amount, category, or approval status."
          footer={
            <>
              <button
                type="button"
                onClick={() => setEditingExpense(null)}
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
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Expense Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden"
                >
                  <option value="Software Subscriptions">Software Subscriptions</option>
                  <option value="Hosting & Cloud Infrastructure">Hosting & Cloud Infrastructure</option>
                  <option value="Office & Logistics">Office & Logistics</option>
                  <option value="Client Travel & Meetings">Client Travel & Meetings</option>
                  <option value="Marketing & Ad Spend">Marketing & Ad Spend</option>
                  <option value="Contractor & Freelance Fees">Contractor & Freelance Fees</option>
                  <option value="Hardware & Equipment">Hardware & Equipment</option>
                  <option value="Other Operations">Other Operations</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Description / Purpose <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Charge to Project</label>
                <select
                  value={editProjectName}
                  onChange={(e) => setEditProjectName(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden"
                >
                  <option value="General Operations">General Operations</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.projectName}>
                      {p.projectName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Approval Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as ExpenseRecord["status"])}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden"
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
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
          title="Delete Expense Record?"
          message="Are you sure you want to permanently delete this expense ledger entry?"
          confirmLabel="Delete Expense"
          variant="danger"
        />
      )}
    </div>
  );
}
