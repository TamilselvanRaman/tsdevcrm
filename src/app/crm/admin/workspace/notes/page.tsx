"use client";

import { useState } from "react";
import { StickyNote, Plus, Pin, User, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAppStore } from "@/store/useAppStore";
import { NoteItem } from "@/types";

export default function NotesWorkspacePage() {
  const { notes, addNote, updateNote, deleteNote, togglePinNote, users } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  // Add Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<NoteItem["category"]>("General Info");
  const [isPinned, setIsPinned] = useState(false);

  // Edit Form State
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState<NoteItem["category"]>("General Info");
  const [editIsPinned, setEditIsPinned] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleOpenAddModal = () => {
    setTitle("");
    setContent("");
    setCategory("General Info");
    setIsPinned(false);
    setIsAddModalOpen(true);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addNote({
      title: title.trim(),
      content: content.trim(),
      category,
      author: users[0]?.fullName || "Admin",
      isPinned,
      date: new Date().toISOString().split("T")[0],
    });

    setIsAddModalOpen(false);
    showToast(`Note "${title}" created.`);
  };

  const handleOpenEditModal = (note: NoteItem) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditCategory(note.category);
    setEditIsPinned(note.isPinned);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote || !editTitle.trim()) return;

    updateNote(editingNote.id, {
      title: editTitle.trim(),
      content: editContent.trim(),
      category: editCategory,
      isPinned: editIsPinned,
    });

    showToast(`Note "${editTitle}" updated.`);
    setEditingNote(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingId) return;
    deleteNote(deletingId);
    showToast("Note deleted successfully.");
    setDeletingId(null);
  };

  const categories = [
    "All",
    "General Info",
    "Technical Note",
    "Client Requirement",
    "Meeting Minutes",
    "Internal Policy",
  ];

  const filteredNotes = notes
    .filter((n) => {
      if (selectedCategory === "All") return true;
      return n.category === selectedCategory;
    })
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

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
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Notes Workspace</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Internal team documentation, strategy notes, client takeaways, and shared ideas.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Create Note</span>
        </button>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#2563EB] text-white shadow-xs"
                : "bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title="No notes created yet"
          description="Create your first strategy note, client takeaway, or project idea."
          actionLabel="Create Note"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-3 hover:border-[#2563EB]/40 hover:shadow-sm transition-all relative flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                    {note.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => togglePinNote(note.id)}
                      title={note.isPinned ? "Unpin note" : "Pin note"}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                        note.isPinned ? "text-amber-500 hover:bg-amber-50" : "text-[#94A3B8] hover:bg-slate-100"
                      }`}
                    >
                      <Pin className={`h-3.5 w-3.5 ${note.isPinned ? "fill-amber-500" : ""}`} />
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(note)}
                      title="Edit note"
                      className="p-1 text-[#94A3B8] hover:text-[#2563EB] hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(note.id)}
                      title="Delete note"
                      className="p-1 text-[#94A3B8] hover:text-[#DC2626] hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-sm text-[#0F172A]">{note.title}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed whitespace-pre-line line-clamp-6">
                  {note.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9] text-[11px] text-[#94A3B8]">
                <span className="flex items-center gap-1 font-medium text-[#64748B]">
                  <User className="h-3 w-3" />
                  {note.author}
                </span>
                <span>{note.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Create New Note"
          subtitle="Document key takeaways, specs, meeting notes, or ideas."
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
                onClick={handleCreateNote}
                className="rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
              >
                Save Note
              </button>
            </>
          }
        >
          <form onSubmit={handleCreateNote} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Note Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Client Design System Requirements"
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as NoteItem["category"])}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden"
                >
                  <option value="General Info">General Info</option>
                  <option value="Technical Note">Technical Note</option>
                  <option value="Client Requirement">Client Requirement</option>
                  <option value="Meeting Minutes">Meeting Minutes</option>
                  <option value="Internal Policy">Internal Policy</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 text-xs font-medium text-[#0F172A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="h-4 w-4 rounded-md border-[#CBD5E1] text-[#2563EB]"
                  />
                  <span>Pin this note to the top</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note details here..."
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {editingNote && (
        <Modal
          isOpen={!!editingNote}
          onClose={() => setEditingNote(null)}
          title="Edit Note"
          subtitle="Update note content or classification."
          footer={
            <>
              <button
                type="button"
                onClick={() => setEditingNote(null)}
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
                Note Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as NoteItem["category"])}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0F172A] focus:outline-hidden"
                >
                  <option value="General Info">General Info</option>
                  <option value="Technical Note">Technical Note</option>
                  <option value="Client Requirement">Client Requirement</option>
                  <option value="Meeting Minutes">Meeting Minutes</option>
                  <option value="Internal Policy">Internal Policy</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 text-xs font-medium text-[#0F172A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsPinned}
                    onChange={(e) => setEditIsPinned(e.target.checked)}
                    className="h-4 w-4 rounded-md border-[#CBD5E1] text-[#2563EB]"
                  />
                  <span>Pin this note to the top</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Content <span className="text-red-500">*</span>
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
          title="Delete Note?"
          message="Are you sure you want to permanently delete this note? This action cannot be reversed."
          confirmLabel="Delete Note"
          variant="danger"
        />
      )}
    </div>
  );
}
