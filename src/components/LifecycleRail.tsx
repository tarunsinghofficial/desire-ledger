"use client";

import {
  LIFECYCLE_STAGES,
  STAGE_LABELS,
  type LifecycleStage,
} from "@/lib/types";

export function LifecycleRail({
  stage,
  onChange,
}: {
  stage: LifecycleStage;
  onChange?: (stage: LifecycleStage) => void;
}) {
  const activeIndex = LIFECYCLE_STAGES.indexOf(stage);

  return (
    <div className="mt-8 pt-2">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
        Status
      </p>
      <div className="relative px-1 pb-1">
        <div
          className="pointer-events-none absolute top-[0.55rem] right-4 left-4 h-0.5 rounded-full bg-white/20"
          aria-hidden
        />
        <ol className="relative flex justify-between gap-1">
          {LIFECYCLE_STAGES.map((s, i) => {
            const active = s === stage;
            const passed = i <= activeIndex;
            return (
              <li
                key={s}
                className="flex w-full min-w-0 flex-col items-center gap-2.5"
              >
                <button
                  type="button"
                  disabled={!onChange}
                  onClick={() => onChange?.(s)}
                  className={`relative z-10 box-border h-4 w-4 shrink-0 rounded-full border-2 transition-colors ${
                    active
                      ? "border-sulu bg-sulu shadow-[0_0_0_4px_rgba(159,232,112,0.28)]"
                      : passed
                        ? "border-sulu bg-sulu/50"
                        : "border-white/45 bg-deep-fir"
                  } ${onChange ? "cursor-pointer hover:border-sulu" : "cursor-default"}`}
                  aria-label={STAGE_LABELS[s]}
                  aria-current={active ? "step" : undefined}
                />
                <span
                  className={`max-w-full px-0.5 text-center text-[10px] font-semibold leading-snug sm:text-[11px] ${
                    active ? "text-sulu" : "text-white/70"
                  }`}
                >
                  {STAGE_LABELS[s]}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
