"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { CATEGORIES, categoryLabel } from "@/lib/categories";
import { getActiveDesires } from "@/lib/db";

export default function GrowthPage() {
  const { user } = useUser();
  const userId = user?.id ?? "";
  const desires =
    useLiveQuery(
      () => (userId ? getActiveDesires(userId) : Promise.resolve([])),
      [userId],
    ) ?? [];

  const groups = CATEGORIES.map((c) => ({
    ...c,
    items: desires.filter((d) => (d.category || "other") === c.id),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="animate-fade space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-deep-fir md:text-4xl">
          Growth
        </h1>
        <p className="mt-2 max-w-2xl text-fir-muted">
          Your items grouped by category — travel, tech, lifestyle, and more.
        </p>
      </header>

      {!groups.length ? (
        <div className="panel-soft text-fir-muted">
          Add items with a category to see them here.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g, i) => (
            <section
              key={g.id}
              className="animate-settle panel"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">{g.label}</h2>
                <span className="chip">{g.items.length}</span>
              </div>
              <p className="mb-4 text-sm text-fir-muted">{g.hint}</p>
              <ul className="space-y-2">
                {g.items.map((d) => (
                  <li key={d.id}>
                    <Link
                      href={`/desire/${d.id}`}
                      className="flex items-center justify-between gap-2 rounded-full bg-mist px-3 py-2 text-sm font-medium hover:bg-sulu-soft"
                    >
                      <span className="truncate">
                        {d.title || "Untitled"}
                      </span>
                      <span className="icon-btn !h-8 !w-8 text-sm">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {desires.some((d) => !CATEGORIES.find((c) => c.id === d.category)) && (
        <p className="text-sm text-fir-muted">
          Tip: set a category like {categoryLabel("travel")} on each item.
        </p>
      )}
    </div>
  );
}
