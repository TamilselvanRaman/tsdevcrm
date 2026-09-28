"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MemberRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/crm/member/my-tasks");
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center text-xs font-semibold text-[#64748B]">
      Loading Team Member Workspace...
    </div>
  );
}
