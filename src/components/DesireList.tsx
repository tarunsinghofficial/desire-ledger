"use client";

import Link from "next/link";
import { categoryLabel } from "@/lib/categories";
import { STAGE_LABELS, type Desire } from "@/lib/types";

export function DesireList({
  desires,
  empty,
}: {
  desires: Desire[];
  empty: string;
}) {
  if (!desires.length) {
    return (
      <div className="panel-soft text-fir-muted">
        <p>{empty}</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {desires.map((d, i) => (
        <li
          key={d.id}
          className="animate-settle overflow-hidden rounded-[1.25rem] border border-line bg-white"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <Link
            href={`/desire/${d.id}`}
            className="flex items-center gap-4 p-4 transition-colors hover:bg-mist md:p-5"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap gap-2">
                <span className="chip">{categoryLabel(d.category)}</span>
                <span className="chip bg-mist">{STAGE_LABELS[d.stage]}</span>
              </div>
              <h3 className="truncate text-xl font-semibold text-deep-fir md:text-2xl">
                {d.title || "Untitled"}
              </h3>
              {d.essence && (
                <p className="mt-1 line-clamp-2 text-sm text-fir-muted">
                  {d.essence}
                </p>
              )}
            </div>
            <div className="shrink-0 text-right">
              {d.estCost != null && (
                <div className="mono text-sm font-medium text-deep-fir">
                  {d.currency} {d.estCost.toLocaleString()}
                </div>
              )}
              {d.buyWindowStart && (
                <div className="mono mt-1 text-xs text-fir-muted">
                  {d.buyWindowStart}
                </div>
              )}
              <span className="icon-btn mt-3" aria-hidden>
                →
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
