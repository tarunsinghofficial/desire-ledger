"use client";

import { CATEGORIES } from "@/lib/categories";

export function CategoryChips({
  value,
  onChange,
  allowAll = false,
}: {
  value: string;
  onChange: (id: string) => void;
  allowAll?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {allowAll && (
        <button
          type="button"
          onClick={() => onChange("all")}
          className={`chip ${value === "all" ? "chip-active" : ""}`}
        >
          All
        </button>
      )}
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onChange(c.id)}
          className={`chip ${value === c.id ? "chip-active" : ""}`}
          title={c.hint}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
