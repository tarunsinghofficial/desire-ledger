"use client";

import { useUser } from "@clerk/nextjs";
import { useLiveQuery } from "dexie-react-hooks";
import { useMemo, useState } from "react";
import { CategoryChips } from "@/components/CategoryChips";
import { DesireList } from "@/components/DesireList";
import { getActiveDesires } from "@/lib/db";

export default function VaultPage() {
  const { user } = useUser();
  const userId = user?.id ?? "";
  const [category, setCategory] = useState("all");
  const desires =
    useLiveQuery(
      () => (userId ? getActiveDesires(userId) : Promise.resolve([])),
      [userId],
    ) ?? [];

  const owned = useMemo(
    () =>
      desires
        .filter((d) =>
          ["owned", "in_use", "growing", "legacy"].includes(d.stage),
        )
        .filter((d) => category === "all" || d.category === category),
    [desires, category],
  );

  return (
    <div className="animate-fade space-y-6">
      <header className="space-y-4">
        <div>
          <h1 className="text-3xl font-semibold text-deep-fir md:text-4xl">
            Owned
          </h1>
          <p className="mt-2 max-w-2xl text-fir-muted">
            Things you already bought, by category.
          </p>
        </div>
        <CategoryChips value={category} onChange={setCategory} allowAll />
      </header>
      <DesireList
        desires={owned}
        empty="Nothing owned yet. Mark an item as Bought when you get it."
      />
    </div>
  );
}
