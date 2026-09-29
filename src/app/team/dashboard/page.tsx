"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectTeamDashboard() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/crm/admin/team/dashboard");
  }, [router]);
  return null;
}
