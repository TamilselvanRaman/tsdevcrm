"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Menu,
  LogOut,
  Plus,
  ChevronRight,
  FolderPlus,
  CheckSquare,
  UserPlus,
  FilePlus,
  CalendarPlus,
  ArrowRightLeft,
  Command,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { clsx } from "clsx";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    portalMode,
    setPortalMode,
    setCommandPaletteOpen,
    setNotificationDrawerOpen,
    notifications,
    users,
    currentUserId,
    toggleSidebar,
    logout,
  } = useAppStore();

  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  if (pathname === "/login") return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Safe fallback for currentUser to avoid crashes when users list is loading
  const currentUser = users.find((u) => u.id === currentUserId) || users[0] || {
    id: "guest",
    fullName: "Tamil Selvan R",
    role: "Admin",
    email: "ceittamilselvanr@gmail.com",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  };

  // Generate dynamic breadcrumbs
  const getBreadcrumbs = () => {
    const crumbs: { label: string; href: string }[] = [{ label: "Home", href: "/crm/admin" }];

    if (pathname === "/" || pathname === "/crm/admin") {
      return [{ label: "Dashboard", href: "/crm/admin" }];
    }

    if (pathname.includes("/enquiries")) {
      crumbs.push({ label: "CRM", href: "/crm/admin/enquiries" });
      crumbs.push({ label: "Leads & Enquiries", href: "/crm/admin/enquiries" });
      if (pathname.includes("/enq-")) {
        crumbs.push({ label: "Lead Details", href: pathname });
      }
      return crumbs;
    }

    if (pathname.includes("/follow-ups")) {
      crumbs.push({ label: "CRM", href: "/crm/admin/enquiries" });
      crumbs.push({ label: "Follow-ups", href: "/crm/admin/follow-ups" });
      return crumbs;
    }

    if (pathname.includes("/clients")) {
      crumbs.push({ label: "CRM", href: "/crm/admin/clients" });
      crumbs.push({ label: "Clients", href: "/crm/admin/clients" });
      return crumbs;
    }

    if (pathname.includes("/projects/documents")) {
      crumbs.push({ label: "CRM", href: "/crm/admin/projects/documents" });
      crumbs.push({ label: "Quotations & Agreements", href: "/crm/admin/projects/documents" });
      return crumbs;
    }

    if (pathname.includes("/projects/dashboard")) {
      crumbs.push({ label: "Projects", href: "/crm/admin/projects" });
      crumbs.push({ label: "Project Dashboard", href: "/crm/admin/projects/dashboard" });
      return crumbs;
    }

    if (pathname.includes("/projects")) {
      crumbs.push({ label: "Projects", href: "/crm/admin/projects" });
      if (pathname.includes("/prj-")) {
        crumbs.push({ label: "Project Details", href: pathname });
      }
      return crumbs;
    }

    if (pathname.includes("/tasks") && !pathname.includes("/my-tasks")) {
      crumbs.push({ label: "Projects", href: "/crm/admin/projects" });
      crumbs.push({ label: "Tasks", href: "/crm/admin/tasks" });
      return crumbs;
    }

    if (pathname.includes("/team/dashboard")) {
      crumbs.push({ label: "Team", href: "/crm/admin/team/dashboard" });
      crumbs.push({ label: "Team Dashboard", href: "/crm/admin/team/dashboard" });
      return crumbs;
    }

    if (pathname.includes("/team/members")) {
      crumbs.push({ label: "Team", href: "/crm/admin/team/members" });
      crumbs.push({ label: "Team Members", href: "/crm/admin/team/members" });
      return crumbs;
    }

    if (pathname.includes("/team/teams")) {
      crumbs.push({ label: "Team", href: "/crm/admin/team/teams" });
      crumbs.push({ label: "Teams & Roles", href: "/crm/admin/team/teams" });
      return crumbs;
    }

    if (pathname.includes("/team/daily-reports")) {
      crumbs.push({ label: "Team", href: "/crm/admin/team/daily-reports" });
      crumbs.push({ label: "Daily Reports", href: "/crm/admin/team/daily-reports" });
      return crumbs;
    }

    if (pathname.includes("/finance/invoices")) {
      crumbs.push({ label: "Finance", href: "/crm/admin/finance" });
      crumbs.push({ label: "Invoices", href: "/crm/admin/finance/invoices" });
      return crumbs;
    }

    if (pathname.includes("/finance/expenses")) {
      crumbs.push({ label: "Finance", href: "/crm/admin/finance" });
      crumbs.push({ label: "Expenses & Payments", href: "/crm/admin/finance/expenses" });
      return crumbs;
    }

    if (pathname.includes("/finance")) {
      crumbs.push({ label: "Finance", href: "/crm/admin/finance" });
      crumbs.push({ label: "Finance Dashboard", href: "/crm/admin/finance" });
      return crumbs;
    }

    if (pathname.includes("/workspace/notes")) {
      crumbs.push({ label: "Workspace", href: "/crm/admin/workspace/notes" });
      crumbs.push({ label: "Notes", href: "/crm/admin/workspace/notes" });
      return crumbs;
    }

    if (pathname.includes("/workspace/notices")) {
      crumbs.push({ label: "Workspace", href: "/crm/admin/workspace/notices" });
      crumbs.push({ label: "Notice Board", href: "/crm/admin/workspace/notices" });
      return crumbs;
    }

    if (pathname.includes("/notifications")) {
      crumbs.push({ label: "Workspace", href: "/crm/admin/notifications" });
      crumbs.push({ label: "Notifications", href: "/crm/admin/notifications" });
      return crumbs;
    }

    if (pathname.includes("/settings")) {
      crumbs.push({ label: "System", href: "/crm/admin/settings" });
      crumbs.push({ label: "Settings", href: "/crm/admin/settings" });
      return crumbs;
    }

    // Team Portal Breadcrumbs
    if (pathname.includes("/crm/member") || pathname.includes("/team-portal")) {
      crumbs.push({ label: "Employee Portal", href: "/crm/member/my-tasks" });
      if (pathname.includes("/my-tasks")) crumbs.push({ label: "My Tasks", href: pathname });
      if (pathname.includes("/daily-work")) crumbs.push({ label: "Daily Work", href: pathname });
      if (pathname.includes("/attendance")) crumbs.push({ label: "Attendance", href: pathname });
      if (pathname.includes("/team-workload")) crumbs.push({ label: "Team Workload", href: pathname });
      if (pathname.includes("/profile")) crumbs.push({ label: "My Profile", href: pathname });
      return crumbs;
    }

    return [{ label: "TS DEV CRM", href: "/crm/admin" }];
  };

  const breadcrumbs = getBreadcrumbs();
  const currentTitle = breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard";

  const handlePortalSwitch = () => {
    if (portalMode === "admin") {
      setPortalMode("team_member");
      router.push("/crm/member/my-tasks");
    } else {
      setPortalMode("admin");
      router.push("/crm/admin");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md px-4 sm:px-6 md:px-8 flex items-center justify-between shrink-0 w-full">
      {/* Left: Sidebar Toggle & Dynamic Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors"
          title="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile Brand Logo */}
        <Link href="/crm/admin" className="md:hidden flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 p-1 flex items-center justify-center shadow-xs">
            <img src="/logo-removebg.png" alt="TS DEV Logo" className="h-full w-full object-contain" />
          </div>
        </Link>

        {/* Breadcrumb Hierarchy */}
        <nav className="flex items-center gap-1.5 text-xs overflow-hidden">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <div key={idx} className="flex items-center gap-1.5 shrink-0">
                {idx > 0 && <ChevronRight className="h-3 w-3 text-[#94A3B8]" />}
                {isLast ? (
                  <span className="font-bold text-[#0F172A] tracking-tight">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="font-medium text-[#64748B] hover:text-[#2563EB] transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Right: Quick Action, Search, Notifications, Portal Switch & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Bar Button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden sm:flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-xs text-[#64748B] hover:border-[#2563EB]/40 hover:bg-white transition-all shadow-2xs"
          title="Search anything (Ctrl+K)"
        >
          <Search className="h-3.5 w-3.5 text-[#94A3B8]" />
          <span>Quick search...</span>
          <kbd className="inline-flex items-center gap-0.5 rounded-md border border-[#E2E8F0] bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#64748B]">
            ⌘K
          </kbd>
        </button>

        {/* Quick Action Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
            className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
            title="Create new record"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New</span>
          </button>

          {isQuickActionOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsQuickActionOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-[#E2E8F0] bg-white p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                <Link
                  href="/crm/admin/enquiries"
                  onClick={() => setIsQuickActionOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#0F172A] hover:bg-blue-50 hover:text-[#2563EB] transition-colors"
                >
                  <UserPlus className="h-4 w-4 text-[#2563EB]" />
                  <span>New Lead / Enquiry</span>
                </Link>
                <Link
                  href="/crm/admin/follow-ups"
                  onClick={() => setIsQuickActionOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#0F172A] hover:bg-blue-50 hover:text-[#2563EB] transition-colors"
                >
                  <CalendarPlus className="h-4 w-4 text-amber-500" />
                  <span>Schedule Follow-up</span>
                </Link>
                <Link
                  href="/crm/admin/tasks"
                  onClick={() => setIsQuickActionOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#0F172A] hover:bg-blue-50 hover:text-[#2563EB] transition-colors"
                >
                  <CheckSquare className="h-4 w-4 text-[#16A34A]" />
                  <span>Create Task</span>
                </Link>
                <Link
                  href="/crm/admin/projects"
                  onClick={() => setIsQuickActionOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#0F172A] hover:bg-blue-50 hover:text-[#2563EB] transition-colors"
                >
                  <FolderPlus className="h-4 w-4 text-indigo-500" />
                  <span>New Project</span>
                </Link>
                <Link
                  href="/crm/admin/finance/invoices"
                  onClick={() => setIsQuickActionOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#0F172A] hover:bg-blue-50 hover:text-[#2563EB] transition-colors"
                >
                  <FilePlus className="h-4 w-4 text-emerald-600" />
                  <span>Generate Invoice</span>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Notifications Bell */}
        <button
          onClick={() => setNotificationDrawerOpen(true)}
          className="relative rounded-xl border border-[#E2E8F0] bg-white p-2 text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#0F172A]"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#DC2626] text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile & Account */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-[#E2E8F0]">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.fullName}
            className="h-8 w-8 rounded-full object-cover border border-[#E2E8F0] shrink-0"
          />
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-[#0F172A] leading-tight truncate max-w-[130px]">
              {currentUser.fullName}
            </span>
            <span className="text-[10px] font-medium text-[#64748B]">
              {portalMode === "admin" ? "Admin" : currentUser.role}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
