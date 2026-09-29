"use client";

import { useState } from "react";
import { Settings, Shield, Bell, Key, Globe, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export default function SettingsPage() {
  const [agencyName, setAgencyName] = useState("TS DEV CRM");
  const [subtitle, setSubtitle] = useState("Internal CRM & Team Operations");
  const [currency, setCurrency] = useState("INR (₹)");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">System Settings</h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Global system preferences, branding, and defaults.
        </p>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> System settings updated successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-2xs space-y-5 text-xs">
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2">Agency Profile & Branding</h3>

          <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 shrink-0 p-1.5 shadow-xs flex items-center justify-center">
                <img src="/logo-removebg.png" alt="TS DEV Brand Logo" className="h-full w-full object-contain filter drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
              </div>
              <div>
                <div className="font-bold text-sm text-[#0F172A]">TS DEV Brand Identity Assets</div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Official emblem and transparent typography used across Sidebar, Client Quotations, Invoices and Portal authentication.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Transparent: /logo-removebg.png
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-[#2563EB] border border-blue-200">
                    Emblem: /logo.png
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-[#0F172A] block mb-1">Agency Brand Title</label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs text-[#0F172A]"
              />
            </div>
            <div>
              <label className="font-semibold text-[#0F172A] block mb-1">Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs text-[#0F172A]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2">Currency & Regional Defaults</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-[#0F172A] block mb-1">Default Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-xs text-[#0F172A]"
              >
                <option value="INR (₹)">Indian Rupee - INR (₹)</option>
                <option value="USD ($)">US Dollar - USD ($)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-[#0F172A] block mb-1">Timezone</label>
              <input
                type="text"
                defaultValue="Asia/Kolkata (IST)"
                disabled
                className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-xs text-[#64748B]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2">Corporate Business Details & DPDP Act 2023 Compliance</h3>
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0F172A]">Registered Data Fiduciary</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                DPDP Act Compliant (India)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#475569]">
              <div><strong className="text-[#0F172A]">Entity:</strong> TS DEV Digital Solutions & Development</div>
              <div><strong className="text-[#0F172A]">Location:</strong> Dharmapuri, Tamil Nadu, India</div>
              <div><strong className="text-[#0F172A]">Official Email:</strong> ceittamilselvanr26@gmail.com</div>
              <div><strong className="text-[#0F172A]">Official Phone:</strong> +91 9944287852</div>
            </div>
            <div className="text-[11px] text-[#64748B] pt-2 border-t border-blue-200/80">
              ✓ Only necessary customer & staff data collected. Zero 3rd-party advertising trackers or unauthorized embeds.
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-[#E2E8F0]">
          <button
            type="submit"
            className="rounded-xl bg-[#2563EB] px-5 py-2 font-semibold text-white hover:bg-blue-700 shadow-xs"
          >
            Save Settings & Branding
          </button>
        </div>
      </form>
    </div>
  );
}
