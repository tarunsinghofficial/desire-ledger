"use client";

import { useEffect, useState } from "react";
import { AiSpark } from "@/components/AiSpark";
import { LandingAuthCtas } from "@/components/AuthCtas";
import type { AiStatus } from "@/lib/ai/client";

export default function LandingPage() {
  const [ai, setAi] = useState<AiStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/ai/status")
      .then((res) => res.json())
      .then((data: AiStatus) => {
        if (!cancelled) setAi(data);
      })
      .catch(() => {
        if (!cancelled) {
          setAi({
            enabled: false,
            provider: null,
            model: null,
            label: "AI off",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const aiOn = Boolean(ai?.enabled);

  return (
    <div className="animate-fade page-stack">
      <section className="hero-block flex min-h-[70vh] flex-col justify-between md:min-h-[64vh]">
        <div className="flex items-start justify-between gap-5 md:gap-8">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-medium tracking-wide text-sulu">
                Desire Ledger
              </p>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  aiOn
                    ? "bg-sulu text-on-sulu"
                    : "bg-white/10 text-white/70"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    aiOn ? "bg-deep-fir" : "bg-white/45"
                  }`}
                />
                {ai?.label ?? "Checking AI…"}
              </span>
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-white md:text-6xl lg:text-7xl">
              Your bucket list, with a plan.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
              Track travel, tech, lifestyle goals — when to buy them, how you use
              them, and how they help you grow.
              {aiOn
                ? " AI can fill in details, suggest when to buy, and note how it helps you."
                : " Add items by hand anytime — AI help is available when it’s turned on."}
            </p>
          </div>

          <div
            className={`relative shrink-0 rounded-full p-3 md:p-4 ${
              aiOn ? "bg-sulu/15 ring-1 ring-sulu/40" : "bg-white/5 ring-1 ring-white/15"
            }`}
            title={ai?.label ?? "AI"}
          >
            <AiSpark size={56} active={aiOn} className="md:h-16 md:w-16" />
            {aiOn && (
              <span className="absolute -right-0.5 -bottom-0.5 rounded-full bg-sulu px-1.5 py-0.5 text-[10px] font-bold text-deep-fir">
                AI
              </span>
            )}
          </div>
        </div>

        <div className="mt-12 space-y-4 md:mt-14">
          <LandingAuthCtas />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3 md:gap-5">
        <Feature
          title="Plan the buy"
          body="Set a rough cost and when you might get it — no clutter."
        />
        <Feature
          title="Sort by category"
          body="Travel, tech, lifestyle, health, and more in one place."
        />
        <Feature
          title={aiOn ? "AI when you need it" : "AI is optional"}
          body={
            aiOn
              ? "Get help filling details, picking a buy time, and writing why it matters."
              : "You can still plan your list fully on your own."
          }
        />
      </section>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="panel-soft">
      <h2 className="text-lg font-semibold text-deep-fir">{title}</h2>
      <p className="mt-2 text-sm text-fir-muted">{body}</p>
    </div>
  );
}
