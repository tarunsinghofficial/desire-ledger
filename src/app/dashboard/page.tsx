"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { categoryLabel } from "@/lib/categories";
import { getActiveDesires } from "@/lib/db";
import { STAGE_LABELS } from "@/lib/types";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const userId = user?.id ?? "";
  const desires =
    useLiveQuery(
      () => (userId ? getActiveDesires(userId) : Promise.resolve([])),
      [userId],
    ) ?? [];

  const focus =
    desires.find((d) => d.focus) ??
    desires.find((d) => d.stage === "ready" || d.stage === "research") ??
    desires[0];

  if (!isLoaded) {
    return <p className="text-fir-muted">Loading…</p>;
  }

  return (
    <div className="animate-fade page-stack">
      <section className="hero-block min-h-[56vh] md:min-h-[52vh]">
        <p className="text-sm font-medium tracking-wide text-sulu">
          Your dashboard
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-white md:text-6xl">
          {focus?.title || "What do you want next?"}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
          {focus?.essence ||
            "A simple place for travel, tech, lifestyle goals — and when to buy them."}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          {focus ? (
            <Link href={`/desire/${focus.id}`} className="btn btn-primary">
              Open item
            </Link>
          ) : (
            <Link href="/capture" className="btn btn-primary">
              Add first item
            </Link>
          )}
          <Link
            href="/horizon"
            className="btn rounded-full border border-white/25 bg-transparent text-white hover:bg-white/10"
          >
            See to-buy list
          </Link>
        </div>
        {focus && (
          <div className="mt-8 flex flex-wrap gap-2">
            <span className="chip">{categoryLabel(focus.category)}</span>
            <span className="chip bg-white/10 text-white">
              {STAGE_LABELS[focus.stage]}
            </span>
            {focus.estCost != null && (
              <span className="chip bg-white/10 text-white">
                {focus.currency} {focus.estCost.toLocaleString()}
              </span>
            )}
          </div>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-3 md:gap-5">
        <Stat label="All items" value={String(desires.length)} />
        <Stat
          label="Ready to buy"
          value={String(desires.filter((d) => d.stage === "ready").length)}
        />
        <Stat
          label="Already owned"
          value={String(
            desires.filter((d) =>
              ["owned", "in_use", "growing", "legacy"].includes(d.stage),
            ).length,
          )}
        />
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel-soft">
      <p className="text-sm text-fir-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-deep-fir">{value}</p>
    </div>
  );
}
