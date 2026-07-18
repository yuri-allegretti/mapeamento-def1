import Link from "next/link";
import type { Establishment, PartnerBenefit } from "@/data/types";
import { establishmentRoute } from "@/lib/routes";
import { WalkingTime } from "./WalkingTime";
import { VrList } from "./VrList";

export function CompactEstablishmentCard({ establishment, benefit, returnQuery }: { establishment: Establishment; benefit?: PartnerBenefit; returnQuery?: string }) {
  const detailParams = new URLSearchParams({ from: "onde-comer" });
  if (returnQuery) detailParams.set("returnQuery", returnQuery);
  const detailHref = `${establishmentRoute(establishment.slug)}?${detailParams}`;

  return (
    <article id={`card-${establishment.slug}`} className="border border-[var(--line)] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          {benefit && <span className="inline-block bg-[var(--sand)] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--gold)]">Parceiro demonstrativo</span>}
          <h2 className="mt-2 text-lg font-bold text-[var(--forest)]">{establishment.name}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{establishment.food?.cuisine} · R$ {establishment.food?.ticketMin}–{establishment.food?.ticketMax}</p>
        </div>
        <div className="h-16 w-16 shrink-0 border border-[var(--line)] bg-[var(--soft)] text-center text-[10px] text-[var(--muted)]">
          <span className="flex h-full items-center justify-center">sem foto</span>
        </div>
      </div>
      {benefit && <p className="mt-3 border-l-4 border-[var(--gold)] bg-[var(--sand)] px-3 py-2 text-sm font-semibold">{benefit.title}</p>}
      <div className="mt-3 space-y-2">
        <WalkingTime minutes={establishment.walkingMinutes} compact />
        {establishment.food && <VrList cards={establishment.food.vrCards} compact />}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <a href={establishment.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center justify-center bg-[var(--forest)] px-3 text-center text-sm font-bold text-white">Como chegar</a>
        <Link href={detailHref} className="flex min-h-11 items-center justify-center border border-[var(--forest)] px-3 text-center text-sm font-bold text-[var(--forest)]">Ver detalhes</Link>
      </div>
    </article>
  );
}
