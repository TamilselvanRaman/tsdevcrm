"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectTeams() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/crm/admin/team/teams");
  }, [router]);
  return null;
}
