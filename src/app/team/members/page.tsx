"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectMembers() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/crm/admin/team/members");
  }, [router]);
  return null;
}
