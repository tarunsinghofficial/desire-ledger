import { db } from "./db";
import type { LedgerExport } from "./types";

export async function exportLedger(userId: string): Promise<LedgerExport> {
  const [desires, journalEntries, decisions] = await Promise.all([
    db.desires.where("userId").equals(userId).toArray(),
    db.journalEntries.where("userId").equals(userId).toArray(),
    db.decisions.where("userId").equals(userId).toArray(),
  ]);
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    desires,
    journalEntries,
    decisions,
  };
}

export async function importLedger(
  data: LedgerExport,
  userId: string,
): Promise<number> {
  if (data.version !== 1) throw new Error("Unsupported export version");

  const desires = data.desires.map((d) => ({
    ...d,
    userId,
    dirty: true,
    syncedAt: null,
  }));
  const journalEntries = data.journalEntries.map((j) => ({
    ...j,
    userId,
    dirty: true,
    syncedAt: null,
  }));
  const decisions = data.decisions.map((d) => ({
    ...d,
    userId,
    dirty: true,
    syncedAt: null,
  }));

  await db.transaction(
    "rw",
    db.desires,
    db.journalEntries,
    db.decisions,
    async () => {
      const oldDesires = await db.desires.where("userId").equals(userId).keys();
      const oldJournal = await db.journalEntries
        .where("userId")
        .equals(userId)
        .keys();
      const oldDecisions = await db.decisions
        .where("userId")
        .equals(userId)
        .keys();
      await db.desires.bulkDelete(oldDesires as string[]);
      await db.journalEntries.bulkDelete(oldJournal as string[]);
      await db.decisions.bulkDelete(oldDecisions as string[]);
      await db.desires.bulkPut(desires);
      await db.journalEntries.bulkPut(journalEntries);
      await db.decisions.bulkPut(decisions);
    },
  );
  return desires.length;
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
