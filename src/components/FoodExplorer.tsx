"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Establishment, PartnerBenefit } from "@/data/types";
import {
  defaultFoodFilters,
  deriveFoodOptions,
  filterFoodEstablishments,
  parseFoodState,
  serializeFoodState,
  sortFoodEstablishments,
  type FoodFilters,
  type FoodSort,
} from "@/lib/establishment-rules";
import { CompactEstablishmentCard } from "./CompactEstablishmentCard";
import { EstablishmentCard } from "./EstablishmentCard";
import { MapPlaceholder } from "./MapPlaceholder";
import { EmptyState } from "./States";

function FilterControls({ filters, onChange, establishments, idPrefix }: { filters: FoodFilters; onChange: (next: FoodFilters) => void; establishments: Establishment[]; idPrefix: string }) {
  const options = useMemo(() => deriveFoodOptions(establishments), [establishments]);
  const fieldClass = "min-h-11 w-full border border-[var(--line)] bg-white px-3 text-sm";
  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold" htmlFor={`${idPrefix}-cuisine`}>Gastronomia</label>
      <select id={`${idPrefix}-cuisine`} className={fieldClass} value={filters.cuisine} onChange={(event) => onChange({ ...filters, cuisine: event.target.value })}>
        <option value="">Todas</option>
        {options.cuisines.map((cuisine) => <option key={cuisine}>{cuisine}</option>)}
      </select>

      <label className="block text-sm font-bold" htmlFor={`${idPrefix}-ticket`}>Ticket máximo</label>
      <select id={`${idPrefix}-ticket`} className={fieldClass} value={filters.ticketMax ?? ""} onChange={(event) => onChange({ ...filters, ticketMax: event.target.value ? Number(event.target.value) : null })}>
        <option value="">Qualquer valor</option>
        <option value="40">Até R$ 40</option>
        <option value="60">Até R$ 60</option>
        <option value="100">Até R$ 100</option>
      </select>

      <label className="block text-sm font-bold" htmlFor={`${idPrefix}-vr`}>Cartão VR</label>
      <select id={`${idPrefix}-vr`} className={fieldClass} value={filters.vrCard} onChange={(event) => onChange({ ...filters, vrCard: event.target.value })}>
        <option value="">Todos</option>
        {options.vrCards.map((card) => <option key={card}>{card}</option>)}
      </select>

      <label className="block text-sm font-bold" htmlFor={`${idPrefix}-walk`}>Tempo de caminhada</label>
      <select id={`${idPrefix}-walk`} className={fieldClass} value={filters.maxWalkingMinutes ?? ""} onChange={(event) => onChange({ ...filters, maxWalkingMinutes: event.target.value ? Number(event.target.value) : null })}>
        <option value="">Qualquer tempo</option>
        <option value="5">Até 5 minutos</option>
        <option value="10">Até 10 minutos</option>
        <option value="15">Até 15 minutos</option>
      </select>

      <label className="flex min-h-11 items-center gap-3 border border-[var(--line)] px-3 text-sm font-bold">
        <input type="checkbox" checked={filters.partnersOnly} onChange={(event) => onChange({ ...filters, partnersOnly: event.target.checked })} className="h-5 w-5" />
        Somente conveniados
      </label>
    </div>
  );
}

