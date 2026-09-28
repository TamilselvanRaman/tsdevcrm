"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export function FirebaseInitializer() {
  const initFirebaseSync = useAppStore((s) => s.initFirebaseSync);

  useEffect(() => {
    const cleanup = initFirebaseSync();
    return () => {
      if (cleanup) cleanup();
    };
  }, [initFirebaseSync]);

  return null;
}
