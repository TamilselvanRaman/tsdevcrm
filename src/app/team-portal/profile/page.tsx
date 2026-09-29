"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { User, Mail, Phone, Shield, Code2, Briefcase, Edit2, X, Check, CheckCircle2 } from "lucide-react";

export default function TeamMemberProfilePage() {
  const { currentUserId, users, updateUser } = useAppStore();
  const currentUser = users.find((u) => u.id === currentUserId) || users[0] || {
    id: "guest",
    fullName: "Staff Member",
    role: "Team Member",
    team: "Development",
    email: "member@tsdevcrm.com",
    phone: "+91 98765 00000",
    username: "staffmember",
    status: "Active",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [username, setUsername] = useState(currentUser.username);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenEdit = () => {
    setFullName(currentUser.fullName);
    setEmail(currentUser.email);
    setPhone(currentUser.phone);
    setUsername(currentUser.username);
    setAvatarUrl(currentUser.avatarUrl);
    setIsEditOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(currentUser.id, {
      fullName,
      email,
      phone,
      username,
      avatarUrl,
    });
    setIsEditOpen(false);
    showToast("Profile details updated successfully.");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#0F172A] text-white px-4 py-3 font-semibold shadow-lg text-xs animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-[#16A34A]" /> {toastMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Profile & Account</h1>
          <p className="text-xs text-[#64748B] mt-0.5">Your personal team member profile settings.</p>
        </div>
        <button
          onClick={handleOpenEdit}
          className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#1D4ED8] transition-colors"
        >
          <Edit2 className="h-4 w-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xs space-y-6">
        <div className="flex items-center gap-4 border-b border-[#E2E8F0] pb-5">
          <img
            src={currentUser.avatarUrl}
            alt=""
            className="h-16 w-16 rounded-full object-cover border-2 border-[#2563EB]"
          />
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">{currentUser.fullName}</h2>
            <div className="flex items-center gap-2 text-xs text-[#64748B] mt-0.5">
              <span>{currentUser.role}</span> • <span>Team: {currentUser.team}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2">Personal Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[#64748B] block font-medium">Email Address</span>
              <span className="font-semibold text-[#0F172A]">{currentUser.email}</span>
            </div>
            <div>
              <span className="text-[#64748B] block font-medium">Phone</span>
              <span className="font-semibold text-[#0F172A]">{currentUser.phone}</span>
            </div>
            <div>
              <span className="text-[#64748B] block font-medium">Username</span>
              <span className="font-semibold text-[#0F172A]">{currentUser.username}</span>
            </div>
            <div>
              <span className="text-[#64748B] block font-medium">Account Status</span>
              <span className="font-semibold text-[#16A34A]">{currentUser.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4 bg-[#F8FAFC]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB]">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0F172A]">Edit Personal Profile</h3>
                  <p className="text-xs text-[#64748B]">Update your contact details and avatar</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:bg-[#E2E8F0] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Avatar URL
                </label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1D4ED8] transition-colors"
                >
                  <Check className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
