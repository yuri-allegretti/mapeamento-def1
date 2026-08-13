"use client";

import { useMemo, useState } from "react";
import type { Establishment, PartnerBenefit } from "@/data/types";
import { PartnerCard } from "./PartnerCard";
import { EmptyState } from "./States";

type Entry = { establishment: Establishment; benefit: PartnerBenefit };

export function PartnerExplorer({ entries }: { entries: Entry[] }) {
  const [category, setCategory] = useState("");
  const categories = useMemo(() => [...new Map(entries.map((entry) => [entry.establishment.primaryCategoryId, entry.establishment.primaryCategoryLabel])).entries()], [entries]);
  const visible = category ? entries.filter((entry) => entry.establishment.primaryCategoryId === category) : entries;
  return (
    <section>
      <div className="flex gap-2 overflow-x-auto pb-2" aria-label="Filtrar parceiros por categoria">
        <button type="button" aria-pressed={!category} onClick={() => setCategory("")} className={`min-h-11 shrink-0 border px-4 text-sm font-bold ${!category ? "border-[var(--forest)] bg-[var(--forest)] text-white" : "border-[var(--line)]"}`}>Todos</button>
        {categories.map(([value, label]) => <button type="button" key={value} aria-pressed={category === value} onClick={() => setCategory(value)} className={`min-h-11 shrink-0 border px-4 text-sm font-bold ${category === value ? "border-[var(--forest)] bg-[var(--forest)] text-white" : "border-[var(--line)]"}`}>{label}</button>)}
      </div>
      <p className="mt-3 text-sm text-[var(--muted)]" aria-live="polite">{visible.length} parceiros demonstrativos</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visible.length ? visible.map((entry) => <PartnerCard key={entry.benefit.id} {...entry} />) : <EmptyState description="Não há parceiros demonstrativos nesta categoria." onClear={() => setCategory("")} />}</div>
    </section>
  );
}
