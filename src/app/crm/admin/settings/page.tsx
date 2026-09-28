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
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2">Agency Profile & Branding</h3>
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

        <div className="flex items-center justify-end pt-3 border-t border-[#E2E8F0]">
          <button
            type="submit"
            className="rounded-xl bg-[#2563EB] px-5 py-2 font-semibold text-white hover:bg-blue-700 shadow-xs"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
