"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

export default function CrmTeamPortalRedirect() {
  const router = useRouter();
  const { setPortalMode } = useAppStore();

  useEffect(() => {
    setPortalMode("team_member");
    router.replace("/crm/member/my-tasks");
  }, [router, setPortalMode]);

  return (
    <div className="p-8 text-center text-xs text-[#64748B]">
      Redirecting to Team Member Portal...
    </div>
  );
}
