"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  FileText,
  Download,
  IndianRupee,
  Eye,
  CheckCircle2,
  X,
  Printer,
  Calendar,
  Building2,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Layers,
  ArrowRight,
  Sparkles,
  Edit2,
  Trash2,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Invoice, InvoiceStatus, DocumentItem } from "@/types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { clsx } from "clsx";

export default function InvoicesPage() {
  const { invoices, addInvoice, updateInvoice, deleteInvoice, projects } = useAppStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deletingInvoice, setDeletingInvoice] = useState<Invoice | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Form state
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || "");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [projectName, setProjectName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<InvoiceStatus>("Pending");
  const [quotationTotal, setQuotationTotal] = useState<number>(10000);
  const [previousPayment, setPreviousPayment] = useState<number>(4000);
  const [milestoneDescription, setMilestoneDescription] = useState("");
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [paidAmountInput, setPaidAmountInput] = useState<number>(0);
  const [notes, setNotes] = useState("Thank you for your business.");
  const [items, setItems] = useState<DocumentItem[]>([
    {
      id: "item-1",
      description: "1st Version Deployment",
      deliverable: "1st Version Deployment milestone build & server staging",
      quantity: 1,
      rate: 3000,
      amount: 3000,
    },
  ]);

  const handleOpenCreateModal = () => {
    setEditingInvoice(null);
    const rand = Math.floor(100 + Math.random() * 900);
    const todayStr = new Date().toISOString().split("T")[0];
    const dueStr = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

    setInvoiceNumber(`INV-2026-${rand}`);
    setIssueDate(todayStr);
    setDueDate(dueStr);
    setStatus("Pending");
    setTaxPercent(0);
    setPaidAmountInput(0);

    // Default template preset: Vehicle Insurance Deployment Milestone (Matching muthusaravanan_invoice_2.pdf)
    setClientName("Muthusaravanan N");
    setClientPhone("+91 76391 30497");
    setClientEmail("muthusaravanan@apexplatform.in");
    setClientAddress("Corporate Office, Coimbatore, Tamil Nadu");
    setProjectName("Vehicle Insurance Platform");
    setQuotationTotal(10000);
    setPreviousPayment(4000);
    setMilestoneDescription(
      "Invoice raised for the 1st version deployment milestone.\nPrevious advance paid: ₹4,000.00\nCurrent invoice amount: ₹3,000.00\nRemaining project balance after this invoice: ₹3,000.00"
    );
    setItems([
      {
        id: `item-${Date.now()}-1`,
        description: "1st Version Deployment",
        deliverable: "1st Version Deployment milestone delivery",
        quantity: 1,
        rate: 3000,
        amount: 3000,
      },
    ]);

    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (inv: Invoice) => {
    setEditingInvoice(inv);
    setInvoiceNumber(inv.invoiceNumber);
    setIssueDate(inv.issueDate || "");
    setDueDate(inv.dueDate || "");
    setStatus(inv.status);
    setTaxPercent(inv.taxPercent || 0);
    setPaidAmountInput(inv.paidAmount || 0);
    setClientName(inv.clientName || "");
    setClientPhone(inv.clientPhone || "");
    setClientEmail(inv.clientEmail || "");
    setClientAddress(inv.clientAddress || "");
    setProjectName(inv.projectName || "");
    setQuotationTotal(inv.quotationTotal || inv.amount);
    setPreviousPayment(inv.previousPayment || 0);
    setMilestoneDescription(inv.milestoneDescription || "");
    setNotes(inv.notes || "Thank you for your business.");
    setItems(
      inv.items && inv.items.length > 0
        ? inv.items
        : [
            {
              id: `item-${Date.now()}-1`,
              description: inv.projectName,
              deliverable: "Milestone deliverable",
              quantity: 1,
              rate: inv.amount,
              amount: inv.amount,
            },
          ]
    );
    setIsAddModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingInvoice) return;
    deleteInvoice(deletingInvoice.id);
    setDeletingInvoice(null);
    showToast("Invoice deleted successfully.");
  };

  const applyPreset = (presetType: "insurance" | "matrimony" | "studio") => {
    const todayStr = new Date().toISOString().split("T")[0];
    const dueStr = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

    if (presetType === "insurance") {
      setInvoiceNumber("INV-2026-003");
      setClientName("Muthusaravanan N");
      setClientPhone("+91 76391 30497");
      setClientEmail("muthusaravanan@apexplatform.in");
      setClientAddress("Coimbatore, Tamil Nadu");
      setProjectName("Vehicle Insurance Platform");
      setQuotationTotal(10000);
      setPreviousPayment(4000);
      setMilestoneDescription(
        "Invoice raised for the 1st version deployment milestone.\nPrevious advance paid: ₹4,000.00\nCurrent invoice amount: ₹3,000.00\nRemaining project balance after this invoice: ₹3,000.00"
      );
      setItems([
        {
          id: `item-${Date.now()}-1`,
          description: "1st Version Deployment",
          deliverable: "1st Version Deployment milestone delivery",
          quantity: 1,
          rate: 3000,
          amount: 3000,
        },
      ]);
      setStatus("Pending");
    } else if (presetType === "matrimony") {
      setInvoiceNumber("INV-2026-024");
      setClientName("Muthupandi");
      setClientPhone("+91 96779 73113");
      setClientEmail("contact@matrimonyplatform.in");
      setClientAddress("Madurai, Tamil Nadu");
      setProjectName("Matrimony Website & Mobile App");
      setQuotationTotal(36999);
      setPreviousPayment(0);
      setMilestoneDescription("Initial 50% Advance Payment before project commencement.");
      setItems([
        {
          id: `item-${Date.now()}-1`,
          description: "Initial Advance Payment (50%)",
          deliverable: "Project commencement, discovery and UI/UX design kickoff",
          quantity: 1,
          rate: 18499.5,
          amount: 18499.5,
        },
      ]);
      setStatus("Paid");
      setPaidAmountInput(18499.5);
    } else {
      setInvoiceNumber("INV-2026-025");
      setClientName("Dhilip Studio");
      setClientPhone("+91 97100 22334");
      setClientEmail("dhilip@dhilipstudio.in");
      setClientAddress("Coimbatore, Tamil Nadu");
      setProjectName("Business Website");
      setQuotationTotal(45000);
      setPreviousPayment(0);
      setMilestoneDescription("Full project final milestone payment upon handover.");
      setItems([
        {
          id: `item-${Date.now()}-1`,
          description: "Complete Website Development & Handover",
          deliverable: "Production deployment, portfolio galleries & domain config",
          quantity: 1,
          rate: 45000,
          amount: 45000,
        },
      ]);
      setStatus("Paid");
      setPaidAmountInput(45000);
    }
  };

  const handleProjectSelect = (prjId: string) => {
    setSelectedProjectId(prjId);
    const prj = projects.find((p) => p.id === prjId);
    if (prj) {
      setProjectName(prj.projectName);
      setClientName(prj.clientName);
      setClientEmail(`contact@${prj.clientName.toLowerCase().replace(/\s+/g, "")}.com`);
      setClientPhone("+91 98401 23456");
      setClientAddress("Corporate Office, Prime Commercial Hub, Chennai - 600002");
      const budget = prj.budget || 50000;
      setQuotationTotal(budget);
      setPreviousPayment(Math.round(budget * 0.4));
      const invoiceAmt = Math.round(budget * 0.3);
      setMilestoneDescription(
        `Invoice raised for ${prj.projectName} development milestone.\nPrevious advance paid: ₹${Math.round(
          budget * 0.4
        ).toLocaleString("en-IN")}\nCurrent invoice amount: ₹${invoiceAmt.toLocaleString(
          "en-IN"
        )}\nRemaining balance after this invoice: ₹${Math.round(budget * 0.3).toLocaleString("en-IN")}`
      );
      setItems([
        {
          id: `item-${Date.now()}-1`,
          description: `${prj.projectName} - Development Milestone`,
          deliverable: "Sprint milestone signoff and cloud staging deployment",
          quantity: 1,
          rate: invoiceAmt,
          amount: invoiceAmt,
        },
      ]);
    }
  };

  // Line items handlers
  const handleAddItem = () => {
    const newItem: DocumentItem = {
      id: `item-${Date.now()}`,
      description: "Additional Service / Milestone",
      deliverable: "Standard Deliverable Output",
      quantity: 1,
      rate: 3000,
      amount: 3000,
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (index: number, field: keyof DocumentItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };
    if (field === "quantity" || field === "rate") {
      item.amount = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
    }
    updated[index] = item;
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const taxAmount = Math.round((subtotal * taxPercent) / 100);
  const totalAmount = subtotal + taxAmount;
  const balanceAfterInvoice = Math.max(0, quotationTotal - previousPayment - totalAmount);
  const balance = Math.max(0, totalAmount - (Number(paidAmountInput) || 0));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedNum = invoiceNumber || `INV-2026-${Math.floor(100 + Math.random() * 900)}`;

    if (editingInvoice) {
      updateInvoice(editingInvoice.id, {
        invoiceNumber: resolvedNum,
        clientName: clientName || "Corporate Client",
        clientEmail,
        clientPhone,
        clientAddress,
        projectName: projectName || "Client Project",
        amount: totalAmount,
        paidAmount: Number(paidAmountInput) || 0,
        balance,
        dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
        status,
        issueDate: issueDate || new Date().toISOString().split("T")[0],
        quotationTotal,
        previousPayment,
        thisInvoiceAmount: totalAmount,
        balanceAfterInvoice,
        milestoneDescription,
        items,
        subtotal,
        taxPercent,
        taxAmount,
        notes: notes || "Thank you for your business.",
      });
      setIsAddModalOpen(false);
      setEditingInvoice(null);
      showToast("Invoice updated successfully!");
      return;
    }

    const newInv: Omit<Invoice, "id"> = {
      invoiceNumber: resolvedNum,
      clientName: clientName || "Corporate Client",
      clientEmail,
      clientPhone,
      clientAddress,
      projectName: projectName || "Client Project",
      amount: totalAmount,
      paidAmount: Number(paidAmountInput) || 0,
      balance,
      dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      status,
      issueDate: issueDate || new Date().toISOString().split("T")[0],
      quotationTotal,
      previousPayment,
      thisInvoiceAmount: totalAmount,
      balanceAfterInvoice,
      milestoneDescription,
      items,
      subtotal,
      taxPercent,
      taxAmount,
      notes: notes || "Thank you for your business.",
    };

    addInvoice(newInv);

    setIsAddModalOpen(false);
    showToast("Invoice created successfully!");
  };

  const filteredInvoices = invoices.filter((i) => {
    const matchSearch =
      i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      i.clientName.toLowerCase().includes(search.toLowerCase()) ||
      i.projectName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalInvoicesCount = invoices.length;
  const paidCount = invoices.filter((i) => i.status === "Paid").length;
  const pendingCount = invoices.filter((i) => i.status === "Pending" || i.status === "Partial").length;
  const overdueCount = invoices.filter((i) => i.status === "Overdue").length;
  const totalBilled = invoices.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 rounded-xl bg-[#0F172A] px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Invoices</h1>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[#2563EB] border border-blue-100">
              TS DEV Standard Template
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Create, issue, and download professional milestone invoices with live PDF generation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Total Invoices</span>
          <div className="text-xl font-bold text-[#0F172A]">{totalInvoicesCount}</div>
          <span className="text-[11px] text-[#64748B]">₹{totalBilled.toLocaleString("en-IN")} billed</span>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Paid Invoices</span>
          <div className="text-xl font-bold text-[#16A34A]">{paidCount}</div>
          <span className="text-[11px] text-[#16A34A] font-medium">Settled to bank</span>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Pending / Due</span>
          <div className="text-xl font-bold text-[#F59E0B]">{pendingCount}</div>
          <span className="text-[11px] text-[#F59E0B] font-medium">Awaiting disbursement</span>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Overdue Invoices</span>
          <div className="text-xl font-bold text-[#DC2626]">{overdueCount}</div>
          <span className="text-[11px] text-[#DC2626] font-medium">Follow-up required</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3 shadow-2xs">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice number, client, project..."
            className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-9 pr-3 py-1.5 text-xs text-[#0F172A] focus:outline-hidden font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0F172A]"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <tr>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Invoice Number</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Client Name</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Project</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Amount (₹)</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Paid Amount</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Balance</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Due Date</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Status</th>
                <th className="py-3 px-4 font-semibold text-[#64748B] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <EmptyState
                      icon={FileText}
                      title="No invoices found"
                      description="Create milestone or project invoices to bill clients and track payments."
                      actionLabel="+ Create Invoice"
                      onAction={handleOpenCreateModal}
                    />
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#2563EB] font-mono">
                      <button
                        type="button"
                        onClick={() => setPreviewInvoice(inv)}
                        className="hover:underline text-left cursor-pointer"
                      >
                        {inv.invoiceNumber}
                      </button>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#0F172A]">{inv.clientName}</td>
                    <td className="py-3 px-4 text-[#64748B] font-medium">{inv.projectName}</td>
                    <td className="py-3 px-4 font-bold text-[#0F172A]">
                      ₹{inv.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-[#16A34A] font-semibold">
                      ₹{inv.paidAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0F172A]">
                      ₹{inv.balance.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-[#64748B] font-medium">{inv.dueDate}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          inv.status === "Paid"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : inv.status === "Partial"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : inv.status === "Overdue"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewInvoice(inv)}
                          className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] shadow-2xs cursor-pointer"
                          title="View and Download PDF"
                        >
                          <Eye className="h-3.5 w-3.5 text-[#2563EB]" />
                          <span>PDF</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(inv)}
                          className="p-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#2563EB] hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Edit Invoice"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingInvoice(inv)}
                          className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-[#DC2626] hover:bg-red-100 transition-colors cursor-pointer"
                          title="Delete Invoice"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewInvoice(inv);
                            setTimeout(() => window.print(), 300);
                          }}
                          className="flex items-center gap-1 rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1 text-[11px] font-semibold text-[#2563EB] hover:bg-blue-100 cursor-pointer"
                          title="Instant Print / Download"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CREATE CLIENT TAX INVOICE                                          */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div
          onClick={() => setIsAddModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 md:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4 bg-[#F8FAFC] shrink-0">
              <div>
                <h3 className="font-bold text-base text-[#0F172A]">
                  {editingInvoice ? "Edit Client Invoice" : "Create Client Invoice"}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {editingInvoice
                    ? "Update milestone deliverables, billing breakdown and payment details."
                    : "TS DEV Standard Invoice format matching official company structure."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingInvoice(null);
                }}
                className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">

            {/* Quick Template Presets */}
            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
              <span className="text-[11px] font-bold text-[#2563EB] flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                Template Presets:
              </span>
              <button
                type="button"
                onClick={() => applyPreset("insurance")}
                className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-xs font-semibold text-[#2563EB] hover:bg-blue-50 transition-colors shadow-2xs"
              >
                Vehicle Insurance MVP (₹3,000)
              </button>
              <button
                type="button"
                onClick={() => applyPreset("matrimony")}
                className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-xs font-semibold text-[#2563EB] hover:bg-blue-50 transition-colors shadow-2xs"
              >
                Matrimony 50% Kickoff (₹18,499.50)
              </button>
              <button
                type="button"
                onClick={() => applyPreset("studio")}
                className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-xs font-semibold text-[#2563EB] hover:bg-blue-50 transition-colors shadow-2xs"
              >
                Studio Website Handover (₹45,000)
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              {/* Project & Client Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">
                    Select Associated Project
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => handleProjectSelect(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-2 text-xs text-[#0F172A]"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.projectName} ({p.clientName})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Invoice Number *</label>
                  <input
                    type="text"
                    required
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs text-[#0F172A] font-mono"
                  />
                </div>
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Client Phone</label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Client Email</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs text-[#0F172A]"
                  />
                </div>
              </div>

              {/* Project Reference Financials */}
              <div className="p-3 rounded-xl bg-blue-50/40 border border-blue-100 space-y-2">
                <span className="font-bold text-[11px] text-[#2563EB] uppercase tracking-wider block">
                  Project Reference Breakdown
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] text-[#64748B] block mb-0.5">Quotation Total (₹)</label>
                    <input
                      type="number"
                      value={quotationTotal}
                      onChange={(e) => setQuotationTotal(Number(e.target.value))}
                      className="w-full rounded border border-[#E2E8F0] bg-white px-2 py-1 text-xs font-semibold text-[#0F172A]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#64748B] block mb-0.5">Previous Payment (₹)</label>
                    <input
                      type="number"
                      value={previousPayment}
                      onChange={(e) => setPreviousPayment(Number(e.target.value))}
                      className="w-full rounded border border-[#E2E8F0] bg-white px-2 py-1 text-xs font-semibold text-[#16A34A]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#64748B] block mb-0.5">This Invoice Total</label>
                    <div className="w-full rounded border border-[#E2E8F0] bg-white px-2 py-1 text-xs font-bold text-[#2563EB]">
                      ₹{totalAmount.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#64748B] block mb-0.5">Balance After Invoice</label>
                    <div className="w-full rounded border border-[#E2E8F0] bg-white px-2 py-1 text-xs font-bold text-[#0F172A]">
                      ₹{balanceAfterInvoice.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates & Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Issue Date *</label>
                  <input
                    type="date"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-xs text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-xs text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Invoice Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs text-[#0F172A] font-semibold"
                  >
                    <option value="Pending">DUE / Pending</option>
                    <option value="Paid">PAID</option>
                    <option value="Partial">Partial</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#0F172A]">
                    Invoice Line Items & Deliverables
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0F172A] text-white">
                      <tr>
                        <th className="p-2.5 font-bold uppercase tracking-wider text-[10px]">Description</th>
                        <th className="p-2.5 font-bold uppercase tracking-wider text-[10px] w-16 text-center">Qty</th>
                        <th className="p-2.5 font-bold uppercase tracking-wider text-[10px] w-28 text-right">Rate (₹)</th>
                        <th className="p-2.5 font-bold uppercase tracking-wider text-[10px] w-28 text-right">Amount (₹)</th>
                        <th className="p-2.5 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {items.map((item, idx) => (
                        <tr key={item.id}>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                handleUpdateItem(idx, "description", e.target.value)
                              }
                              placeholder="e.g. 1st Version Deployment"
                              className="w-full rounded border border-[#E2E8F0] px-2 py-1 text-xs font-semibold"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleUpdateItem(idx, "quantity", Number(e.target.value))
                              }
                              className="w-full rounded border border-[#E2E8F0] px-2 py-1 text-xs text-center"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={item.rate}
                              onChange={(e) =>
                                handleUpdateItem(idx, "rate", Number(e.target.value))
                              }
                              className="w-full rounded border border-[#E2E8F0] px-2 py-1 text-xs font-semibold text-right"
                            />
                          </td>
                          <td className="p-2 font-bold text-[#0F172A] text-right">
                            ₹{(item.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="text-[#94A3B8] hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Milestone Description / Note */}
                <div className="pt-2">
                  <label className="font-semibold text-[#0F172A] block mb-1">
                    Payment / Note Section (Printed on Invoice)
                  </label>
                  <textarea
                    rows={3}
                    value={milestoneDescription}
                    onChange={(e) => setMilestoneDescription(e.target.value)}
                    placeholder="e.g. Invoice raised for the 1st version deployment milestone..."
                    className="w-full rounded-xl border border-[#E2E8F0] p-2.5 text-xs text-[#0F172A] font-medium"
                  />
                </div>

                {/* Financial Summary */}
                <div className="flex justify-end pt-2">
                  <div className="w-72 space-y-1.5 text-xs p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className="flex justify-between text-[#64748B]">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-[#0F172A]">
                        ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-[#CBD5E1] pt-1.5 font-bold text-sm text-[#0F172A]">
                      <span className="text-[#2563EB]">TOTAL DUE:</span>
                      <span className="text-[#16A34A]">
                        ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] pt-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingInvoice(null);
                    }}
                    className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-slate-200/60 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{editingInvoice ? "Save Invoice Changes" : "Issue & Generate PDF"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FORMAL TAX INVOICE PRINTABLE PDF VIEWER MODAL                              */}
      {/* Exact Template Match for muthusaravanan_invoice_2.pdf                      */}
      {/* ========================================================================= */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-2xs p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-2xl my-8 space-y-6">
            {/* Modal Control Bar (Hidden when printing) */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 print:hidden">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-[#2563EB] border border-blue-200">
                  OFFICIAL INVOICE
                </span>
                <span className="font-mono text-xs font-bold text-[#0F172A]">
                  {previewInvoice.invoiceNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>Download / Print PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewInvoice(null)}
                  className="rounded-xl border border-[#E2E8F0] p-1.5 text-[#64748B] hover:bg-[#F8FAFC]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* FORMAL CORPORATE INVOICE CONTAINER (Exact Template Match) */}
            <div className="border border-slate-200 rounded-xl p-8 sm:p-10 space-y-6 text-[#0F172A] bg-white print:border-none print:p-0 print:shadow-none shadow-xs">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3.5">
                  <div className="h-14 w-14 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 shrink-0 p-1.5 shadow-xs flex items-center justify-center">
                    <img src="/logo-removebg.png" alt="TS DEV Logo" className="h-full w-full object-contain filter drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-[#0F172A]">TS DEV</h1>
                    <p className="text-xs font-medium text-[#475569] mt-0.5">Digital Solutions & Development</p>
                    <p className="text-xs text-[#64748B]">Dharmapuri, Tamil Nadu, India</p>
                    <p className="text-xs text-[#2563EB] font-medium mt-0.5">
                      Ceittamilselvanr26@gmail.com · +91 9944287852
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-black tracking-wider text-[#0F172A]">INVOICE</h2>
                  <div className="mt-2 space-y-0.5 text-xs text-[#334155]">
                    <div>
                      <span className="text-[#64748B]">Invoice No:</span>{" "}
                      <span className="font-semibold text-[#0F172A] font-mono">
                        {previewInvoice.invoiceNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B]">Issue Date:</span>{" "}
                      <span className="font-medium">{previewInvoice.issueDate}</span>
                    </div>
                    <div className="pt-0.5">
                      <span className="text-[#64748B]">Payment Status: </span>
                      <span
                        className={clsx(
                          "font-bold uppercase tracking-wide",
                          previewInvoice.status === "Paid"
                            ? "text-[#16A34A]"
                            : previewInvoice.status === "Overdue"
                            ? "text-[#DC2626]"
                            : "text-[#2563EB]"
                        )}
                      >
                        {previewInvoice.status === "Paid"
                          ? "PAID"
                          : previewInvoice.status === "Overdue"
                          ? "OVERDUE"
                          : "DUE"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blue accent divider */}
              <div className="border-b-2 border-[#2563EB]"></div>

              {/* Bill To & Project Reference Grid */}
              <div className="grid grid-cols-2 gap-8 text-xs">
                <div>
                  <div className="text-[11px] font-bold text-[#2563EB] tracking-wider uppercase mb-2">
                    BILL TO
                  </div>
                  <div className="font-bold text-sm text-[#0F172A]">{previewInvoice.clientName}</div>
                  {previewInvoice.clientPhone && (
                    <div className="text-[#334155] font-medium mt-0.5">{previewInvoice.clientPhone}</div>
                  )}
                  {previewInvoice.clientEmail && (
                    <div className="text-[#64748B] text-[11px] mt-0.5">{previewInvoice.clientEmail}</div>
                  )}
                  {previewInvoice.clientAddress && (
                    <div className="text-[#64748B] text-[11px] mt-0.5">{previewInvoice.clientAddress}</div>
                  )}
                </div>

                <div>
                  <div className="text-[11px] font-bold text-[#2563EB] tracking-wider uppercase mb-2">
                    PROJECT REFERENCE
                  </div>
                  <div className="space-y-1 text-xs text-[#334155]">
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Quotation Total:</span>
                      <span className="font-semibold">
                        ₹
                        {(previewInvoice.quotationTotal || previewInvoice.amount).toLocaleString(
                          "en-IN",
                          { minimumFractionDigits: 2 }
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Previous Payment:</span>
                      <span className="font-semibold">
                        ₹
                        {(previewInvoice.previousPayment || previewInvoice.paidAmount || 0).toLocaleString(
                          "en-IN",
                          { minimumFractionDigits: 2 }
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">This Invoice:</span>
                      <span className="font-semibold">
                        ₹
                        {(previewInvoice.thisInvoiceAmount || previewInvoice.amount).toLocaleString(
                          "en-IN",
                          { minimumFractionDigits: 2 }
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Balance After This Invoice:</span>
                      <span className="font-semibold">
                        ₹
                        {(previewInvoice.balanceAfterInvoice !== undefined
                          ? previewInvoice.balanceAfterInvoice
                          : previewInvoice.balance
                        ).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-hidden rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0F172A] text-white">
                    <tr>
                      <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[11px]">
                        DESCRIPTION
                      </th>
                      <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[11px] text-center w-16">
                        QTY
                      </th>
                      <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[11px] text-right w-28">
                        RATE
                      </th>
                      <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[11px] text-right w-28">
                        AMOUNT
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] border border-t-0 border-[#E2E8F0]">
                    {previewInvoice.items && previewInvoice.items.length > 0 ? (
                      previewInvoice.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3 font-semibold text-[#0F172A]">
                            <div>{item.description}</div>
                            {item.deliverable && item.deliverable !== item.description && (
                              <div className="text-[11px] text-[#64748B] font-normal mt-0.5">
                                {item.deliverable}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center text-[#334155]">{item.quantity}</td>
                          <td className="py-3 px-3 text-right text-[#334155] font-medium">
                            ₹{(item.rate || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-[#0F172A]">
                            ₹{(item.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-3 px-3 font-semibold text-[#0F172A]">
                          {previewInvoice.projectName} - Development Milestone
                        </td>
                        <td className="py-3 px-3 text-center text-[#334155]">1</td>
                        <td className="py-3 px-3 text-right text-[#334155] font-medium">
                          ₹{previewInvoice.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-[#0F172A]">
                          ₹{previewInvoice.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Payment / Note & Total Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start text-xs pt-1">
                <div>
                  <div className="text-[11px] font-bold text-[#2563EB] tracking-wider uppercase mb-1.5">
                    PAYMENT / NOTE
                  </div>
                  <div className="space-y-1 text-xs text-[#475569] leading-relaxed whitespace-pre-line bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                    {previewInvoice.milestoneDescription ||
                      previewInvoice.notes ||
                      "Invoice raised for milestone development.\nThank you for your business."}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-3 py-1.5 text-xs text-[#475569]">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-semibold text-[#0F172A]">
                      ₹
                      {(previewInvoice.subtotal || previewInvoice.amount).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center rounded-xl bg-emerald-50/80 border border-emerald-200/80 p-3 text-[#0F172A]">
                    <span className="font-black text-sm uppercase tracking-wider text-[#16A34A]">
                      TOTAL DUE
                    </span>
                    <span className="font-black text-base text-[#16A34A]">
                      ₹{previewInvoice.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-8 border-t border-[#E2E8F0] flex items-end justify-between text-xs">
                <div>
                  <p className="font-bold text-[#2563EB] text-xs">Thank you for your business.</p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-slate-950 p-1 border border-slate-800 flex items-center justify-center">
                      <img src="/logo-removebg.png" alt="TS DEV Seal" className="h-full w-full object-contain" />
                    </div>
                    <div className="font-bold text-xs text-[#0F172A]">For TS DEV</div>
                  </div>
                  <div className="pt-4 text-[11px] text-[#64748B] font-medium border-t border-slate-300 w-36 text-center">
                    Authorized Signatory
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Invoice Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingInvoice}
        title="Delete Invoice"
        message={`Are you sure you want to permanently delete invoice "${deletingInvoice?.invoiceNumber}" for ${deletingInvoice?.clientName}?`}
        confirmLabel="Delete Invoice"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingInvoice(null)}
      />
    </div>
  );
}