export function FoodExplorer({ establishments, benefits }: { establishments: Establishment[]; benefits: PartnerBenefit[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [initial] = useState(() =>
    parseFoodState(new URLSearchParams(searchParams.toString())),
  );
  const [filters, setFilters] = useState<FoodFilters>(initial.filters);
  const [sort, setSort] = useState<FoodSort>(initial.sort);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [selectedSlug, setSelectedSlug] = useState<string>();

  const result = useMemo(
    () => sortFoodEstablishments(filterFoodEstablishments(establishments, filters, benefits), sort),
    [establishments, filters, benefits, sort],
  );
  const query = useMemo(() => serializeFoodState(filters, sort), [filters, sort]);

  useEffect(() => {
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, query, router]);

  const activeSelectedSlug = result.some((item) => item.slug === selectedSlug)
    ? selectedSlug
    : result[0]?.slug;

  const benefitBySlug = useMemo(() => new Map(benefits.map((benefit) => [benefit.establishmentSlug, benefit])), [benefits]);
  const clear = () => {
    setFilters(defaultFoodFilters);
    setSort("walking");
  };
  const sortControl = (id: string) => (
    <label className="flex items-center gap-2 text-sm font-bold" htmlFor={id}>
      Ordenar
      <select id={id} value={sort} onChange={(event) => setSort(event.target.value as FoodSort)} className="min-h-11 border border-[var(--line)] bg-white px-3 font-normal">
        <option value="walking">Menos minutos a pé</option>
        <option value="ticket">Menor ticket</option>
        <option value="name">Nome</option>
      </select>
    </label>
  );

  return (
    <>
      <div className="lg:hidden">
        <div className="space-y-3 px-4 py-4">
          <label className="sr-only" htmlFor="mobile-food-search">Pesquisar por nome</label>
          <input id="mobile-food-search" type="search" placeholder="Pesquisar restaurante" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} className="min-h-12 w-full border border-[var(--line)] px-4" />
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button type="button" aria-pressed={filters.partnersOnly} onClick={() => setFilters({ ...filters, partnersOnly: !filters.partnersOnly })} className={`min-h-11 shrink-0 border px-4 text-sm font-bold ${filters.partnersOnly ? "border-[var(--forest)] bg-[var(--forest)] text-white" : "border-[var(--line)] bg-white"}`}>Conveniados</button>
            {[5, 10, 15].map((minutes) => <button key={minutes} type="button" aria-pressed={filters.maxWalkingMinutes === minutes} onClick={() => setFilters({ ...filters, maxWalkingMinutes: filters.maxWalkingMinutes === minutes ? null : minutes })} className={`min-h-11 shrink-0 border px-4 text-sm font-bold ${filters.maxWalkingMinutes === minutes ? "border-[var(--forest)] bg-[var(--leaf)] text-[var(--forest)]" : "border-[var(--line)] bg-white"}`}>Até {minutes} min</button>)}
          </div>
          <details className="border border-[var(--line)] bg-[var(--soft)] p-3">
            <summary className="min-h-11 font-bold text-[var(--forest)]">Todos os filtros</summary>
            <div className="mt-3"><FilterControls filters={filters} onChange={setFilters} establishments={establishments} idPrefix="mobile" /></div>
          </details>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-[var(--muted)]" aria-live="polite"><strong className="text-[var(--ink)]">{result.length}</strong> opções</p>
            {sortControl("mobile-sort")}
          </div>
          <div className="grid grid-cols-2 border border-[var(--line)] p-1" aria-label="Visualização">
            <button type="button" aria-pressed={mobileView === "list"} onClick={() => setMobileView("list")} className={`min-h-11 font-bold ${mobileView === "list" ? "bg-[var(--forest)] text-white" : "bg-white"}`}>Lista</button>
            <button type="button" aria-pressed={mobileView === "map"} onClick={() => setMobileView("map")} className={`min-h-11 font-bold ${mobileView === "map" ? "bg-[var(--forest)] text-white" : "bg-white"}`}>Mapa</button>
          </div>
        </div>
        <div className="space-y-3 px-4 pb-24">
          {!result.length ? <EmptyState description="Nenhum restaurante combina com todos os filtros selecionados." onClear={clear} /> : mobileView === "map" ? <MapPlaceholder items={result} selectedSlug={activeSelectedSlug} onSelect={setSelectedSlug} className="min-h-[32rem]" /> : result.map((establishment) => <CompactEstablishmentCard key={establishment.slug} establishment={establishment} benefit={benefitBySlug.get(establishment.slug)} returnQuery={query} />)}
        </div>
      </div>

      <div className="hidden min-h-[calc(100vh-14rem)] grid-cols-[16rem_minmax(25rem,34rem)_minmax(28rem,1fr)] border-y border-[var(--line)] lg:grid">
        <aside className="border-r border-[var(--line)] bg-[var(--soft)] p-5">
          <h2 className="text-lg font-bold text-[var(--forest)]">Filtrar opções</h2>
          <div className="mt-5"><FilterControls filters={filters} onChange={setFilters} establishments={establishments} idPrefix="desktop" /></div>
          <button type="button" onClick={clear} className="mt-5 min-h-11 w-full border border-[var(--forest)] text-sm font-bold text-[var(--forest)]">Limpar filtros</button>
        </aside>
        <section className="max-h-[calc(100vh-8rem)] overflow-y-auto border-r border-[var(--line)] p-5" aria-label="Restaurantes encontrados">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-[var(--muted)]" aria-live="polite"><strong className="text-[var(--ink)]">{result.length}</strong> opções encontradas</p>
            {sortControl("desktop-sort")}
          </div>
          <label className="sr-only" htmlFor="desktop-food-search">Pesquisar por nome</label>
          <input id="desktop-food-search" type="search" placeholder="Pesquisar restaurante ou gastronomia" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} className="mb-4 min-h-12 w-full border border-[var(--line)] px-4" />
          <div className="space-y-3">{!result.length ? <EmptyState description="Nenhum restaurante combina com todos os filtros selecionados." onClear={clear} /> : result.map((establishment) => <EstablishmentCard key={establishment.slug} establishment={establishment} benefit={benefitBySlug.get(establishment.slug)} returnQuery={query} selected={activeSelectedSlug === establishment.slug} onSelect={() => setSelectedSlug(establishment.slug)} />)}</div>
        </section>
        <aside className="sticky top-0 h-[calc(100vh-8rem)] p-5">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-bold text-[var(--forest)]">Área cartográfica</h2><span className="text-xs text-[var(--muted)]">posições simuladas</span></div>
          <MapPlaceholder items={result} selectedSlug={activeSelectedSlug} onSelect={setSelectedSlug} className="h-[calc(100%-2rem)] min-h-[30rem]" />
        </aside>
      </div>
    </>
  );
}
