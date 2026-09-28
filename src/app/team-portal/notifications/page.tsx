"use client";

import { useAppStore } from "@/store/useAppStore";
import { Bell, CheckCircle2 } from "lucide-react";

export default function TeamNotificationsPage() {
  const { notifications, markNotificationRead } = useAppStore();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Notifications</h1>
        <p className="text-xs text-[#64748B] mt-0.5">Your updates, task assignments and system alerts.</p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markNotificationRead(n.id)}
            className={`p-4 rounded-xl border transition-colors cursor-pointer text-xs space-y-1 ${
              n.isRead
                ? "border-[#E2E8F0] bg-white text-[#64748B]"
                : "border-blue-200 bg-blue-50/50 text-[#0F172A] font-medium"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#0F172A]">{n.title}</span>
              <span className="text-[10px] text-[#64748B]">{n.timestamp}</span>
            </div>
            <p className="text-xs text-[#64748B]">{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
