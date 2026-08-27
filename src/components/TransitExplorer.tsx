"use client";

import { useMemo, useState } from "react";
import type { TransitDataset, TransitLine, TransitStop } from "@/data/types";
import { GuideIcon } from "./GuideIcon";
import { EmptyState } from "./States";

type View = "lines" | "stops";
type DistanceFilter = "upto300" | "301to600" | "601to1000";

const lineColors: Record<string, string> = {
  AMARELA: "#d89b16",
  VERDE: "#4f8f40",
  PRATA: "#737b73",
  MADRUGUEIRO: "#315a8a",
};

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

function matches(value: string | undefined, term: string) {
  return Boolean(value && normalize(value).includes(term));
}

function lineColor(line: TransitLine) {
  return lineColors[line.colorPattern ?? ""] ?? "#487d3b";
}

function distanceLabel(distanceMeters: number) {
  return `${distanceMeters.toLocaleString("pt-BR")} m do Aroeira`;
}

function lineTitle(line: TransitLine) {
  return `${line.code} · ${line.name}`;
}

function ExternalLink({ href, children, variant = "secondary" }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary" }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={`${variant === "primary" ? "button-primary" : "button-secondary"} min-h-11 px-3`}>{children}<GuideIcon name="arrow" className="h-4 w-4" /></a>;
}

function RecommendedStop({ stop }: { stop: TransitStop }) {
  return <div className="rounded-xl border border-[var(--leaf-strong)] bg-white p-4">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="rounded-full bg-[var(--leaf)] px-2.5 py-1 text-xs font-bold text-[var(--forest)]">Ponto recomendado</span>
      <strong className="text-sm text-[var(--forest)]">{distanceLabel(stop.distanceMeters)}</strong>
    </div>
    <p className="mt-3 font-bold leading-6 text-[var(--ink)]">{stop.name}</p>
    <p className="mt-1 text-xs text-[var(--muted)]">{stop.stopType}{stop.neighborhood ? ` · ${stop.neighborhood}` : ""}</p>
    {stop.stopType === "Sem demarcação" && <p className="mt-2 rounded-lg bg-[var(--sand)] px-3 py-2 text-xs font-semibold text-[var(--gold)]">A URBS registra este ponto sem demarcação física.</p>}
    <div className="mt-3"><ExternalLink href={stop.mapUrl}>Abrir localização</ExternalLink></div>
  </div>;
}

