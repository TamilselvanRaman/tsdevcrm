"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectSettings() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/crm/admin/settings");
  }, [router]);
  return null;
}
