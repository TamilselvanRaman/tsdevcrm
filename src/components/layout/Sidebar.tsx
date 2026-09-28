"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  IndianRupee,
  Settings,
  CalendarCheck,
  Clock,
  Shield,
  MessageSquare,
  User as UserIcon,
  Bell,
  Code2,
  LogOut,
  FileSignature,
  FileText,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { clsx } from "clsx";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { portalMode, setPortalMode, sidebarCollapsed, logout } = useAppStore();

  useEffect(() => {
    if (pathname.startsWith("/crm/member") || pathname.startsWith("/team-portal")) {
      if (portalMode !== "team_member") {
        setPortalMode("team_member");
      }
    } else if (
      pathname.startsWith("/crm/admin") ||
      pathname === "/" ||
      pathname.startsWith("/crm/enquiries") ||
      pathname.startsWith("/projects") ||
      pathname.startsWith("/tasks") ||
      pathname.startsWith("/team/") ||
      pathname.startsWith("/finance") ||
      pathname.startsWith("/settings")
    ) {
      if (portalMode !== "admin") {
        setPortalMode("admin");
      }
    }
  }, [pathname, portalMode, setPortalMode]);

  if (pathname === "/login") return null;

  const adminNav = [
    {
      label: "Dashboard",
      href: "/crm/admin",
      icon: LayoutDashboard,
    },
    {
      label: "CRM",
      icon: MessageSquare,
      children: [{ label: "Enquiries", href: "/crm/admin/enquiries", icon: MessageSquare }],
    },
    {
      label: "Projects",
      icon: FolderKanban,
      children: [
        { label: "Projects", href: "/crm/admin/projects", icon: FolderKanban },
        { label: "Tasks", href: "/crm/admin/tasks", icon: CheckSquare },
        { label: "Quotations & Agreements", href: "/crm/admin/projects/documents", icon: FileSignature },
      ],
    },
    {
      label: "Team",
      icon: Users,
      children: [
        { label: "Team Dashboard", href: "/crm/admin/team/dashboard", icon: LayoutDashboard },
        { label: "Team Members", href: "/crm/admin/team/members", icon: UserIcon },
        { label: "Teams & Roles", href: "/crm/admin/team/teams", icon: Shield },
      ],
    },
    {
      label: "Finance",
      icon: IndianRupee,
      children: [
        { label: "Finance Dashboard", href: "/crm/admin/finance", icon: IndianRupee },
        { label: "Invoices", href: "/crm/admin/finance/invoices", icon: FileText },
      ],
    },
  ];

  const teamNav = [
    { label: "My Tasks", href: "/crm/member/my-tasks", icon: CheckSquare },
    { label: "Daily Work", href: "/crm/member/daily-work", icon: CalendarCheck },
    { label: "Attendance", href: "/crm/member/attendance", icon: Clock },
    { label: "Team Workload", href: "/crm/member/team-workload", icon: Users },
    { label: "Profile", href: "/crm/member/profile", icon: UserIcon },
    { label: "Notifications", href: "/crm/member/notifications", icon: Bell },
  ];

  const isNavActive = (href: string) => {
    if (href === "/crm/admin" || href === "/") {
      return pathname === "/crm/admin" || pathname === "/";
    }
    if (pathname === href) return true;

    // Disambiguate sub-routes
    if (href === "/crm/admin/projects/documents" || href === "/projects/documents") {
      return pathname.includes("/projects/documents");
    }
    if (href === "/crm/admin/projects" || href === "/projects") {
      if (pathname.includes("/projects/documents")) return false;
      return (
        pathname === "/crm/admin/projects" ||
        pathname.startsWith("/crm/admin/projects/") ||
        pathname === "/projects" ||
        pathname.startsWith("/projects/")
      );
    }
    if (href === "/crm/admin/tasks" || href === "/tasks") {
      return (
        pathname === "/crm/admin/tasks" ||
        pathname.startsWith("/crm/admin/tasks/") ||
        pathname === "/tasks" ||
        pathname.startsWith("/tasks/")
      );
    }
    if (href === "/crm/admin/finance/invoices" || href === "/finance/invoices") {
      return pathname.includes("/finance/invoices");
    }
    if (href === "/crm/admin/finance" || href === "/finance") {
      if (pathname.includes("/finance/invoices")) return false;
      return (
        pathname === "/crm/admin/finance" ||
        pathname.startsWith("/crm/admin/finance/") ||
        pathname === "/finance" ||
        pathname.startsWith("/finance/")
      );
    }
    if (href === "/crm/admin/team/dashboard" || href === "/team/dashboard") {
      return pathname.includes("/team/dashboard");
    }
    if (href === "/crm/admin/team/members" || href === "/team/members") {
      return pathname.includes("/team/members");
    }
    if (href === "/crm/admin/team/teams" || href === "/team/teams") {
      return pathname.includes("/team/teams");
    }
    if (href === "/crm/admin/enquiries" || href === "/crm/enquiries") {
      return pathname.includes("/enquiries");
    }
    if (href === "/crm/admin/settings" || href === "/settings") {
      return pathname.includes("/settings");
    }

    return pathname.startsWith(href + "/");
  };

  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 z-40 h-screen border-r border-[#E2E8F0] bg-white transition-all duration-200 flex flex-col justify-between select-none",
        sidebarCollapsed ? "w-16" : "w-[250px]"
      )}
    >
      {/* Header / Brand */}
      <div>
        <div className="flex h-16 items-center gap-3 border-b border-[#E2E8F0] px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white font-bold text-sm shadow-sm shrink-0">
            <Code2 className="h-5 w-5" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-[#0F172A] text-sm tracking-tight leading-none">
                TS DEV CRM
              </span>
              <span className="text-[11px] text-[#64748B] tracking-tight mt-0.5 truncate">
                Internal CRM & Team Ops
              </span>
            </div>
          )}
        </div>
        {/* Navigation Section */}
        <div className="px-3 py-2 space-y-1">
          {portalMode === "admin" ? (
            adminNav.map((item, idx) => {
              if (item.children) {
                return (
                  <div key={idx} className="space-y-1">
                    {!sidebarCollapsed && (
                      <div className="flex items-center justify-between px-2 pt-3 pb-1 text-[11px] font-semibold tracking-wider text-[#64748B] uppercase">
                        <span>{item.label}</span>
                      </div>
                    )}
                    {item.children.map((child, cIdx) => {
                      const active = isNavActive(child.href);
                      const ChildIcon = child.icon || item.icon;
                      return (
                        <Link
                          key={cIdx}
                          href={child.href}
                          className={clsx(
                            "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors",
                            active
                              ? "bg-[#2563EB] text-white font-semibold shadow-sm"
                              : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                          )}
                        >
                          <ChildIcon
                            className={clsx("h-4 w-4 shrink-0", active ? "text-white" : "text-[#64748B]")}
                          />
                          {!sidebarCollapsed && <span>{child.label}</span>}
                        </Link>
                      );
                    })}
                  </div>
                );
              }

              const active = isNavActive(item.href);
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors",
                    active
                      ? "bg-[#2563EB] text-white font-semibold shadow-sm"
                      : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                  )}
                >
                  <item.icon
                    className={clsx("h-4 w-4 shrink-0", active ? "text-white" : "text-[#64748B]")}
                  />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })
          ) : (
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-2 pt-2 pb-1 text-[11px] font-semibold tracking-wider text-[#64748B] uppercase">
                  My Workspace
                </div>
              )}
              {teamNav.map((item, idx) => {
                const active = isNavActive(item.href);
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors",
                      active
                        ? "bg-[#2563EB] text-white font-semibold shadow-sm"
                        : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                    )}
                  >
                    <item.icon
                      className={clsx("h-4 w-4 shrink-0", active ? "text-white" : "text-[#64748B]")}
                    />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer / Settings & Profile */}
      <div className="border-t border-[#E2E8F0] p-3 space-y-1">
        {portalMode === "admin" && (
          <Link
            href="/crm/admin/settings"
            className={clsx(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors",
              isNavActive("/crm/admin/settings")
                ? "bg-[#2563EB] text-white font-semibold"
                : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
            )}
          >
            <Settings className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && <span>Settings</span>}
          </Link>
        )}

        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className={clsx(
            "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 active:bg-red-100 transition-all cursor-pointer select-none"
          )}
          title="Logout from CRM"
        >
          <LogOut className="h-4 w-4 shrink-0 text-red-600" />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
