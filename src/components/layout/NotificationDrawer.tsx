"use client";

import { X, Bell, Check, Info } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { clsx } from "clsx";

export function NotificationDrawer() {
  const { notificationDrawerOpen, setNotificationDrawerOpen, notifications, markNotificationRead } = useAppStore();

  if (!notificationDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/30 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="w-full max-w-sm border-l border-[#E2E8F0] bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3.5">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#2563EB]" />
            <h3 className="font-bold text-sm text-[#0F172A]">Notifications</h3>
          </div>
          <button
            onClick={() => setNotificationDrawerOpen(false)}
            className="rounded-lg p-1 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#64748B]">No new notifications</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={clsx(
                  "p-3 rounded-xl border transition-colors cursor-pointer text-xs space-y-1",
                  n.isRead
                    ? "border-[#E2E8F0] bg-white text-[#64748B]"
                    : "border-blue-200 bg-blue-50/50 text-[#0F172A] font-medium"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#0F172A]">{n.title}</span>
                  <span className="text-[10px] text-[#64748B]">{n.timestamp}</span>
                </div>
                <p className="text-xs text-[#64748B] leading-snug">{n.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
