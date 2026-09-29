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
  UserCheck,
  Building2,
  FileSignature,
  FileText,
  CreditCard,
  StickyNote,
  Megaphone,
  Code2,
  LogOut,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { clsx } from "clsx";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    portalMode,
    setPortalMode,
    sidebarCollapsed,
    logout,
    enquiries,
    tasks,
  } = useAppStore();

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

  const activeTasksCount = tasks.filter((t) => t.status !== "COMPLETED").length;
  const newLeadsCount = enquiries.filter((e) => e.status === "New").length;

  const adminSections = [
    {
      heading: "OVERVIEW",
      items: [
        {
          label: "Dashboard",
          href: "/crm/admin",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      heading: "CRM MANAGEMENT",
      items: [
        {
          label: "Enquiries / Leads",
          href: "/crm/admin/enquiries",
          icon: MessageSquare,
          badge: newLeadsCount > 0 ? `${newLeadsCount} New` : undefined,
          badgeVariant: "blue",
        },
        {
          label: "Follow-ups",
          href: "/crm/admin/follow-ups",
          icon: CalendarCheck,
        },
        {
          label: "Clients",
          href: "/crm/admin/clients",
          icon: Building2,
        },
        {
          label: "Quotations & Agreements",
          href: "/crm/admin/projects/documents",
          icon: FileSignature,
        },
      ],
    },
    {
      heading: "PROJECT MANAGEMENT",
      items: [
        {
          label: "Projects",
          href: "/crm/admin/projects",
          icon: FolderKanban,
        },
        {
          label: "Tasks",
          href: "/crm/admin/tasks",
          icon: CheckSquare,
          badge: activeTasksCount > 0 ? `${activeTasksCount}` : undefined,
          badgeVariant: "slate",
        },
        {
          label: "Project Dashboard",
          href: "/crm/admin/projects/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      heading: "TEAM MANAGEMENT",
      items: [
        {
          label: "Team Dashboard",
          href: "/crm/admin/team/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Team Members",
          href: "/crm/admin/team/members",
          icon: Users,
        },
        {
          label: "Teams & Roles",
          href: "/crm/admin/team/teams",
          icon: Shield,
        },
        {
          label: "Daily Reports",
          href: "/crm/admin/team/daily-reports",
          icon: Clock,
        },
      ],
    },
    {
      heading: "FINANCE",
      items: [
        {
          label: "Finance Dashboard",
          href: "/crm/admin/finance",
          icon: IndianRupee,
        },
        {
          label: "Invoices",
          href: "/crm/admin/finance/invoices",
          icon: FileText,
        },
        {
          label: "Expenses & Payments",
          href: "/crm/admin/finance/expenses",
          icon: CreditCard,
        },
      ],
    },
    {
      heading: "WORKSPACE",
      items: [
        {
          label: "Notes",
          href: "/crm/admin/workspace/notes",
          icon: StickyNote,
        },
        {
          label: "Notice Board",
          href: "/crm/admin/workspace/notices",
          icon: Megaphone,
        },
      ],
    },
  ];

  interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeVariant?: string;
  }

  const teamNav: NavItem[] = [
    { label: "Dashboard", href: "/crm/member/dashboard", icon: LayoutDashboard },
    { label: "My Tasks", href: "/crm/member/my-tasks", icon: CheckSquare, badge: activeTasksCount > 0 ? `${activeTasksCount}` : undefined },
    { label: "Daily Work", href: "/crm/member/daily-work", icon: CalendarCheck },
    { label: "Attendance", href: "/crm/member/attendance", icon: Clock },
    { label: "Team Workload", href: "/crm/member/team-workload", icon: Users },
    { label: "Profile", href: "/crm/member/profile", icon: UserCheck },
  ];

  const isNavActive = (href: string) => {
    if (href === "/crm/member/dashboard") {
      return pathname === "/crm/member/dashboard" || pathname === "/crm/member";
    }

    if (href === "/crm/admin") {
      return pathname === "/crm/admin" || pathname === "/";
    }

    if (href === "/crm/admin/projects/documents") {
      return pathname.includes("/projects/documents");
    }

    if (href === "/crm/admin/projects/dashboard") {
      return pathname.includes("/projects/dashboard");
    }

    if (href === "/crm/admin/projects") {
      if (pathname.includes("/projects/documents") || pathname.includes("/projects/dashboard")) {
        return false;
      }
      return (
        pathname === "/crm/admin/projects" ||
        pathname.startsWith("/crm/admin/projects/") ||
        pathname === "/projects" ||
        pathname.startsWith("/projects/")
      );
    }

    if (href === "/crm/admin/tasks") {
      return (
        (pathname.includes("/tasks") && !pathname.includes("/my-tasks")) ||
        pathname.startsWith("/tasks/")
      );
    }

    if (href === "/crm/admin/finance/invoices") {
      return pathname.includes("/finance/invoices");
    }

    if (href === "/crm/admin/finance/expenses") {
      return pathname.includes("/finance/expenses");
    }

    if (href === "/crm/admin/finance") {
      if (pathname.includes("/finance/invoices") || pathname.includes("/finance/expenses")) {
        return false;
      }
      return pathname === "/crm/admin/finance" || pathname === "/finance";
    }

    if (href === "/crm/admin/team/daily-reports") {
      return pathname.includes("/team/daily-reports");
    }

    if (href === "/crm/admin/team/dashboard") {
      return pathname.includes("/team/dashboard");
    }

    if (href === "/crm/admin/team/members") {
      return pathname.includes("/team/members");
    }

    if (href === "/crm/admin/team/teams") {
      return pathname.includes("/team/teams");
    }

    if (href === "/crm/admin/enquiries") {
      return pathname.includes("/enquiries") || pathname.includes("/crm/leads");
    }

    if (href === "/crm/admin/follow-ups") {
      return pathname.includes("/follow-ups");
    }

    if (href === "/crm/admin/clients") {
      return pathname.includes("/clients");
    }

    if (href === "/crm/admin/workspace/notes") {
      return pathname.includes("/workspace/notes") || pathname.includes("/notes");
    }

    if (href === "/crm/admin/workspace/notices") {
      return pathname.includes("/workspace/notices") || pathname.includes("/notices");
    }

    if (href === "/crm/admin/settings") {
      return pathname.includes("/settings");
    }

    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 z-40 h-screen border-r border-[#E2E8F0] bg-white transition-all duration-200 flex flex-col justify-between select-none shadow-2xs",
        sidebarCollapsed ? "w-16" : "w-[250px]"
      )}
    >
      {/* Header / Brand */}
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex h-16 items-center gap-3 border-b border-[#E2E8F0] px-3.5 shrink-0 bg-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 overflow-hidden shadow-xs shrink-0 border border-slate-800 p-1">
            <img src="/logo-removebg.png" alt="TS DEV Logo" className="h-full w-full object-contain" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-[#0F172A] text-sm tracking-tight leading-none flex items-center gap-1.5">
                TS DEV CRM
                <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
              </span>
              <span className="text-[11px] text-[#64748B] tracking-tight mt-1 truncate font-medium">
                Operations & Management
              </span>
            </div>
          )}
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs scrollbar-thin">
          {portalMode === "admin" ? (
            adminSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-0.5">
                {!sidebarCollapsed && (
                  <div className="px-2.5 pt-2 pb-1 text-[10px] font-bold tracking-wider text-[#94A3B8] uppercase">
                    {section.heading}
                  </div>
                )}
                {section.items.map((item, iIdx) => {
                  const active = isNavActive(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={iIdx}
                      href={item.href}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={clsx(
                        "group flex items-center justify-between gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium transition-all",
                        active
                          ? "bg-[#2563EB] text-white font-semibold shadow-xs"
                          : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={clsx(
                            "h-4 w-4 shrink-0 transition-colors",
                            active
                              ? "text-white"
                              : "text-[#64748B] group-hover:text-[#2563EB]"
                          )}
                        />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!sidebarCollapsed && item.badge && (
                        <span
                          className={clsx(
                            "px-1.5 py-0.5 rounded-md text-[10px] font-bold shrink-0",
                            active
                              ? "bg-white/20 text-white"
                              : item.badgeVariant === "blue"
                              ? "bg-blue-50 text-[#2563EB] border border-blue-100"
                              : item.badgeVariant === "rose"
                              ? "bg-red-50 text-[#DC2626] border border-red-100"
                              : "bg-slate-100 text-slate-700"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))
          ) : (
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-2.5 pt-2 pb-1 text-[10px] font-bold tracking-wider text-[#94A3B8] uppercase">
                  My Operations
                </div>
              )}
              {teamNav.map((item, idx) => {
                const active = isNavActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={clsx(
                      "group flex items-center justify-between gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium transition-all",
                      active
                        ? "bg-[#2563EB] text-white font-semibold shadow-xs"
                        : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={clsx(
                          "h-4 w-4 shrink-0",
                          active ? "text-white" : "text-[#64748B] group-hover:text-[#2563EB]"
                        )}
                      />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!sidebarCollapsed && item.badge && (
                      <span
                        className={clsx(
                          "px-1.5 py-0.5 rounded-md text-[10px] font-bold shrink-0",
                          active
                            ? "bg-white/20 text-white"
                            : "bg-red-50 text-[#DC2626] border border-red-100"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer / Settings & Logout */}
        <div className="border-t border-[#E2E8F0] p-3 space-y-1 shrink-0 bg-white">
          {portalMode === "admin" && (
            <Link
              href="/crm/admin/settings"
              title={sidebarCollapsed ? "Settings" : undefined}
              className={clsx(
                "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium transition-colors",
                isNavActive("/crm/admin/settings")
                  ? "bg-[#2563EB] text-white font-semibold shadow-xs"
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
            title={sidebarCollapsed ? "Logout" : undefined}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-[#DC2626] hover:bg-red-50 active:bg-red-100 transition-all cursor-pointer select-none"
          >
            <LogOut className="h-4 w-4 shrink-0 text-[#DC2626]" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
