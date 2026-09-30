"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { subscribeAuthState } from "@/lib/firebaseAuth";

export function FirebaseInitializer() {
  const initFirebaseSync = useAppStore((s) => s.initFirebaseSync);

  useEffect(() => {
    let syncCleanup: (() => void) | null = null;

    // Listen to Firebase auth changes to refresh/re-establish clean Firestore subscriptions
    const unsubAuth = subscribeAuthState(() => {
      if (syncCleanup) {
        syncCleanup();
        syncCleanup = null;
      }
      syncCleanup = initFirebaseSync();
    });

    return () => {
      if (syncCleanup) syncCleanup();
      unsubAuth();
    };
  }, [initFirebaseSync]);

  return null;
}

