import { db } from "./db";
import type { Decision, Desire, JournalEntry } from "./types";

export type SyncResult = {
  ok: boolean;
  message: string;
  pushed: number;
  pulled: number;
};

export async function syncLedger(userId: string): Promise<SyncResult> {
  if (!userId) {
    return {
      ok: false,
      message: "Sign in to sync.",
      pushed: 0,
      pulled: 0,
    };
  }

  try {
    const dirtyDesires = await db.desires
      .where("userId")
      .equals(userId)
      .filter((d) => d.dirty)
      .toArray();
    const dirtyJournal = await db.journalEntries
      .where("userId")
      .equals(userId)
      .filter((j) => j.dirty)
      .toArray();
    const dirtyDecisions = await db.decisions
      .where("userId")
      .equals(userId)
      .filter((d) => d.dirty)
      .toArray();

    const res = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        desires: dirtyDesires,
        journalEntries: dirtyJournal,
        decisions: dirtyDecisions,
      }),
    });

    const data = (await res.json()) as {
      error?: string;
      desires?: Desire[];
      journalEntries?: JournalEntry[];
      decisions?: Decision[];
      pushed?: number;
    };

    if (!res.ok) {
      return {
        ok: false,
        message: data.error ?? "Sync failed",
        pushed: 0,
        pulled: 0,
      };
    }

    let pulled = 0;
    const now = new Date().toISOString();

    for (const remote of data.desires ?? []) {
      const local = await db.desires.get(remote.id);
      if (!local || remote.updatedAt >= local.updatedAt) {
        await db.desires.put({ ...remote, userId, dirty: false, syncedAt: now });
        pulled += 1;
      }
    }

    for (const remote of data.journalEntries ?? []) {
      const local = await db.journalEntries.get(remote.id);
      if (!local || remote.updatedAt >= local.updatedAt) {
        await db.journalEntries.put({
          ...remote,
          userId,
          dirty: false,
          syncedAt: now,
        });
        pulled += 1;
      }
    }

    for (const remote of data.decisions ?? []) {
      const local = await db.decisions.get(remote.id);
      if (!local || remote.updatedAt >= local.updatedAt) {
        await db.decisions.put({
          ...remote,
          userId,
          dirty: false,
          syncedAt: now,
        });
        pulled += 1;
      }
    }

    await Promise.all([
      ...dirtyDesires.map((d) =>
        db.desires.update(d.id, { dirty: false, syncedAt: now }),
      ),
      ...dirtyJournal.map((j) =>
        db.journalEntries.update(j.id, { dirty: false, syncedAt: now }),
      ),
      ...dirtyDecisions.map((d) =>
        db.decisions.update(d.id, { dirty: false, syncedAt: now }),
      ),
    ]);

    const pushed = data.pushed ?? dirtyDesires.length + dirtyJournal.length + dirtyDecisions.length;

    return {
      ok: true,
      message: `Synced — saved ${pushed}, loaded ${pulled}.`,
      pushed,
      pulled,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    return { ok: false, message, pushed: 0, pulled: 0 };
  }
}
