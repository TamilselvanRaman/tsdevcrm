"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectInvoices() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/crm/admin/finance/invoices");
  }, [router]);
  return null;
}
