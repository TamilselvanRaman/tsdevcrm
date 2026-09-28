"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, portalMode } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (portalMode === "team_member") {
      router.replace("/crm/member/my-tasks");
    } else {
      router.replace("/crm/admin");
    }
  }, [isAuthenticated, portalMode, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center text-xs font-semibold text-[#64748B]">
      Loading TS DEV CRM Workspace...
    </div>
  );
}
