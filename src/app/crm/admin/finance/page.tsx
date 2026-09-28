"use client";

import Link from "next/link";
import {
  IndianRupee,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export default function FinanceDashboardPage() {
  const { invoices, payments } = useAppStore();

  const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.amount || 0), 0);
  const collected = invoices.filter((i) => i.status === "Paid").reduce((acc, inv) => acc + (inv.amount || 0), 0);
  const outstanding = invoices.filter((i) => i.status === "Pending" || i.status === "Partial").reduce((acc, inv) => acc + (inv.amount || 0), 0);
  const overdue = invoices.filter((i) => i.status === "Overdue").reduce((acc, inv) => acc + (inv.amount || 0), 0);

  const collectedPct = totalRevenue > 0 ? Math.round((collected / totalRevenue) * 100) : 0;
  const pendingPct = totalRevenue > 0 ? Math.round((outstanding / totalRevenue) * 100) : 0;
  const overduePct = totalRevenue > 0 ? Math.round((overdue / totalRevenue) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Finance Dashboard</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Admin-only financial overview, revenue tracking and collections ledger.
          </p>
        </div>
        <Link
          href="/crm/admin/finance/invoices"
          className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Manage Invoices</span>
        </Link>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-2">
          <span className="text-xs text-[#64748B] font-medium">Total Revenue</span>
          <div className="text-2xl font-bold text-[#0F172A]">₹{totalRevenue.toLocaleString("en-IN")}</div>
          <div className="text-[11px] text-[#16A34A] font-medium flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" /> Live ledger
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-2">
          <span className="text-xs text-[#64748B] font-medium">Collected</span>
          <div className="text-2xl font-bold text-[#16A34A]">₹{collected.toLocaleString("en-IN")}</div>
          <div className="text-[11px] text-[#64748B]">{collectedPct}% of billed invoices paid</div>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-2">
          <span className="text-xs text-[#64748B] font-medium">Outstanding</span>
          <div className="text-2xl font-bold text-[#2563EB]">₹{outstanding.toLocaleString("en-IN")}</div>
          <div className="text-[11px] text-[#64748B]">{invoices.filter(i => i.status !== "Paid").length} pending client invoices</div>
        </div>

        {/* Card 4 */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-2">
          <span className="text-xs text-[#64748B] font-medium">Overdue</span>
          <div className="text-2xl font-bold text-[#DC2626]">₹{overdue.toLocaleString("en-IN")}</div>
          <div className="text-[11px] text-[#DC2626] font-medium">Requires follow-up</div>
        </div>
      </div>

      {/* Visual Collections Progress Bar */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-3">
        <div className="flex justify-between text-xs font-bold text-[#0F172A]">
          <span>Payment Collection Progress</span>
          <span>₹{collected.toLocaleString("en-IN")} / ₹{totalRevenue.toLocaleString("en-IN")} ({collectedPct}%)</span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div className="h-full bg-[#16A34A]" style={{ width: `${collectedPct}%` }} title="Collected" />
          <div className="h-full bg-[#2563EB]" style={{ width: `${pendingPct}%` }} title="Pending" />
          <div className="h-full bg-[#DC2626]" style={{ width: `${overduePct}%` }} title="Overdue" />
        </div>
        <div className="flex items-center gap-6 text-xs text-[#64748B] pt-1">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#16A34A]" /> Paid (₹{collected.toLocaleString("en-IN")})</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#2563EB]" /> Pending (₹{outstanding.toLocaleString("en-IN")})</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#DC2626]" /> Overdue (₹{overdue.toLocaleString("en-IN")})</span>
        </div>
      </div>

      {/* 2-Column Tables: Recent Payments & Outstanding Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">Recent Payments Received</h3>
              <p className="text-xs text-[#64748B]">Verified client transactions</p>
            </div>
            <Link href="/crm/admin/finance/invoices" className="text-xs font-semibold text-[#2563EB]">
              Invoices <ArrowUpRight className="h-3 w-3 inline" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left table-compact">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Project</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="font-semibold text-[#0F172A]">{p.clientName}</td>
                    <td className="text-[#64748B]">{p.projectName}</td>
                    <td className="font-bold text-[#16A34A]">₹{p.amount.toLocaleString("en-IN")}</td>
                    <td className="text-[#64748B]">{p.date}</td>
                    <td>
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Outstanding Invoices */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">Outstanding & Overdue Invoices</h3>
              <p className="text-xs text-[#64748B]">Pending client balances</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left table-compact">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Client</th>
                  <th>Balance</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.filter((i) => i.status !== "Paid").map((inv) => (
                  <tr key={inv.id}>
                    <td className="font-bold text-[#2563EB]">{inv.invoiceNumber}</td>
                    <td className="font-semibold text-[#0F172A]">{inv.clientName}</td>
                    <td className="font-bold text-[#0F172A]">₹{inv.balance.toLocaleString("en-IN")}</td>
                    <td className="text-[#64748B]">{inv.dueDate}</td>
                    <td>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          inv.status === "Overdue"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
