"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useCapabilities } from "@/lib/capabilities-client";
import { downloadJson, exportLedger, importLedger } from "@/lib/export";
import { syncLedger } from "@/lib/sync";
import type { LedgerExport } from "@/lib/types";

export default function SettingsPage() {
  const { user } = useUser();
  const { caps, loaded: capsLoaded } = useCapabilities();
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function runSync() {
    if (!user?.id || !caps.cloudSync) return;
    setBusy(true);
    const result = await syncLedger(user.id);
    setStatus(result.message);
    setBusy(false);
  }

  async function onExport() {
    if (!user?.id) return;
    const data = await exportLedger(user.id);
    downloadJson(`desire-ledger-${Date.now()}.json`, data);
    setStatus("Backup downloaded.");
  }

  async function onImport(file: File) {
    if (!user?.id) return;
    const text = await file.text();
    const data = JSON.parse(text) as LedgerExport;
    const count = await importLedger(data, user.id);
    setStatus(`Imported ${count} items.`);
  }

  return (
    <div className="animate-fade mx-auto max-w-2xl space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-deep-fir md:text-4xl">
          Settings
        </h1>
        <p className="mt-2 text-fir-muted">
          Account, cloud sync, and backups.
        </p>
      </header>

      <section className="panel-soft space-y-3">
        <h2 className="text-xl font-semibold">Account</h2>
        <p className="text-sm text-deep-fir">
          Signed in as{" "}
          <span className="font-medium">
            {user?.primaryEmailAddress?.emailAddress ?? user?.fullName ?? "you"}
          </span>
        </p>
        <p className="text-sm text-fir-muted">
          Anyone can create an account with Clerk. Use the avatar menu to manage
          your profile or sign out.
        </p>
      </section>

      <section className="panel space-y-4">
        <h2 className="text-xl font-semibold">Cloud sync</h2>
        {capsLoaded && !caps.cloudSync ? (
          <>
            <p className="text-sm text-fir-muted">
              Your list stays on this device. Cloud sync and AI on this public
              demo are limited to the owner.
            </p>
            <p className="text-sm text-fir-muted">{caps.selfHostHint}</p>
            <p className="text-sm text-fir-muted">
              To unlock sync and AI for yourself: clone the repo, add your own
              Clerk, Supabase, and AI keys, set{" "}
              <code className="text-deep-fir">DEMO_OWNER_USER_IDS</code> to your
              Clerk user id, and deploy. See the README setup section.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-fir-muted">
              Save your list to the cloud so you can open it on another phone or
              laptop.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy || !user || !caps.cloudSync}
              onClick={() => void runSync()}
            >
              {busy ? "Syncing…" : "Sync now"}
            </button>
          </>
        )}
      </section>

      <section className="panel space-y-4">
        <h2 className="text-xl font-semibold">File backup</h2>
        <p className="text-sm text-fir-muted">
          Download or restore a JSON copy of your items.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void onExport()}
          >
            Download backup
          </button>
          <label className="btn btn-ghost cursor-pointer">
            Restore backup
            <input
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onImport(file);
              }}
            />
          </label>
        </div>
      </section>

      <section className="panel space-y-3">
        <h2 className="text-xl font-semibold">Install on phone</h2>
        <p className="text-sm text-fir-muted">
          iPhone: Safari → Share → Add to Home Screen.
        </p>
      </section>

      {status && <p className="panel-soft text-sm">{status}</p>}
    </div>
  );
}
