import Link from "next/link";
import type { Establishment, PartnerBenefit } from "@/data/types";
import { establishmentRoute } from "@/lib/routes";
import { WalkingTime } from "./WalkingTime";
import { VrList } from "./VrList";

export function EstablishmentCard({ establishment, benefit, returnQuery, selected = false, onSelect }: { establishment: Establishment; benefit?: PartnerBenefit; returnQuery?: string; selected?: boolean; onSelect?: () => void }) {
  const params = new URLSearchParams({ from: "onde-comer" });
  if (returnQuery) params.set("returnQuery", returnQuery);

  return (
    <article className={`border bg-white p-5 ${selected ? "border-[var(--gold)] ring-2 ring-amber-100" : "border-[var(--line)]"}`} onMouseEnter={onSelect} onFocus={onSelect}>
      <div className="flex gap-4">
        <div className="h-24 w-28 shrink-0 border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--muted)]"><span className="flex h-full items-center justify-center">Foto futura</span></div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">{establishment.food?.cuisine}</p>
              <h2 className="mt-1 text-xl font-bold text-[var(--forest)]">{establishment.name}</h2>
            </div>
            <WalkingTime minutes={establishment.walkingMinutes} compact />
          </div>
          <p className="mt-2 text-sm text-[var(--muted)]">Ticket demonstrativo: R$ {establishment.food?.ticketMin}–{establishment.food?.ticketMax}</p>
          {establishment.food && <div className="mt-2"><VrList cards={establishment.food.vrCards} compact /></div>}
        </div>
      </div>
      {benefit && <p className="mt-4 bg-[var(--sand)] px-3 py-2 text-sm font-bold text-[var(--gold)]">{benefit.title} · demonstrativo</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        <a href={establishment.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center bg-[var(--forest)] px-4 text-sm font-bold text-white">Como chegar</a>
        <Link href={`${establishmentRoute(establishment.slug)}?${params}`} className="flex min-h-11 items-center border border-[var(--forest)] px-4 text-sm font-bold text-[var(--forest)]">Ver detalhes</Link>
      </div>
    </article>
  );
}
