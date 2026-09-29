"use client";

import { useState } from "react";
import { Bell, CheckCheck, Trash2, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function TeamNotificationsPage() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearAllNotifications,
  } = useAppStore();

  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleClearAll = () => {
    clearAllNotifications();
    setConfirmClearOpen(false);
    showToast("All notifications cleared.");
  };

  const handleDeleteOne = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNotification(id);
    showToast("Notification removed.");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#0F172A] text-white px-4 py-3 font-semibold shadow-lg text-xs animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-[#16A34A]" /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Notifications</h1>
          <p className="text-xs text-[#64748B] mt-0.5">Your updates, task assignments and system alerts.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              markAllNotificationsRead();
              showToast("All marked as read.");
            }}
            disabled={notifications.length === 0}
            className="flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] disabled:opacity-50 transition-colors"
          >
            <CheckCheck className="h-4 w-4 text-[#2563EB]" />
            <span>Mark All Read</span>
          </button>
          <button
            onClick={() => setConfirmClearOpen(true)}
            disabled={notifications.length === 0}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-1.5 text-xs font-semibold hover:bg-red-100 disabled:opacity-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="You have caught up with all team notifications and alerts."
          />
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 rounded-xl border transition-colors cursor-pointer text-xs space-y-1 relative group ${
                n.isRead
                  ? "border-[#E2E8F0] bg-white text-[#64748B]"
                  : "border-blue-200 bg-blue-50/50 text-[#0F172A] font-medium"
              }`}
            >
              <div className="flex items-center justify-between pr-8">
                <span className="font-bold text-sm text-[#0F172A]">{n.title}</span>
                <span className="text-[10px] text-[#64748B]">{n.timestamp}</span>
              </div>
              <p className="text-xs text-[#64748B]">{n.message}</p>

              <button
                onClick={(e) => handleDeleteOne(e, n.id)}
                className="absolute top-3.5 right-3 opacity-0 group-hover:opacity-100 p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-all"
                title="Delete notification"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmClearOpen}
        title="Clear All Notifications"
        description="Are you sure you want to dismiss all notifications? This cannot be undone."
        confirmText="Clear All"
        variant="danger"
        onConfirm={handleClearAll}
        onClose={() => setConfirmClearOpen(false)}
      />
    </div>
  );
}
