"use client";

import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, Shield, Users, ArrowRightLeft, Menu, LogOut, UserCheck } from "lucide-react";
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
    setCurrentUserId,
    toggleSidebar,
    sidebarCollapsed,
    logout,
  } = useAppStore();

  if (pathname === "/login") return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const getPageTitle = () => {
    if (pathname === "/" || pathname === "/crm/admin") return "Dashboard";

    // Quotations & Agreements
    if (pathname.includes("/projects/documents")) return "Quotations & Agreements";

    // Enquiries
    if (pathname.includes("/enquiries")) {
      if (pathname.includes("/enq-")) return "Enquiry Details";
      return "Enquiries";
    }

    // Projects
    if (pathname.includes("/projects")) {
      if (pathname.includes("/prj-")) return "Project Workspace";
      return "Projects";
    }

    // Tasks
    if (pathname.includes("/tasks") && !pathname.includes("/my-tasks")) {
      if (pathname.includes("/tsk-")) return "Task Detail";
      return "Tasks";
    }

    // Team
    if (pathname.includes("/team/dashboard")) return "Team Dashboard";
    if (pathname.includes("/team/members")) {
      if (pathname.includes("/usr-")) return "Team Member Profile";
      return "Team Members";
    }
    if (pathname.includes("/team/teams")) return "Teams & Roles";

    // Finance
    if (pathname.includes("/finance/invoices")) return "Invoices";
    if (pathname.includes("/finance")) return "Finance Dashboard";

    // Settings
    if (pathname.includes("/settings")) return "System Settings";

    // Member portal routes
    if (pathname.includes("/my-tasks")) return "My Tasks";
    if (pathname.includes("/daily-work")) return "Daily Work";
    if (pathname.includes("/attendance")) return "Attendance";
    if (pathname.includes("/team-workload")) return "Team Workload";
    if (pathname.includes("/profile")) return "Member Profile";
    if (pathname.includes("/notifications")) return "Notifications";

    return "TS DEV CRM";
  };

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
    <header className="sticky top-0 z-30 h-16 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md px-6 md:px-8 flex items-center justify-between shrink-0 w-full">
      {/* Left: Title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors"
          title="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-bold text-[#0F172A] tracking-tight">{getPageTitle()}</h1>
          <span className="text-slate-300">/</span>
          <span className="text-xs text-[#64748B] font-medium">
            {portalMode === "admin" ? "Admin Portal" : "Team Member Portal"}
          </span>
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3">
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

        {/* Account & Logout */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#E2E8F0]">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.fullName}
            className="h-8 w-8 rounded-full object-cover border border-[#E2E8F0]"
          />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-[#0F172A] leading-tight">
              {currentUser.fullName}
            </span>
            <span className="text-[10px] font-medium text-[#64748B]">
              {portalMode === "admin" ? "Super Admin" : currentUser.role}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors ml-1 cursor-pointer"
            title="Log out / Change account"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
