"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, AlertCircle, ShieldCheck, UserCheck, Shield } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { registerUser, signInUser } from "@/lib/firebaseAuth";
import {
  findAuthorizedAccount,
  AUTHORIZED_ADMINS,
  AUTHORIZED_MEMBERS,
} from "@/lib/authorizedUsers";

export default function LoginPage() {
  const router = useRouter();
  const { loginAsAdmin, loginAsTeamMember } = useAppStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const inputIdentifier = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!inputIdentifier || !cleanPassword) {
      setErrorMessage("Please enter both username/email and password.");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      // 1. Strict Whitelist Check — ONLY authorized Admins and Members allowed
      const authAccount = findAuthorizedAccount(inputIdentifier);
      if (!authAccount) {
        throw new Error("Incorrect username or password. Access is restricted to authorized TS DEV users only.");
      }

      // 2. Firebase Authentication
      try {
        await signInUser(authAccount.email, cleanPassword);
      } catch (authErr: any) {
        // If the authorized account doesn't exist yet in Firebase Auth, auto-provision it with their chosen password
        try {
          await registerUser(authAccount.email, cleanPassword);
        } catch (regErr: any) {
          // If registration also fails because the account exists in Firebase Auth, then the password was wrong
          throw new Error("Incorrect username or password. Please verify your credentials.");
        }
      }

      // 3. Route based on verified Account Type
      if (authAccount.accountType === "admin") {
        loginAsAdmin(authAccount.id);
        router.push("/crm/admin");
      } else {
        loginAsTeamMember(authAccount.id);
        router.push("/crm/member/dashboard");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Incorrect username or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (emailVal: string) => {
    setEmail(emailVal);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50/40 flex flex-col justify-center items-center p-4 select-none">
      <div className="w-full max-w-lg space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Logo & Header */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-950 overflow-hidden shadow-xl border border-slate-800 p-2 mb-1 flex items-center justify-center">
            <img
              src="/logo-removebg.png"
              alt="TS DEV Logo"
              className="h-full w-full object-contain filter drop-shadow-[0_0_8px_rgba(37,99,235,0.45)]"
            />
          </div>
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">TS DEV CRM</h1>
          <p className="text-xs text-[#64748B] font-medium">Internal CRM & Team Operations Platform</p>
        </div>

        {/* Unified Executive Login Card */}
        <div className="rounded-3xl border border-[#E2E8F0] bg-white p-7 sm:p-8 shadow-xl space-y-5">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-semibold animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#0F172A] block">Work Email or Username</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#94A3B8]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. ceittamilselvanr26@tsdev.io or vishalbharath566@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] pl-10 pr-3 py-2.5 text-xs text-[#0F172A] font-medium placeholder:text-[#94A3B8] focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#0F172A]">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#94A3B8]" />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] pl-10 pr-3 py-2.5 text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-[#64748B]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#CBD5E1] text-[#2563EB] focus:ring-blue-500"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => alert("Please contact system administrator to reset your password.")}
                className="font-semibold text-[#2563EB] hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Single Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:pointer-events-none mt-2"
            >
              <span>{loading ? "Verifying Credentials & Redirecting..." : "Sign In to Workspace"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Authorized Accounts Directory */}
          <div className="pt-3 border-t border-[#E2E8F0] space-y-3">
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-[#2563EB]" />
              Authorized Accounts Directory
            </div>

            <div className="space-y-2 text-xs">
              {/* Admins */}
              <div>
                <span className="text-[10px] font-bold text-[#0F172A] uppercase flex items-center gap-1 mb-1">
                  <Shield className="h-3 w-3 text-[#2563EB]" />
                  Admins (@tsdev.io)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  {AUTHORIZED_ADMINS.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => handleQuickFill(acc.email)}
                      className="text-left p-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer group"
                    >
                      <div className="font-bold text-[#0F172A] group-hover:text-[#2563EB] truncate text-[11px]">
                        {acc.fullName}
                      </div>
                      <div className="text-[9px] text-[#64748B] truncate">{acc.email}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Members */}
              <div>
                <span className="text-[10px] font-bold text-[#0F172A] uppercase flex items-center gap-1 mb-1 pt-1">
                  <UserCheck className="h-3 w-3 text-[#16A34A]" />
                  Members (@gmail.com)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  {AUTHORIZED_MEMBERS.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => handleQuickFill(acc.email)}
                      className="text-left p-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-emerald-50 hover:border-emerald-200 transition-colors cursor-pointer group"
                    >
                      <div className="font-bold text-[#0F172A] group-hover:text-[#16A34A] truncate text-[11px]">
                        {acc.fullName}
                      </div>
                      <div className="text-[9px] text-[#64748B] truncate">{acc.email}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Security Badge Footer */}
          <div className="pt-2 border-t border-[#E2E8F0] text-center">
            <span className="text-[10px] text-[#64748B] font-semibold flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#16A34A]" />
              Secured by Firebase Authentication & Role-Based Access Control
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
