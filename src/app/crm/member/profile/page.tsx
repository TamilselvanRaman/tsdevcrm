"use client";

import { useAppStore } from "@/store/useAppStore";
import { User, Mail, Phone, Shield, Code2, Briefcase } from "lucide-react";

export default function TeamMemberProfilePage() {
  const { currentUserId, users } = useAppStore();
  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Profile & Account</h1>
        <p className="text-xs text-[#64748B] mt-0.5">Your personal team member profile settings.</p>
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xs space-y-6">
        <div className="flex items-center gap-4 border-b border-[#E2E8F0] pb-5">
          <img src={currentUser.avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover border-2 border-[#2563EB]" />
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
    </div>
  );
}
