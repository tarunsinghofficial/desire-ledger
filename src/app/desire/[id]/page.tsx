"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { AiPanel } from "@/components/AiPanel";
import { CategoryChips } from "@/components/CategoryChips";
import { JournalSection } from "@/components/JournalSection";
import { LifecycleRail } from "@/components/LifecycleRail";
import { db, softDeleteDesire, touchDesire } from "@/lib/db";
import {
  STAGE_LABELS,
  type Desire,
  type LifecycleStage,
  type PurchaseChannel,
} from "@/lib/types";

export default function DesireDossierPage() {
  const { user } = useUser();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const desire = useLiveQuery(() => db.desires.get(params.id), [params.id]);
  const [seedPrompt, setSeedPrompt] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  async function patch(update: Partial<Desire>) {
    if (!desire || !user?.id || desire.userId !== user.id) return;
    await touchDesire(desire.id, update);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1200);
  }

  async function onAiApply(
    update: Partial<Desire>,
    meta?: { prompt?: string; note?: string },
  ) {
    if (Object.keys(update).length) await patch(update);
    if (meta?.prompt) setSeedPrompt(meta.prompt);
    if (meta?.note) await patch({ waitVsBuy: meta.note });
  }

  if (desire === undefined) {
    return <p className="text-fir-muted">Loading…</p>;
  }

  if (!desire || desire.deletedAt || (user && desire.userId !== user.id)) {
    return (
      <div className="space-y-4">
        <p>Item not found.</p>
        <Link href="/horizon" className="btn btn-ghost w-fit">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade page-stack">
      <section className="hero-block">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link
            href="/horizon"
            className="text-sm font-medium text-white/70 hover:text-sulu"
          >
            ← Back
          </Link>
          {savedFlash && (
            <span className="text-sm font-medium text-sulu">Saved</span>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <label className="hero-label" htmlFor="desire-title">
              Title
            </label>
            <input
              id="desire-title"
              className="hero-field"
              value={desire.title}
              onChange={(e) => void patch({ title: e.target.value })}
              placeholder="What do you want?"
            />
          </div>
          <div>
            <label className="hero-label" htmlFor="desire-note">
              Short note
            </label>
            <textarea
              id="desire-note"
              className="hero-field hero-field-note"
              rows={2}
              value={desire.essence}
              onChange={(e) => void patch({ essence: e.target.value })}
              placeholder="One line about why it matters"
            />
          </div>
        </div>

        <LifecycleRail
          stage={desire.stage}
          onChange={(stage) => void patch({ stage })}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:gap-8">
        <div className="space-y-5 md:space-y-6">
          <section className="panel space-y-4">
            <h2 className="text-xl font-semibold">Category</h2>
            <CategoryChips
              value={desire.category || "other"}
              onChange={(category) => void patch({ category })}
            />
          </section>

          <section className="panel space-y-4">
            <h2 className="text-xl font-semibold">About</h2>
            <div className="field-grid">
              <Field label="Why do you want this?">
                <textarea
                  value={desire.why}
                  onChange={(e) => void patch({ why: e.target.value })}
                  placeholder="In simple words…"
                />
              </Field>
              <Field label="How will it help you?">
                <textarea
                  value={desire.growthThesis}
                  onChange={(e) => void patch({ growthThesis: e.target.value })}
                  placeholder="Skills, habits, or life goals…"
                />
              </Field>
            </div>
          </section>

          <section className="panel space-y-4">
            <h2 className="text-xl font-semibold">Money & timing</h2>
            <div className="field-grid two">
              <Field label="Status">
                <select
                  value={desire.stage}
                  onChange={(e) =>
                    void patch({ stage: e.target.value as LifecycleStage })
                  }
                >
                  {(
                    Object.entries(STAGE_LABELS) as [LifecycleStage, string][]
                  ).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Rough cost">
                <input
                  className="mono"
                  type="number"
                  value={desire.estCost ?? ""}
                  onChange={(e) =>
                    void patch({
                      estCost: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  placeholder="0"
                />
              </Field>
              <Field label="Buy around">
                <input
                  className="mono"
                  type="date"
                  value={desire.buyWindowStart ?? ""}
                  onChange={(e) =>
                    void patch({ buyWindowStart: e.target.value || null })
                  }
                />
              </Field>
              <Field label="What's stopping you?">
                <input
                  value={desire.blockers}
                  onChange={(e) => void patch({ blockers: e.target.value })}
                  placeholder="Money, time, not sure yet…"
                />
              </Field>
            </div>
          </section>

          <section className="panel space-y-4">
            <h2 className="text-xl font-semibold">If you bought it</h2>
            <div className="field-grid two">
              <Field label="Bought on">
                <input
                  className="mono"
                  type="date"
                  value={desire.purchasedAt?.slice(0, 10) ?? ""}
                  onChange={(e) =>
                    void patch({
                      purchasedAt: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : null,
                    })
                  }
                />
              </Field>
              <Field label="How did you get it?">
                <select
                  value={desire.channel}
                  onChange={(e) =>
                    void patch({
                      channel: e.target.value as PurchaseChannel,
                    })
                  }
                >
                  <option value="">Pick one</option>
                  <option value="store">In store</option>
                  <option value="online">Online</option>
                  <option value="gift">Gift</option>
                  <option value="other">Other</option>
                </select>
              </Field>
              <Field label="Price paid">
                <input
                  className="mono"
                  type="number"
                  value={desire.pricePaid ?? ""}
                  onChange={(e) =>
                    void patch({
                      pricePaid: e.target.value
                        ? Number(e.target.value)
                        : null,
                    })
                  }
                  placeholder="0"
                />
              </Field>
              <Field label="How are you using it?">
                <input
                  value={desire.usageNow}
                  onChange={(e) => void patch({ usageNow: e.target.value })}
                  placeholder="Daily, weekends, for work…"
                />
              </Field>
            </div>
          </section>

          <section className="panel space-y-4">
            <h2 className="text-xl font-semibold">What's next</h2>
            <Field label="What could this lead to?">
              <textarea
                value={desire.unlocksNext}
                onChange={(e) => void patch({ unlocksNext: e.target.value })}
                placeholder="Next item, skill, or project…"
              />
            </Field>
          </section>

          <JournalSection
            desireId={desire.id}
            userId={user?.id ?? desire.userId}
            seedPrompt={seedPrompt}
          />

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={async () => {
                if (!user?.id) return;
                const focused = await db.desires
                  .where("userId")
                  .equals(user.id)
                  .filter((d) => d.focus)
                  .toArray();
                await Promise.all(
                  focused.map((d) => touchDesire(d.id, { focus: false })),
                );
                await patch({ focus: true });
              }}
            >
              Pin to dashboard
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={async () => {
                if (!confirm("Delete this item?")) return;
                await softDeleteDesire(desire.id);
                router.push("/horizon");
              }}
            >
              Delete
            </button>
          </div>
        </div>

        <AiPanel desire={desire} onApply={onAiApply} />
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label>{label}</label>
      {children}
    </div>
  );
}
