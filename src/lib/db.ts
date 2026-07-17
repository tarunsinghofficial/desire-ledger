import Dexie, { type Table } from "dexie";
import type { Decision, Desire, JournalEntry } from "./types";

export class DesireLedgerDB extends Dexie {
  desires!: Table<Desire, string>;
  journalEntries!: Table<JournalEntry, string>;
  decisions!: Table<Decision, string>;

  constructor() {
    super("desire-ledger");
    this.version(1).stores({
      desires: "id, stage, updatedAt, dirty, deletedAt, focus, buyWindowStart",
      journalEntries: "id, desireId, updatedAt, dirty, deletedAt",
      decisions: "id, desireId, kind, updatedAt, dirty, deletedAt",
    });
    this.version(2)
      .stores({
        desires:
          "id, userId, stage, category, updatedAt, dirty, deletedAt, focus, buyWindowStart",
        journalEntries: "id, userId, desireId, updatedAt, dirty, deletedAt",
        decisions: "id, userId, desireId, kind, updatedAt, dirty, deletedAt",
      })
      .upgrade(async (tx) => {
        await tx
          .table("desires")
          .toCollection()
          .modify((d: Desire) => {
            if (!d.userId) d.userId = "local";
            if (!d.category) d.category = "other";
          });
        await tx
          .table("journalEntries")
          .toCollection()
          .modify((j: JournalEntry) => {
            if (!j.userId) j.userId = "local";
          });
        await tx
          .table("decisions")
          .toCollection()
          .modify((d: Decision) => {
            if (!d.userId) d.userId = "local";
          });
      });
  }
}

export const db = new DesireLedgerDB();

export async function touchDesire(
  id: string,
  patch: Partial<Desire>,
): Promise<void> {
  const now = new Date().toISOString();
  await db.desires.update(id, { ...patch, updatedAt: now, dirty: true });
}

export async function upsertDesire(desire: Desire): Promise<void> {
  await db.desires.put({
    ...desire,
    dirty: true,
    updatedAt: new Date().toISOString(),
  });
}

export async function softDeleteDesire(id: string): Promise<void> {
  const now = new Date().toISOString();
  await db.desires.update(id, {
    deletedAt: now,
    updatedAt: now,
    dirty: true,
  });
}

export async function addJournalEntry(
  entry: Omit<JournalEntry, "dirty" | "syncedAt" | "deletedAt">,
): Promise<void> {
  await db.journalEntries.put({
    ...entry,
    dirty: true,
    deletedAt: null,
    syncedAt: null,
  });
}

export async function addDecision(
  decision: Omit<Decision, "dirty" | "syncedAt" | "deletedAt">,
): Promise<void> {
  await db.decisions.put({
    ...decision,
    dirty: true,
    deletedAt: null,
    syncedAt: null,
  });
}

export async function getActiveDesires(userId: string): Promise<Desire[]> {
  const all = await db.desires.where("userId").equals(userId).toArray();
  return all
    .filter((d) => !d.deletedAt)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
