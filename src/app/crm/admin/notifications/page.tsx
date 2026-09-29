"use client";

import { useState } from "react";
import { Bell, CheckCheck, Trash2, Filter, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function AdminNotificationsPage() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearAllNotifications,
  } = useAppStore();

  const [filter, setFilter] = useState<"all" | "unread" | "task" | "finance" | "enquiry" | "team">("all");
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "team") return n.type === "team";
    if (filter === "task") return n.type === "task";
    if (filter === "finance") return n.type === "finance";
    if (filter === "enquiry") return n.type === "enquiry";
    return true;
  });

  const handleClearAllConfirm = () => {
    clearAllNotifications();
    setConfirmClearOpen(false);
    showToast("All notifications cleared.");
  };

  const handleDeleteOne = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNotification(id);
    showToast("Notification deleted.");
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#0F172A] text-white px-4 py-3 font-semibold shadow-lg text-xs animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-[#16A34A]" /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Notification Centre</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            System activity alerts, lead assignments, invoice payouts, and task review updates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              markAllNotificationsRead();
              showToast("All marked as read.");
            }}
            disabled={notifications.length === 0}
            className="flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] disabled:opacity-50 transition-colors"
          >
            <CheckCheck className="h-4 w-4 text-[#2563EB]" />
            <span>Mark All as Read</span>
          </button>
          <button
            onClick={() => setConfirmClearOpen(true)}
            disabled={notifications.length === 0}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-xs font-semibold hover:bg-red-100 disabled:opacity-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(
          [
            { id: "all", label: "All" },
            { id: "unread", label: "Unread" },
            { id: "task", label: "Tasks" },
            { id: "team", label: "Team" },
            { id: "finance", label: "Finance" },
            { id: "enquiry", label: "Enquiries" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === t.id
                ? "bg-[#2563EB] text-white shadow-2xs"
                : "bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="You have no notifications or activity alerts matching the selected filter."
            />
          </div>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer group hover:bg-slate-50/70 ${
                  !notif.isRead ? "bg-blue-50/30" : ""
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                      !notif.isRead ? "bg-[#2563EB]" : "bg-transparent"
                    }`}
                  />
                  <div>
                    <h3
                      className={`text-xs ${
                        !notif.isRead ? "font-bold text-[#0F172A]" : "font-semibold text-slate-700"
                      }`}
                    >
                      {notif.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#64748B] leading-relaxed">{notif.message}</p>
                    <span className="mt-1 inline-block text-[10px] text-[#94A3B8]">
                      {notif.timestamp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 text-slate-600">
                    {notif.type}
                  </span>
                  <button
                    onClick={(e) => handleDeleteOne(e, notif.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-all"
                    title="Delete notification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clear All Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmClearOpen}
        title="Clear All Notifications"
        description="Are you sure you want to dismiss and clear all notification alerts? This action cannot be undone."
        confirmText="Clear All"
        variant="danger"
        onConfirm={handleClearAllConfirm}
        onClose={() => setConfirmClearOpen(false)}
      />
    </div>
  );
}
