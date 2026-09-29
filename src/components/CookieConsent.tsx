"use client";

import { useState, useEffect } from "react";
import { Cookie, X, Check, ShieldCheck } from "lucide-react";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("tsdev_cookie_consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = (type: "all" | "essential") => {
    localStorage.setItem("tsdev_cookie_consent", type);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Consent Banner"
      className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 rounded-2xl border border-slate-700 bg-slate-950 text-white p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 text-blue-400">
          <Cookie className="h-5 w-5 shrink-0" />
          <h3 className="font-bold text-sm tracking-tight text-white">Privacy & Cookie Consent</h3>
        </div>
        <button
          onClick={() => handleAccept("essential")}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          aria-label="Close cookie consent banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
        TS DEV CRM uses essential cookies & local session storage to maintain secure user authentication, role-based access control, and Firestore real-time synchronization in compliance with the <strong className="text-white">DPDP Act (India)</strong>.
      </p>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
        <button
          onClick={() => handleAccept("all")}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 px-3.5 py-2 font-bold text-white shadow-sm transition-all cursor-pointer active:scale-95"
          aria-label="Accept all cookies and session tracking"
        >
          <Check className="h-3.5 w-3.5" />
          <span>Accept All</span>
        </button>

        <button
          onClick={() => handleAccept("essential")}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 px-3.5 py-2 font-semibold text-slate-200 transition-all cursor-pointer"
          aria-label="Accept essential cookies only"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Essential Only</span>
        </button>
      </div>
    </div>
  );
}
