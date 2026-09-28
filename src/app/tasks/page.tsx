"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectTasks() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/crm/admin/tasks");
  }, [router]);
  return null;
}
