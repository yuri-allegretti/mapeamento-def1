"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Establishment } from "@/data/types";
import { establishmentRoute } from "@/lib/routes";
import { MapPlaceholder } from "./MapPlaceholder";
import { WalkingTime } from "./WalkingTime";

export function RegionExplorer({ establishments }: { establishments: Establishment[] }) {
  const [category, setCategory] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(establishments[0]?.slug);
  const [mobileMapOpen, setMobileMapOpen] = useState(false);
  const categories = useMemo(() => [...new Map(establishments.map((item) => [item.category, item.categoryLabel])).entries()], [establishments]);
  const visible = category ? establishments.filter((item) => item.category === category) : establishments;
  const selected = visible.find((item) => item.slug === selectedSlug) ?? visible[0];
  const selectCategory = (next: string) => {
    setCategory(next);
    const first = next ? establishments.find((item) => item.category === next) : establishments[0];
    setSelectedSlug(first?.slug);
  };

  return (
    <>
      <section className="lg:hidden">
        <div className="grid grid-cols-2 gap-2" aria-label="Categorias da região">
          {categories.map(([value, label]) => <button type="button" key={value} aria-pressed={category === value} onClick={() => selectCategory(category === value ? "" : value)} className={`min-h-14 border px-3 text-left text-sm font-bold ${category === value ? "border-[var(--forest)] bg-[var(--leaf)] text-[var(--forest)]" : "border-[var(--line)] bg-white"}`}>{label}<span className="mt-1 block text-xs font-normal text-[var(--muted)]">{establishments.filter((item) => item.category === value).length} referências</span></button>)}
        </div>
        <button type="button" onClick={() => setMobileMapOpen((open) => !open)} aria-expanded={mobileMapOpen} className="mt-4 min-h-12 w-full bg-[var(--forest)] px-4 font-bold text-white">{mobileMapOpen ? "Fechar mapa estrutural" : "Abrir mapa estrutural"}</button>
        {mobileMapOpen && <div className="mt-3"><MapPlaceholder items={visible} selectedSlug={selected?.slug} onSelect={setSelectedSlug} className="min-h-[28rem]" /></div>}
        <div className="mt-6 space-y-3">
          {visible.slice(0, 6).map((item) => <article key={item.slug} className="border border-[var(--line)] bg-white p-4"><p className="text-xs font-bold uppercase text-[var(--muted)]">{item.categoryLabel} · {item.subcategory}</p><h3 className="mt-1 text-lg font-bold text-[var(--forest)]">{item.name}</h3><div className="mt-2"><WalkingTime minutes={item.walkingMinutes} compact /></div><Link href={`${establishmentRoute(item.slug)}?from=regiao`} className="mt-3 inline-flex min-h-11 items-center font-bold text-[var(--forest)] underline">Ver detalhes</Link></article>)}
        </div>
      </section>

      <section className="hidden grid-cols-[17rem_minmax(30rem,1fr)_20rem] border border-[var(--line)] lg:grid">
        <aside className="bg-[var(--soft)] p-5">
          <h2 className="font-bold text-[var(--forest)]">Camadas</h2>
          <div className="mt-4 space-y-2">
            <button type="button" aria-pressed={!category} onClick={() => selectCategory("")} className={`min-h-11 w-full border px-3 text-left text-sm font-bold ${!category ? "border-[var(--forest)] bg-[var(--leaf)]" : "border-[var(--line)] bg-white"}`}>Todas as categorias</button>
            {categories.map(([value, label]) => <button type="button" key={value} aria-pressed={category === value} onClick={() => selectCategory(value)} className={`min-h-11 w-full border px-3 text-left text-sm font-bold ${category === value ? "border-[var(--forest)] bg-[var(--leaf)]" : "border-[var(--line)] bg-white"}`}>{label}<span className="float-right text-[var(--muted)]">{establishments.filter((item) => item.category === value).length}</span></button>)}
          </div>
        </aside>
        <MapPlaceholder items={visible} selectedSlug={selected?.slug} onSelect={setSelectedSlug} className="min-h-[38rem] border-y-0" />
        <aside className="p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Ponto selecionado</p>
          {selected ? <div><h2 className="mt-2 text-xl font-bold text-[var(--forest)]">{selected.name}</h2><p className="mt-2 text-sm text-[var(--muted)]">{selected.subcategory}</p><p className="mt-3 text-sm">{selected.description}</p><div className="mt-3"><WalkingTime minutes={selected.walkingMinutes} /></div><Link href={`${establishmentRoute(selected.slug)}?from=regiao`} className="mt-5 flex min-h-11 items-center justify-center border border-[var(--forest)] font-bold text-[var(--forest)]">Ver estabelecimento</Link></div> : <p className="mt-3 text-sm">Selecione um marcador.</p>}
          <div className="mt-6 border-t border-[var(--line)] pt-4"><p className="text-sm font-bold">O mapa é opcional</p><p className="mt-1 text-xs text-[var(--muted)]">Lista, endereços e detalhes continuam disponíveis sem a representação cartográfica.</p></div>
        </aside>
      </section>
    </>
  );
}
