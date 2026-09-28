"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectFinance() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/crm/admin/finance");
  }, [router]);
  return null;
}
