"use client";

import { useState } from "react";
import { Megaphone, Plus, Users, CheckCircle2, AlertTriangle, Edit2, Trash2 } from "lucide-react";
import { MetricCard } from "@/components/ui/MetricCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAppStore } from "@/store/useAppStore";
import { NoticeItem } from "@/types";

export default function NoticeBoardPage() {
  const { notices, addNotice, updateNotice, deleteNotice, acknowledgeNotice, users } = useAppStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  // Add Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<NoticeItem["category"]>("Team Announcements");
  const [priority, setPriority] = useState<NoticeItem["priority"]>("Medium");
  const [targetDepartment, setTargetDepartment] = useState("All Staff");

  // Edit Form State
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState<NoticeItem["category"]>("Team Announcements");
  const [editPriority, setEditPriority] = useState<NoticeItem["priority"]>("Medium");
  const [editTargetDepartment, setEditTargetDepartment] = useState("All Staff");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleOpenAddModal = () => {
    setTitle("");
    setContent("");
    setCategory("Team Announcements");
    setPriority("Medium");
    setTargetDepartment("All Staff");
    setIsAddModalOpen(true);
  };

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addNotice({
      title: title.trim(),
      content: content.trim(),
      category,
      priority,
      targetDepartment,
      publishedDate: new Date().toISOString().split("T")[0],
      author: users[0]?.fullName || "Management",
      acknowledgements: 0,
    });

    setIsAddModalOpen(false);
    showToast(`Notice "${title}" published.`);
  };

  const handleOpenEditModal = (notice: NoticeItem) => {
    setEditingNotice(notice);
    setEditTitle(notice.title);
    setEditContent(notice.content);
    setEditCategory(notice.category);
    setEditPriority(notice.priority);
    setEditTargetDepartment(notice.targetDepartment);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice || !editTitle.trim()) return;

    updateNotice(editingNotice.id, {
      title: editTitle.trim(),
      content: editContent.trim(),
      category: editCategory,
      priority: editPriority,
      targetDepartment: editTargetDepartment,
    });

    showToast(`Notice "${editTitle}" updated.`);
    setEditingNotice(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingId) return;
    deleteNotice(deletingId);
    showToast("Announcement deleted.");
    setDeletingId(null);
  };

  const handleAcknowledge = (id: string) => {
    acknowledgeNotice(id);
    showToast("Read confirmation recorded.");
  };

  const highPriorityCount = notices.filter((n) => n.priority === "High").length;
  const totalAcknowledgements = notices.reduce((acc, n) => acc + n.acknowledgements, 0);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Company Notice Board</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Broadcast official agency announcements, release notes, and policy updates.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Post Announcement</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          title="Active Notices"
          value={notices.length}
          subtext="Published updates"
          icon={Megaphone}
          variant="blue"
        />
        <MetricCard
          title="High Priority"
          value={highPriorityCount}
          subtext="Immediate staff action"
          icon={AlertTriangle}
          variant="rose"
        />
        <MetricCard
          title="Read Confirmations"
          value={totalAcknowledgements}
          subtext="Staff acknowledged"
          icon={CheckCircle2}
          variant="emerald"
        />
        <MetricCard
          title="Target Groups"
          value="All Teams"
          subtext="Company-wide reach"
          icon={Users}
          variant="indigo"
        />
      </div>

      {/* Notices Feed */}
      {notices.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No active announcements"
          description="There are no company notices posted yet. Click '+ Post Announcement' to broadcast an update to your staff."
          actionLabel="Post Announcement"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xs space-y-4 hover:border-[#2563EB]/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                      notice.priority === "High"
                        ? "bg-red-50 text-[#DC2626] border-red-200"
                        : notice.priority === "Medium"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-blue-50 text-[#2563EB] border-blue-200"
                    }`}
                  >
                    {notice.priority} Priority
                  </span>
                  <span className="text-[10px] font-bold text-[#64748B] bg-slate-100 px-2 py-0.5 rounded-md">
                    {notice.category}
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">
                    Target: <strong className="text-[#0F172A]">{notice.targetDepartment}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#94A3B8]">Posted on {notice.publishedDate}</span>
                  <button
                    onClick={() => handleOpenEditModal(notice)}
                    title="Edit Notice"
                    className="p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingId(notice.id)}
                    title="Delete Notice"
                    className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base text-[#0F172A]">{notice.title}</h3>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed whitespace-pre-line">
                  {notice.content}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[#F1F5F9]">
                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                  <span>Author: <strong>{notice.author}</strong></span>
                  <span>•</span>
                  <span><strong>{notice.acknowledgements}</strong> team members acknowledged</span>
                </div>

                <button
                  onClick={() => handleAcknowledge(notice.id)}
                  className="flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] px-3.5 py-1.5 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" />
                  <span>Acknowledge Read</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Notice Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Post Announcement"
          subtitle="Publish a formal notice to all team members or specific departments."
          footer={
            <>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePostNotice}
                className="rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
              >
                Publish Notice
              </button>
            </>
          }
        >
          <form onSubmit={handlePostNotice} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Announcement Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Q4 Company Goals & Performance Review Schedule"
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as NoticeItem["category"])}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden"
                >
                  <option value="Team Announcements">Team Announcements</option>
                  <option value="Policy Update">Policy Update</option>
                  <option value="Holiday Notice">Holiday Notice</option>
                  <option value="Project Kickoff">Project Kickoff</option>
                  <option value="Client Feedback">Client Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as NoticeItem["priority"])}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden"
                >
                  <option value="High">High (Urgent)</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Target Department</label>
                <select
                  value={targetDepartment}
                  onChange={(e) => setTargetDepartment(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden"
                >
                  <option value="All Staff">All Staff</option>
                  <option value="Development Team">Development Team</option>
                  <option value="Design Team">Design Team</option>
                  <option value="Marketing Team">Marketing Team</option>
                  <option value="Management">Management</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Notice Content <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write announcement details..."
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Notice Modal */}
      {editingNotice && (
        <Modal
          isOpen={!!editingNotice}
          onClose={() => setEditingNotice(null)}
          title="Edit Announcement"
          subtitle="Update notice details, priority, or targeted audience."
          footer={
            <>
              <button
                type="button"
                onClick={() => setEditingNotice(null)}
                className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </>
          }
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Announcement Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as NoticeItem["category"])}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden"
                >
                  <option value="Team Announcements">Team Announcements</option>
                  <option value="Policy Update">Policy Update</option>
                  <option value="Holiday Notice">Holiday Notice</option>
                  <option value="Project Kickoff">Project Kickoff</option>
                  <option value="Client Feedback">Client Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Priority</label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as NoticeItem["priority"])}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden"
                >
                  <option value="High">High (Urgent)</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Target Department</label>
                <select
                  value={editTargetDepartment}
                  onChange={(e) => setEditTargetDepartment(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden"
                >
                  <option value="All Staff">All Staff</option>
                  <option value="Development Team">Development Team</option>
                  <option value="Design Team">Design Team</option>
                  <option value="Marketing Team">Marketing Team</option>
                  <option value="Management">Management</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Notice Content <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingId && (
        <ConfirmDialog
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Announcement?"
          message="Are you sure you want to delete this company announcement?"
          confirmLabel="Delete Notice"
          variant="danger"
        />
      )}
    </div>
  );
}
