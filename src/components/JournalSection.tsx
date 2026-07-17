"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { addJournalEntry, db } from "@/lib/db";

export function JournalSection({
  desireId,
  userId,
  seedPrompt,
}: {
  desireId: string;
  userId: string;
  seedPrompt?: string | null;
}) {
  const entries = useLiveQuery(
    () =>
      db.journalEntries
        .where("desireId")
        .equals(desireId)
        .filter((e) => !e.deletedAt && e.userId === userId)
        .reverse()
        .sortBy("createdAt"),
    [desireId, userId],
  );

  const [body, setBody] = useState("");
  const [promptOverride, setPromptOverride] = useState<string | null>(null);
  const prompt = promptOverride ?? seedPrompt ?? "";

  async function save() {
    if (!body.trim() || !userId) return;
    const now = new Date().toISOString();
    await addJournalEntry({
      id: crypto.randomUUID(),
      userId,
      desireId,
      body: body.trim(),
      prompt: prompt.trim(),
      createdAt: now,
      updatedAt: now,
    });
    setBody("");
  }

  return (
    <section className="panel space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Notes</h2>
        <p className="text-sm text-fir-muted">Quick thoughts over time</p>
      </div>
      <div className="field-grid">
        <div>
          <label htmlFor="journal-prompt">Question (optional)</label>
          <input
            id="journal-prompt"
            value={prompt}
            onChange={(e) => setPromptOverride(e.target.value)}
            placeholder="How is this going?"
          />
        </div>
        <div>
          <label htmlFor="journal-body">Your note</label>
          <textarea
            id="journal-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write anything…"
          />
        </div>
        <button
          type="button"
          className="btn btn-primary w-fit"
          onClick={() => void save()}
        >
          Save note
        </button>
      </div>
      <ul className="space-y-3">
        {(entries ?? []).map((entry, i) => (
          <li
            key={entry.id}
            className="animate-settle rounded-[1rem] bg-mist p-3"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {entry.prompt && (
              <p className="mb-1 text-xs text-fir-muted">{entry.prompt}</p>
            )}
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {entry.body}
            </p>
            <p className="mono mt-2 text-[10px] text-fir-muted">
              {new Date(entry.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
