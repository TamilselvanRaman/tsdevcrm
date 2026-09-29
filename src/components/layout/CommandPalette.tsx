"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MessageSquare,
  FolderKanban,
  CheckSquare,
  Users,
  FileText,
  X,
  ArrowRight,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { clsx } from "clsx";

export function CommandPalette() {
  const router = useRouter();
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    enquiries,
    projects,
    tasks,
    users,
    invoices,
  } = useAppStore();

  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const filteredEnquiries = enquiries.filter(
    (e) =>
      e.clientName.toLowerCase().includes(query.toLowerCase()) ||
      e.company.toLowerCase().includes(query.toLowerCase()) ||
      e.requirement.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProjects = projects.filter(
    (p) =>
      p.projectName.toLowerCase().includes(query.toLowerCase()) ||
      p.clientName.toLowerCase().includes(query.toLowerCase()) ||
      p.projectCode.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.taskKey.toLowerCase().includes(query.toLowerCase()) ||
      t.projectName.toLowerCase().includes(query.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(query.toLowerCase()) ||
      u.role.toLowerCase().includes(query.toLowerCase()) ||
      u.team.toLowerCase().includes(query.toLowerCase())
  );

  const filteredInvoices = invoices.filter(
    (i) =>
      i.invoiceNumber.toLowerCase().includes(query.toLowerCase()) ||
      i.clientName.toLowerCase().includes(query.toLowerCase()) ||
      i.projectName.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    setCommandPaletteOpen(false);
    setQuery("");
    router.push(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="flex items-center border-b border-[#E2E8F0] px-4 py-3 gap-3 bg-[#F8FAFC]">
          <div className="h-6 w-6 rounded-md bg-slate-950 overflow-hidden border border-slate-800 p-0.5 flex items-center justify-center shrink-0">
            <img src="/logo-removebg.png" alt="TS DEV" className="h-full w-full object-contain" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search enquiries, projects, tasks, team members, invoices..."
            className="w-full bg-transparent text-sm text-[#0F172A] placeholder-[#64748B] focus:outline-hidden font-medium"
            autoFocus
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="rounded-lg p-1 text-[#64748B] hover:bg-slate-200 hover:text-[#0F172A]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-3 space-y-4 text-xs">
          {/* Enquiries */}
          {filteredEnquiries.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-[#2563EB]" /> Enquiries
              </div>
              <div className="space-y-1">
                {filteredEnquiries.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(`/crm/admin/enquiries/${item.id}`)}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-[#F8FAFC] transition-colors group"
                  >
                    <div>
                      <div className="font-semibold text-[#0F172A] group-hover:text-[#2563EB]">
                        {item.clientName}
                      </div>
                      <div className="text-[11px] text-[#64748B]">{item.requirement} • ₹{item.estimatedBudget.toLocaleString("en-IN")}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
                <FolderKanban className="h-3.5 w-3.5 text-[#2563EB]" /> Projects
              </div>
              <div className="space-y-1">
                {filteredProjects.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(`/crm/admin/projects/${item.id}`)}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-[#F8FAFC] transition-colors group"
                  >
                    <div>
                      <div className="font-semibold text-[#0F172A] group-hover:text-[#2563EB]">
                        {item.projectName} ({item.projectCode})
                      </div>
                      <div className="text-[11px] text-[#64748B]">{item.clientName} • {item.progressPct}% completed</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="h-3.5 w-3.5 text-[#2563EB]" /> Tasks
              </div>
              <div className="space-y-1">
                {filteredTasks.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(`/crm/admin/tasks/${item.id}`)}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-[#F8FAFC] transition-colors group"
                  >
                    <div>
                      <div className="font-semibold text-[#0F172A] group-hover:text-[#2563EB]">
                        [{item.taskKey}] {item.title}
                      </div>
                      <div className="text-[11px] text-[#64748B]">{item.projectName} • {item.assignedToName}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Team Members */}
          {filteredUsers.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#2563EB]" /> Team Members
              </div>
              <div className="space-y-1">
                {filteredUsers.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(`/crm/admin/team/members/${item.id}`)}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-[#F8FAFC] transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <img src={item.avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
                      <div>
                        <div className="font-semibold text-[#0F172A] group-hover:text-[#2563EB]">{item.fullName}</div>
                        <div className="text-[11px] text-[#64748B]">{item.role} • {item.team}</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Invoices */}
          {filteredInvoices.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#2563EB]" /> Invoices
              </div>
              <div className="space-y-1">
                {filteredInvoices.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(`/crm/admin/finance/invoices`)}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-[#F8FAFC] transition-colors group"
                  >
                    <div>
                      <div className="font-semibold text-[#0F172A] group-hover:text-[#2563EB]">
                        {item.invoiceNumber} - {item.clientName}
                      </div>
                      <div className="text-[11px] text-[#64748B]">₹{item.amount.toLocaleString("en-IN")} • Status: {item.status}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
