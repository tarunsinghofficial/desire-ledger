"use client";

import { useUser } from "@clerk/nextjs";
import { useLiveQuery } from "dexie-react-hooks";
import { useMemo, useState } from "react";
import { CategoryChips } from "@/components/CategoryChips";
import { DesireList } from "@/components/DesireList";
import { getActiveDesires } from "@/lib/db";

export default function HorizonPage() {
  const { user } = useUser();
  const userId = user?.id ?? "";
  const [category, setCategory] = useState("all");
  const desires =
    useLiveQuery(
      () => (userId ? getActiveDesires(userId) : Promise.resolve([])),
      [userId],
    ) ?? [];

  const timed = useMemo(() => {
    return desires
      .filter(
        (d) =>
          ["spark", "research", "ready"].includes(d.stage) ||
          d.buyWindowStart ||
          d.notBefore,
      )
      .filter((d) => category === "all" || d.category === category)
      .sort((a, b) => {
        const da = a.buyWindowStart || a.notBefore || "9999";
        const db_ = b.buyWindowStart || b.notBefore || "9999";
        return da.localeCompare(db_);
      });
  }, [desires, category]);

  return (
    <div className="animate-fade space-y-6">
      <header className="space-y-4">
        <div>
          <h1 className="text-3xl font-semibold text-deep-fir md:text-4xl">
            To buy
          </h1>
          <p className="mt-2 max-w-2xl text-fir-muted">
            Filter by category and plan when you’ll buy.
          </p>
        </div>
        <CategoryChips
          value={category}
          onChange={setCategory}
          allowAll
        />
      </header>
      <DesireList
        desires={timed}
        empty="Nothing here yet. Tap Add to save your first item."
      />
    </div>
  );
}
