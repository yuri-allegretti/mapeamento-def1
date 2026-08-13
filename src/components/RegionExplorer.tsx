"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Establishment } from "@/data/types";
import { establishmentRoute } from "@/lib/routes";
import { CopyAddressButton } from "./CopyAddressButton";
import { Distance } from "./Distance";
import { GuideIcon } from "./GuideIcon";
import { Rating } from "./Rating";

function matchesSearch(establishment: Establishment, search: string) {
  const term = search.trim().toLocaleLowerCase("pt-BR");
  if (!term) return true;
  return [
    establishment.name,
    establishment.type,
    establishment.primaryCategoryLabel,
    establishment.address.line,
  ].some((value) => value.toLocaleLowerCase("pt-BR").includes(term));
}

export function RegionExplorer({ establishments }: { establishments: Establishment[] }) {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const categories = useMemo(
    () => [...new Map(establishments.map((item) => [item.primaryCategoryId, item.primaryCategoryLabel])).entries()].sort((a, b) => a[1].localeCompare(b[1], "pt-BR")),
    [establishments],
  );
  const visible = useMemo(
    () => establishments.filter((item) => (!category || item.primaryCategoryId === category) && matchesSearch(item, search)),
    [category, establishments, search],
  );

  const categoryButton = (value: string, label: string, count: number) => {
    const active = category === value;
    return <button type="button" key={value || "all"} aria-pressed={active} onClick={() => setCategory(value)} className={`min-h-12 w-full rounded-xl border px-3 text-left text-sm font-bold ${active ? "border-[var(--forest)] bg-[var(--forest)] text-white" : "border-[var(--line)] bg-white text-[var(--muted)] hover:border-[var(--leaf-strong)] hover:text-[var(--forest)]"}`}>{label}<span className={`float-right ml-2 rounded-full px-2 py-0.5 text-xs ${active ? "bg-white/15" : "bg-[var(--soft)]"}`}>{count}</span></button>;
  };

  const card = (item: Establishment) => (
    <article key={item.slug} className="card-surface card-interactive flex flex-col p-5">
      <p className="eyebrow">{item.primaryCategoryLabel} · {item.type}</p>
      <h2 className="mt-1 text-xl font-bold text-[var(--forest)]">{item.name}</h2>
      <div className="mt-2"><Rating rating={item.rating} compact /></div>
      <div className="mt-3"><Distance meters={item.distanceMeters} compact /></div>
      <p className="mt-3 text-sm text-[var(--muted)]">{item.address.line}</p>
      <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
        <CopyAddressButton address={item.address} className="button-primary min-h-11 px-3" />
        <Link href={`${establishmentRoute(item.slug)}?from=regiao`} className="button-secondary min-h-11 px-3">Ver detalhes</Link>
      </div>
    </article>
  );

  return (
    <section className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="card-surface self-start p-4 lg:sticky lg:top-24 lg:p-5">
        <label className="text-sm font-bold text-[var(--forest)]" htmlFor="region-search">Pesquisar na região</label>
        <div className="relative mt-2"><GuideIcon name="search" className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-[var(--muted)]" /><input id="region-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nome, tipo ou endereço" className="field-control pl-11" /></div>
        <h2 className="mt-5 font-bold text-[var(--forest)]">Categorias</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
          {categoryButton("", "Todas", establishments.length)}
          {categories.map(([value, label]) => categoryButton(value, label, establishments.filter((item) => item.primaryCategoryId === value).length))}
        </div>
      </aside>
      <div>
        <p className="mb-4 text-sm text-[var(--muted)]" aria-live="polite"><strong className="text-[var(--ink)]">{visible.length}</strong> estabelecimentos encontrados</p>
        {visible.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visible.map(card)}</div> : <div className="brand-pattern rounded-2xl border border-[var(--leaf-strong)] p-8 text-center"><h2 className="text-xl font-bold text-[var(--forest)]">Nenhum estabelecimento encontrado</h2><p className="mt-2 text-sm text-[var(--muted)]">Altere a busca ou selecione outra categoria.</p><button type="button" onClick={() => { setSearch(""); setCategory(""); }} className="button-secondary mt-5">Limpar busca</button></div>}
      </div>
    </section>
  );
}
