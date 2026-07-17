"use client";

import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { syncLedger } from "@/lib/sync";

export function SyncStatus() {
  const { user, isLoaded } = useUser();
  const [message, setMessage] = useState("Local");
  const [busy, setBusy] = useState(false);

  const runSync = useCallback(async () => {
    if (!user?.id) {
      setMessage("Local");
      return;
    }
    setBusy(true);
    try {
      const result = await syncLedger(user.id);
      setMessage(result.ok ? "Synced" : "Cloud off");
    } finally {
      setBusy(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!isLoaded || !user?.id) return;
    const onOnline = () => {
      void runSync();
    };
    window.addEventListener("online", onOnline);
    const boot = window.setTimeout(() => {
      void runSync();
    }, 0);
    const id = window.setInterval(() => {
      void runSync();
    }, 60_000);
    return () => {
      window.removeEventListener("online", onOnline);
      window.clearTimeout(boot);
      window.clearInterval(id);
    };
  }, [isLoaded, user?.id, runSync]);

  return (
    <button
      type="button"
      onClick={() => void runSync()}
      disabled={busy || !user}
      className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 hover:bg-white/15 disabled:opacity-60"
      title="Sync now"
    >
      {busy ? "Syncing…" : message}
    </button>
  );
}