function LineCard({ line, stopsById, directionFilter }: { line: TransitLine; stopsById: Map<string, TransitStop>; directionFilter: string }) {
  const observedDirections = [...new Set(line.stops.flatMap((entry) => entry.directions))];
  const selectedDirections = directionFilter
    ? observedDirections.filter((direction) => matches(direction, directionFilter))
    : observedDirections;
  const directions = selectedDirections.length ? selectedDirections : observedDirections;

  return <article className="card-surface overflow-hidden" style={{ borderTop: `4px solid ${lineColor(line)}` }}>
    <div className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">{line.category}</p>
          <h3 className="mt-1 text-xl font-bold text-[var(--forest)]">{lineTitle(line)}</h3>
        </div>
        {line.cardOnly && <span className="rounded-full bg-[var(--sand)] px-3 py-1.5 text-xs font-bold text-[var(--gold)]">Somente cartão</span>}
      </div>

      <div className="mt-5 space-y-4">
        {directions.map((direction) => {
          const stops = line.stops
            .filter((entry) => entry.directions.includes(direction))
            .map((entry) => stopsById.get(entry.stopId))
            .filter((stop): stop is TransitStop => Boolean(stop))
            .sort((a, b) => a.distanceMeters - b.distanceMeters);
          const [recommended, ...alternatives] = stops;
          if (!recommended) return null;
          return <section key={direction} className="rounded-2xl bg-[var(--soft)] p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Sentido / destino</p>
            <h4 className="mt-1 text-lg font-bold text-[var(--forest)]">{direction}</h4>
            <div className="mt-3"><RecommendedStop stop={recommended} /></div>
            {alternatives.length > 0 && <details className="mt-3 rounded-xl border border-[var(--line)] bg-white p-3">
              <summary className="min-h-8 cursor-pointer font-bold text-[var(--forest)]">Ver {alternatives.length} {alternatives.length === 1 ? "alternativa" : "alternativas"}</summary>
              <ul className="mt-2 divide-y divide-[var(--line)]">
                {alternatives.map((stop) => <li key={stop.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div><p className="text-sm font-semibold">{stop.name}</p><p className="mt-1 text-xs text-[var(--muted)]">{distanceLabel(stop.distanceMeters)} · {stop.stopType}</p></div>
                  <a href={stop.mapUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[var(--forest)] underline decoration-[var(--leaf-strong)] underline-offset-4">Abrir localização</a>
                </li>)}
              </ul>
            </details>}
          </section>;
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
        <p className="text-xs text-[var(--muted)]">Fonte atualizada em {line.sourceUpdatedAt}</p>
        <ExternalLink href={line.scheduleUrl} variant="primary">Ver horários na URBS</ExternalLink>
      </div>
    </div>
  </article>;
}

function StopCard({ stop, linesByCode }: { stop: TransitStop; linesByCode: Map<string, TransitLine> }) {
  const services = stop.services.flatMap((service) => {
    const line = linesByCode.get(service.lineCode);
    return line?.publicationStatus === "published" ? [{ line, directions: service.directions }] : [];
  });

  return <article className="card-surface p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="eyebrow">Ponto oficial URBS · {stop.id}</p>
        <h3 className="mt-1 text-lg font-bold leading-6 text-[var(--forest)]">{stop.name}</h3>
      </div>
      <span className="rounded-full bg-[var(--leaf)] px-3 py-1.5 text-xs font-bold text-[var(--forest)]">{distanceLabel(stop.distanceMeters)}</span>
    </div>
    <p className="mt-3 text-sm text-[var(--muted)]">{stop.stopType}{stop.neighborhood ? ` · ${stop.neighborhood}` : ""}</p>
    {stop.stopType === "Sem demarcação" && <p className="mt-3 rounded-lg bg-[var(--sand)] px-3 py-2 text-xs font-semibold text-[var(--gold)]">Ponto cadastrado sem demarcação física.</p>}
    <div className="mt-4 space-y-2">
      {services.map(({ line, directions }) => <div key={line.code} className="rounded-xl border-l-4 bg-[var(--soft)] p-3" style={{ borderLeftColor: lineColor(line) }}>
        <strong className="text-sm text-[var(--forest)]">{lineTitle(line)}</strong>
        <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{directions.join(" · ")}</p>
      </div>)}
    </div>
    <div className="mt-5"><ExternalLink href={stop.mapUrl} variant="primary">Abrir localização</ExternalLink></div>
  </article>;
}

function PendingLines({ lines }: { lines: TransitLine[] }) {
  return <section className="border-t border-[var(--line)] bg-[var(--soft)]">
    <div className="page-shell py-10 lg:py-14">
      <p className="eyebrow">Transparência dos dados</p>
      <h2 className="mt-2 text-3xl font-bold text-[var(--forest)]">Linhas em validação</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">Estas linhas constam nas fontes oficiais, mas ainda não têm uma orientação de embarque segura para publicação. Por isso, não exibimos ponto nem distância.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {lines.map((line) => <article key={line.code} className="rounded-2xl border border-[var(--line)] bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--gold)]">{line.system === "urban" ? "Urbana" : "Metropolitana"} · em validação</p>
          <h3 className="mt-2 text-lg font-bold text-[var(--forest)]">{lineTitle(line)}</h3>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{line.observations ?? line.operationalStatus}</p>
          <a href={line.scheduleUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 font-bold text-[var(--forest)] underline decoration-[var(--leaf-strong)] underline-offset-4">Consultar fonte oficial<GuideIcon name="arrow" className="h-4 w-4" /></a>
        </article>)}
      </div>
    </div>
  </section>;
}

export function TransitExplorer({ data }: { data: TransitDataset }) {
  const [view, setView] = useState<View>("lines");
  const [search, setSearch] = useState("");
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>("upto300");
  const term = normalize(search.trim());
  const publishedLines = useMemo(() => data.lines.filter((line) => line.publicationStatus === "published"), [data.lines]);
  const pendingLines = useMemo(() => data.lines.filter((line) => line.publicationStatus === "pending"), [data.lines]);
  const stopsById = useMemo(() => new Map(data.stops.map((stop) => [stop.id, stop])), [data.stops]);
  const linesByCode = useMemo(() => new Map(data.lines.map((line) => [line.code, line])), [data.lines]);

  const quickDestinations = useMemo(() => {
    const counts = new Map<string, number>();
    for (const direction of publishedLines.flatMap((line) => line.directions)) {
      if (/horário|circular/i.test(direction)) continue;
      counts.set(direction, (counts.get(direction) ?? 0) + 1);
    }
    return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "pt-BR")).slice(0, 6).map(([direction]) => direction);
  }, [publishedLines]);

  const visibleLines = useMemo(() => publishedLines.filter((line) => {
    if (!term) return true;
    const relatedStops = line.stops.map((entry) => stopsById.get(entry.stopId)).filter((stop): stop is TransitStop => Boolean(stop));
    return [line.code, line.name, line.category, ...line.directions, ...relatedStops.flatMap((stop) => [stop.name, stop.neighborhood ?? ""])].some((value) => matches(value, term));
  }), [publishedLines, stopsById, term]);

  const visibleStops = useMemo(() => data.stops.filter((stop) => {
    const inBand = distanceFilter === "upto300" ? stop.distanceMeters <= 300 : distanceFilter === "301to600" ? stop.distanceMeters >= 301 && stop.distanceMeters <= 600 : stop.distanceMeters >= 601;
    if (!inBand) return false;
    if (!term) return true;
    const services = stop.services.flatMap((service) => {
      const line = linesByCode.get(service.lineCode);
      return line?.publicationStatus === "published" ? [line.code, line.name, ...service.directions] : [];
    });
    return [stop.id, stop.name, stop.neighborhood ?? "", stop.stopType, ...services].some((value) => matches(value, term));
  }), [data.stops, distanceFilter, linesByCode, term]);

  const clearSearch = () => setSearch("");

  return <>
    <section className="page-shell py-8 lg:py-10">
      <div className="card-surface p-4 sm:p-6">
        <label htmlFor="transit-search" className="text-sm font-bold text-[var(--forest)]">Buscar linha, destino ou ponto</label>
        <div className="relative mt-2">
          <GuideIcon name="search" className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-[var(--muted)]" />
          <input id="transit-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ex.: 371, Carlos Gomes ou Av. Victor" className="field-control pl-12" />
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Destinos frequentes">
          {quickDestinations.map((destination) => <button key={destination} type="button" onClick={() => setSearch(destination)} className="min-h-10 shrink-0 rounded-full border border-[var(--line)] bg-white px-4 text-xs font-bold text-[var(--forest)] hover:border-[var(--leaf-strong)] hover:bg-[var(--leaf)]">{destination}</button>)}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-[var(--soft)] p-1.5" aria-label="Visualização de transporte">
        <button type="button" aria-pressed={view === "lines"} onClick={() => setView("lines")} className={`min-h-12 rounded-lg px-3 text-sm font-bold ${view === "lines" ? "bg-[var(--forest)] text-white shadow-sm" : "text-[var(--muted)] hover:bg-white"}`}>Linhas e destinos</button>
        <button type="button" aria-pressed={view === "stops"} onClick={() => setView("stops")} className={`min-h-12 rounded-lg px-3 text-sm font-bold ${view === "stops" ? "bg-[var(--forest)] text-white shadow-sm" : "text-[var(--muted)] hover:bg-white"}`}>Pontos próximos</button>
      </div>
    </section>

    <section className="page-shell pb-12 lg:pb-16">
      {view === "lines" ? <>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div><p className="eyebrow">Opções confirmadas</p><h2 className="mt-1 text-2xl font-bold text-[var(--forest)]">Linhas urbanas por sentido</h2></div>
          <p className="text-sm text-[var(--muted)]" role="status" aria-live="polite"><strong className="text-[var(--ink)]">{visibleLines.length}</strong> {visibleLines.length === 1 ? "linha encontrada" : "linhas encontradas"}</p>
        </div>
        {visibleLines.length ? <div className="grid gap-5 xl:grid-cols-2">{visibleLines.map((line) => <LineCard key={line.code} line={line} stopsById={stopsById} directionFilter={term} />)}</div> : <EmptyState description="Nenhuma linha confirmada combina com a sua busca." onClear={clearSearch} />}
      </> : <>
        <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div><p className="eyebrow">Distância em linha reta</p><h2 className="mt-1 text-2xl font-bold text-[var(--forest)]">Pontos oficiais próximos</h2></div>
          <label className="text-sm font-bold text-[var(--forest)]" htmlFor="transit-distance">Faixa de distância<select id="transit-distance" value={distanceFilter} onChange={(event) => setDistanceFilter(event.target.value as DistanceFilter)} className="field-control mt-1 min-w-48 font-normal text-[var(--ink)]"><option value="upto300">Até 300 m</option><option value="301to600">301–600 m</option><option value="601to1000">601–1.000 m</option></select></label>
        </div>
        <p className="mb-4 text-sm text-[var(--muted)]" role="status" aria-live="polite"><strong className="text-[var(--ink)]">{visibleStops.length}</strong> {visibleStops.length === 1 ? "ponto encontrado" : "pontos encontrados"}</p>
        {visibleStops.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visibleStops.map((stop) => <StopCard key={stop.id} stop={stop} linesByCode={linesByCode} />)}</div> : <EmptyState description="Nenhum ponto combina com a faixa e a busca selecionadas." onClear={clearSearch} />}
      </>}
    </section>

    <PendingLines lines={pendingLines} />
  </>;
}
