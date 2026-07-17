"use client";

import { useState } from "react";
import type { AiAction, Desire } from "@/lib/types";

const ACTIONS: { id: AiAction; label: string; description: string }[] = [
  {
    id: "expand_spark",
    label: "Fill details",
    description: "Write the missing bits for me",
  },
  {
    id: "buy_timing",
    label: "When to buy",
    description: "Suggest a good time",
  },
  {
    id: "growth_thesis",
    label: "How it helps",
    description: "Explain the upside",
  },
  {
    id: "usage_prompt",
    label: "Journal idea",
    description: "Give me a question to answer",
  },
  {
    id: "future_unlock",
    label: "What's next",
    description: "What this could lead to",
  },
  {
    id: "impulse_check",
    label: "Should I wait?",
    description: "Honest second opinion",
  },
];

export function AiPanel({
  desire,
  onApply,
}: {
  desire: Desire;
  onApply: (
    patch: Partial<Desire>,
    meta?: { prompt?: string; note?: string },
  ) => void;
}) {
  const [busy, setBusy] = useState<AiAction | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(action: AiAction) {
    setBusy(action);
    setError(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, desire }),
      });
      const data = (await res.json()) as {
        result?: Record<string, unknown>;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "AI failed");
      const r = data.result ?? {};

      if (action === "expand_spark") {
        onApply({
          essence: String(r.essence ?? desire.essence),
          why: String(r.why ?? desire.why),
          category: String(r.category ?? desire.category),
          tags: (r.tags as string[]) ?? desire.tags,
          growthThesis: String(r.growthThesis ?? desire.growthThesis),
          lifeAreas: (r.lifeAreas as string[]) ?? desire.lifeAreas,
          blockers: String(r.blockers ?? desire.blockers),
          waitVsBuy: String(r.waitVsBuy ?? desire.waitVsBuy),
          urgency: Number(r.urgency ?? desire.urgency),
          stage: (r.suggestedStage as Desire["stage"]) ?? desire.stage,
        });
      } else if (action === "buy_timing") {
        onApply({
          buyWindowStart: (r.buyWindowStart as string | null) ?? null,
          buyWindowEnd: (r.buyWindowEnd as string | null) ?? null,
          notBefore: (r.notBefore as string | null) ?? null,
          waitVsBuy: String(r.waitVsBuy ?? r.rationale ?? desire.waitVsBuy),
        });
      } else if (action === "growth_thesis") {
        onApply({
          growthThesis: String(r.growthThesis ?? desire.growthThesis),
          lifeAreas: (r.lifeAreas as string[]) ?? desire.lifeAreas,
          unlocksNext: String(r.unlocksNext ?? desire.unlocksNext),
          sunsetCriteria: String(r.sunsetCriteria ?? desire.sunsetCriteria),
        });
      } else if (action === "usage_prompt") {
        onApply({}, { prompt: String(r.prompt ?? "") });
      } else if (action === "future_unlock") {
        onApply({
          unlocksNext: String(r.unlocksNext ?? desire.unlocksNext),
        });
      } else if (action === "impulse_check") {
        onApply({}, { note: String(r.note ?? JSON.stringify(r)) });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <aside className="panel-soft h-fit space-y-3">
      <div>
        <h2 className="text-lg text-deep-fir">AI help</h2>
        <p className="text-sm text-fir-muted">Optional — tap any button</p>
      </div>
      <div className="grid gap-2">
        {ACTIONS.map((a) => (
          <button
            key={a.id}
            type="button"
            disabled={busy !== null}
            onClick={() => void run(a.id)}
            className="btn btn-ghost w-full justify-start !rounded-2xl px-3 py-2.5 text-left"
          >
            <span className="block">
              <span className="block text-sm text-deep-fir">
                {busy === a.id ? "Working…" : a.label}
              </span>
              <span className="text-xs text-fir-muted">{a.description}</span>
            </span>
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-deep-fir">{error}</p>}
    </aside>
  );
}
