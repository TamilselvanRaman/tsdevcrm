import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { clsx } from "clsx";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  icon: LucideIcon;
  variant?: "blue" | "emerald" | "amber" | "rose" | "indigo" | "slate";
  onClick?: () => void;
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtext,
  trend,
  trendDirection = "neutral",
  icon: Icon,
  variant = "blue",
  onClick,
  className,
}: MetricCardProps) {
  const iconVariants = {
    blue: "bg-blue-50 text-[#2563EB] border-blue-100",
    emerald: "bg-emerald-50 text-[#16A34A] border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-red-50 text-[#DC2626] border-red-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    slate: "bg-slate-50 text-[#64748B] border-slate-200",
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        "rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-2xs transition-all",
        onClick && "cursor-pointer hover:border-[#2563EB]/40 hover:shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
          {title}
        </span>
        <div className={clsx("p-2 rounded-xl border shrink-0", iconVariants[variant])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="text-2xl font-bold text-[#0F172A] tracking-tight truncate">{value}</span>
        {trend && (
          <span
            className={clsx(
              "inline-flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-md shrink-0",
              trendDirection === "up" && "bg-emerald-50 text-[#16A34A]",
              trendDirection === "down" && "bg-red-50 text-[#DC2626]",
              trendDirection === "neutral" && "bg-slate-50 text-[#64748B]"
            )}
          >
            {trendDirection === "up" && <ArrowUpRight className="h-3 w-3" />}
            {trendDirection === "down" && <ArrowDownRight className="h-3 w-3" />}
            {trend}
          </span>
        )}
      </div>

      {subtext && <p className="mt-1 text-xs text-[#64748B] font-medium">{subtext}</p>}
    </div>
  );
}

export default MetricCard;
