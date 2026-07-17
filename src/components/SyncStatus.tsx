"use client";

import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { useCapabilities } from "@/lib/capabilities-client";
import { syncLedger } from "@/lib/sync";

export function SyncStatus() {
  const { user, isLoaded } = useUser();
  const { caps, loaded: capsLoaded } = useCapabilities();
  const [message, setMessage] = useState("Local");
  const [busy, setBusy] = useState(false);

  const runSync = useCallback(async () => {
    if (!user?.id) {
      setMessage("Local");
      return;
    }
    if (!caps.cloudSync) {
      setMessage("Local only");
      return;
    }
    setBusy(true);
    try {
      const result = await syncLedger(user.id);
      setMessage(result.ok ? "Synced" : "Cloud off");
    } finally {
      setBusy(false);
    }
  }, [user?.id, caps.cloudSync]);

  useEffect(() => {
    if (!isLoaded || !capsLoaded) return;
    if (!user?.id || !caps.cloudSync) {
      setMessage(user?.id ? "Local only" : "Local");
      return;
    }
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
  }, [isLoaded, capsLoaded, user?.id, caps.cloudSync, runSync]);

  return (
    <button
      type="button"
      onClick={() => void runSync()}
      disabled={busy || !user || !caps.cloudSync}
      className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 hover:bg-white/15 disabled:opacity-60"
      title={caps.cloudSync ? "Sync now" : "Local only on this demo"}
    >
      {busy ? "Syncing…" : message}
    </button>
  );
}
