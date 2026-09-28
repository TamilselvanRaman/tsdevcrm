"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckSquare,
  Clock,
  UserCheck,
  AlertTriangle,
  Send,
  Paperclip,
  CheckCircle2,
  MessageSquare,
  Play,
  Check,
  AlertCircle,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { TaskStatus } from "@/types";

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params?.id as string;
  const { tasks, updateTaskStatus, toggleTaskBlock, toggleChecklistItem, addComment, users } = useAppStore();

  const [newComment, setNewComment] = useState("");
  const [blockReasonInput, setBlockReasonInput] = useState("");
  const [showBlockInput, setShowBlockInput] = useState(false);

  const task = tasks.find((t) => t.id === taskId || t.taskKey === taskId) || tasks[0];

  if (!task) {
    return (
      <div className="p-8 text-center text-xs text-[#64748B]">
        Task not found. <Link href="/crm/admin/tasks" className="text-[#2563EB]">Return to task board</Link>
      </div>
    );
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment(task.id, newComment);
    setNewComment("");
  };

  const handleBlockToggle = () => {
    if (!task.isBlocked && !showBlockInput) {
      setShowBlockInput(true);
      return;
    }
    toggleTaskBlock(task.id, blockReasonInput);
    setShowBlockInput(false);
    setBlockReasonInput("");
  };

  return (
    <div className="space-y-6">
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/crm/admin/tasks"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#2563EB]">{task.taskKey}</span>
              <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">{task.title}</h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  task.status === "COMPLETED"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : task.status === "IN PROGRESS"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {task.status}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Project: <span className="font-semibold text-[#0F172A]">{task.projectName}</span> • Assigned to:{" "}
              <span className="font-semibold text-[#0F172A]">{task.assignedToName}</span> • Due:{" "}
              <span className="font-semibold text-[#0F172A]">{task.dueDate}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {task.status !== "IN PROGRESS" && task.status !== "COMPLETED" && (
            <button
              onClick={() => updateTaskStatus(task.id, "IN PROGRESS")}
              className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
            >
              <Play className="h-3.5 w-3.5" />
              <span>Start Work</span>
            </button>
          )}

          {task.status !== "IN REVIEW" && task.status !== "COMPLETED" && (
            <button
              onClick={() => updateTaskStatus(task.id, "IN REVIEW")}
              className="flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Submit for Review</span>
            </button>
          )}

          {task.status !== "COMPLETED" && (
            <button
              onClick={() => updateTaskStatus(task.id, "COMPLETED")}
              className="flex items-center gap-1.5 rounded-xl bg-[#16A34A] px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-xs"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Complete</span>
            </button>
          )}

          <button
            onClick={handleBlockToggle}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold border transition-colors ${
              task.isBlocked
                ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                : "border-[#E2E8F0] bg-white text-[#DC2626] hover:bg-red-50"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{task.isBlocked ? "Unblock Task" : "Mark Blocked"}</span>
          </button>
        </div>
      </div>

      {/* Block Reason Prompt Input */}
      {showBlockInput && (
        <div className="p-3 rounded-xl border border-red-200 bg-red-50 flex items-center gap-3 text-xs">
          <input
            type="text"
            value={blockReasonInput}
            onChange={(e) => setBlockReasonInput(e.target.value)}
            placeholder="Enter reason for blocking task..."
            className="flex-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs text-[#0F172A]"
          />
          <button
            onClick={handleBlockToggle}
            className="rounded-lg bg-[#DC2626] px-3 py-1.5 font-semibold text-white"
          >
            Confirm Block
          </button>
        </div>
      )}

      {/* Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Priority</span>
          <div className="text-base font-bold text-[#DC2626]">{task.priority}</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Estimated Hours</span>
          <div className="text-base font-bold text-[#0F172A]">{task.estimatedHours} Hours</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Actual Hours Logged</span>
          <div className="text-base font-bold text-[#2563EB]">{task.actualHours} Hours</div>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Due Date</span>
          <div className="text-base font-bold text-[#0F172A]">{task.dueDate}</div>
        </div>
      </div>

      {/* Main Grid: Description & Checklist / Discussion & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* DESCRIPTION */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2">Description</h3>
            <p className="text-xs text-[#0F172A] leading-relaxed">{task.description}</p>
          </div>

          {/* CHECKLIST */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2">Checklist</h3>
            <div className="space-y-2 text-xs">
              {task.checklist.length === 0 ? (
                <div className="text-[#64748B]">No items in checklist</div>
              ) : (
                task.checklist.map((item) => (
                  <label
                    key={item.id}
                    onClick={() => toggleChecklistItem(task.id, item.id)}
                    className="flex items-center gap-2.5 p-2 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      readOnly
                      className="h-4 w-4 rounded border-[#E2E8F0] text-[#2563EB]"
                    />
                    <span className={item.done ? "line-through text-[#64748B]" : "font-medium text-[#0F172A]"}>
                      {item.text}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* COMMENTS */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2">Team Discussion</h3>
            <div className="space-y-3 text-xs">
              {task.comments.length === 0 ? (
                <div className="text-[#64748B]">No comments yet.</div>
              ) : (
                task.comments.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0F172A]">{c.author}</span>
                      <span className="text-[10px] text-[#64748B]">{c.timestamp}</span>
                    </div>
                    <p className="text-[#0F172A]">{c.text}</p>
                  </div>
                ))
              )}

              <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-xs text-[#0F172A] focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#2563EB] px-4 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Col: Attachments & Activity */}
        <div className="space-y-6">
          {/* FILES */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2">Attachments</h3>
            <div className="space-y-2 text-xs">
              {task.attachments.length === 0 ? (
                <div className="text-[#64748B]">No attachments uploaded</div>
              ) : (
                task.attachments.map((att) => (
                  <div key={att.id} className="flex items-center justify-between p-2.5 rounded-lg border border-[#E2E8F0]">
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-[#2563EB]" />
                      <div>
                        <div className="font-semibold text-[#0F172A]">{att.name}</div>
                        <div className="text-[10px] text-[#64748B]">{att.size}</div>
                      </div>
                    </div>
                    <button className="text-xs font-semibold text-[#2563EB]">Download</button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ACTIVITY */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2">Task Activity</h3>
            <div className="space-y-2.5 text-xs">
              {task.activities.map((act) => (
                <div key={act.id} className="border-l-2 border-[#2563EB] pl-3 py-0.5 space-y-0.5">
                  <div className="font-semibold text-[#0F172A]">{act.text}</div>
                  <div className="text-[10px] text-[#64748B]">{act.timestamp}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
