"use client";

import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { NotificationDrawer } from "@/components/layout/NotificationDrawer";
import { FirebaseInitializer } from "@/components/FirebaseInitializer";
import { clsx } from "clsx";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { sidebarCollapsed } = useAppStore();

  if (pathname === "/login") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
        <FirebaseInitializer />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex">
      <FirebaseInitializer />
      <Sidebar />
      <div
        className={clsx(
          "flex-1 flex flex-col min-w-0 transition-all duration-200",
          sidebarCollapsed ? "ml-16" : "ml-[250px]"
        )}
      >
        <Header />
        <CommandPalette />
        <NotificationDrawer />
        <main className="flex-1 p-6 md:p-8 space-y-6 w-full">
          <div className="w-full space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
