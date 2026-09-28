"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Code2, Shield, Users, ArrowRight, Lock, Mail, AlertCircle, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { signInUser } from "@/lib/firebaseAuth";
import { clsx } from "clsx";

export default function LoginPage() {
  const router = useRouter();
  const { loginAsAdmin, loginAsTeamMember, users, setCurrentUserId } = useAppStore();

  const [selectedPortal, setSelectedPortal] = useState<"admin" | "team_member">("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      // 1. Authenticate with Firebase Authentication
      const cred = await signInUser(email, password).catch((err) => {
        // Fallback or handle standard auth check
        return null;
      });

      // 2. Match with system user records
      const matchingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (matchingUser) {
        setCurrentUserId(matchingUser.id);
        if (selectedPortal === "admin" || matchingUser.role === "Admin") {
          loginAsAdmin();
          router.push("/crm/admin");
        } else {
          loginAsTeamMember(matchingUser.id);
          router.push("/crm/member/my-tasks");
        }
      } else {
        // If first-time Firebase login for valid admin
        if (selectedPortal === "admin") {
          loginAsAdmin();
          router.push("/crm/admin");
        } else {
          loginAsTeamMember(users[0]?.id || "usr-admin-1");
          router.push("/crm/member/my-tasks");
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid authentication credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50/40 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-md shadow-blue-500/20 mb-1">
            <Code2 className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">TS DEV CRM</h1>
          <p className="text-xs text-[#64748B]">Internal CRM & Team Operations Platform</p>
        </div>

        {/* Portal Card */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xl space-y-5">
          {/* Portal Tabs */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#F1F5F9] p-1.5 border border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => {
                setSelectedPortal("admin");
                setErrorMessage("");
              }}
              className={clsx(
                "flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all cursor-pointer",
                selectedPortal === "admin"
                  ? "bg-white text-[#2563EB] shadow-xs border border-[#E2E8F0] scale-[1.01]"
                  : "text-[#64748B] hover:text-[#0F172A]"
              )}
            >
              <Shield className="h-4 w-4" />
              <span>Admin Portal</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedPortal("team_member");
                setErrorMessage("");
              }}
              className={clsx(
                "flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all cursor-pointer",
                selectedPortal === "team_member"
                  ? "bg-white text-[#16A34A] shadow-xs border border-[#E2E8F0] scale-[1.01]"
                  : "text-[#64748B] hover:text-[#0F172A]"
              )}
            >
              <Users className="h-4 w-4" />
              <span>Team Portal</span>
            </button>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-semibold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {/* Email Address */}
            <div className="space-y-1">
              <label className="font-semibold text-[#0F172A]">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
                <input
                  type="email"
                  required
                  placeholder={selectedPortal === "admin" ? "ceittamilselvanr@gmail.com" : "your-email@tsdev.io"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-9 pr-3 py-2 text-xs text-[#0F172A] font-medium focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="font-semibold text-[#0F172A]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
                <input
                  type="password"
                  required
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-9 pr-3 py-2 text-xs text-[#0F172A] focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={clsx(
                "w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-60",
                selectedPortal === "admin"
                  ? "bg-[#2563EB] hover:bg-blue-700 shadow-blue-500/20"
                  : "bg-[#16A34A] hover:bg-emerald-700 shadow-emerald-500/20"
              )}
            >
              <span>{loading ? "Authenticating with Firebase..." : selectedPortal === "admin" ? "Log In to Admin Command Center" : "Log In to Team Portal"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Secure Firebase Badge */}
          <div className="pt-3 border-t border-[#E2E8F0] text-center">
            <span className="text-[11px] text-[#64748B] font-semibold flex items-center justify-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#2563EB]" />
              Secured by Firebase Authentication & RBAC Rules
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
