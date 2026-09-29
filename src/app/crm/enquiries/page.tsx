"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectEnquiries() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/crm/admin/enquiries");
  }, [router]);
  return null;
}
