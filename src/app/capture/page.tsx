"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CategoryChips } from "@/components/CategoryChips";
import { upsertDesire } from "@/lib/db";
import { emptyDesire } from "@/lib/types";

export default function CapturePage() {
  const { user } = useUser();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [why, setWhy] = useState("");
  const [estCost, setEstCost] = useState("");
  const [category, setCategory] = useState("tech");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !user?.id) return;
    setSaving(true);
    const desire = emptyDesire({
      userId: user.id,
      title: title.trim(),
      why: why.trim(),
      category,
      estCost: estCost ? Number(estCost) : null,
      focus: true,
    });
    const { db } = await import("@/lib/db");
    const focused = await db.desires
      .where("userId")
      .equals(user.id)
      .filter((d) => d.focus)
      .toArray();
    await Promise.all(
      focused.map((d) =>
        db.desires.update(d.id, {
          focus: false,
          dirty: true,
          updatedAt: new Date().toISOString(),
        }),
      ),
    );
    await upsertDesire(desire);
    router.push(`/desire/${desire.id}`);
  }

  return (
    <div className="animate-fade mx-auto max-w-xl space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-deep-fir md:text-4xl">
          Add item
        </h1>
        <p className="mt-2 text-fir-muted">
          Pick a category, then add the basics.
        </p>
      </header>
      <form onSubmit={(e) => void submit(e)} className="panel field-grid">
        <div>
          <label>Category</label>
          <CategoryChips value={category} onChange={setCategory} />
        </div>
        <div>
          <label htmlFor="title">What do you want?</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tokyo trip, new laptop, cooking class…"
            required
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="why">Why?</label>
          <textarea
            id="why"
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            placeholder="What will it help with?"
          />
        </div>
        <div>
          <label htmlFor="cost">Rough cost</label>
          <input
            id="cost"
            className="mono"
            inputMode="decimal"
            value={estCost}
            onChange={(e) => setEstCost(e.target.value)}
            placeholder="25000"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-fit"
          disabled={saving || !user}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </form>
    </div>
  );
}
