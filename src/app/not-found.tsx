import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white flex flex-col items-center justify-center p-6 text-center select-none animate-in fade-in duration-200">
      <div className="w-full max-w-lg space-y-6 flex flex-col items-center">
        {/* Brand Emblem */}
        <div className="h-20 w-20 rounded-3xl bg-slate-900 border border-slate-700/80 p-3 shadow-2xl flex items-center justify-center">
          <img
            src="/logo-removebg.png"
            alt="TS DEV Logo"
            className="h-full w-full object-contain filter drop-shadow-[0_0_12px_rgba(37,99,235,0.6)]"
          />
        </div>

        {/* 404 Big Title */}
        <div className="space-y-2">
          <span className="text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400 block font-mono">
            404
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">Page Not Found</h1>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed">
            The requested page or resource could not be found. It may have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Link
            href="/crm/admin"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25 active:scale-95"
          >
            <Home className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-500 font-medium">
          TS DEV CRM • Internal Operations & Management
        </div>
      </div>
    </div>
  );
}
