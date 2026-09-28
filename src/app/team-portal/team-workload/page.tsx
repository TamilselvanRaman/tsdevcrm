"use client";

import { Users, Clock, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export default function TeamWorkloadPage() {
  const { users } = useAppStore();

  const workloadData = [
    { name: "Tamil Selvan", role: "Developer", active: 6, completed: 18, availability: "Busy", workload: 85 },
    { name: "Priya Raman", role: "Designer", active: 4, completed: 21, availability: "Available", workload: 60 },
    { name: "Arun Kumar", role: "Backend Developer", active: 3, completed: 15, availability: "Available", workload: 45 },
    { name: "Karthik Raja", role: "SEO", active: 2, completed: 12, availability: "Available", workload: 55 },
    { name: "Deepa Lakshmi", role: "Content", active: 2, completed: 9, availability: "Available", workload: 40 },
    { name: "Rajesh Kannan", role: "Frontend Developer", active: 3, completed: 14, availability: "Busy", workload: 70 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Team Workload</h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Operational team availability & work capacity overview.
        </p>
      </div>

      {/* Main Table */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-compact">
            <thead>
              <tr>
                <th>Team Member</th>
                <th>Active Tasks</th>
                <th>Completed</th>
                <th>Availability</th>
                <th>Workload Capacity</th>
              </tr>
            </thead>
            <tbody>
              {workloadData.map((row, idx) => (
                <tr key={idx}>
                  <td className="font-semibold text-[#0F172A]">
                    {row.name} <span className="text-[10px] text-[#64748B] font-normal">({row.role})</span>
                  </td>
                  <td className="font-bold text-[#2563EB]">{row.active} Active</td>
                  <td className="text-[#16A34A] font-semibold">{row.completed} Completed</td>
                  <td>
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        row.availability === "Available"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {row.availability}
                    </span>
                  </td>
                  <td className="w-48">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            row.workload > 80 ? "bg-[#F59E0B]" : "bg-[#2563EB]"
                          }`}
                          style={{ width: `${row.workload}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[#0F172A]">{row.workload}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
