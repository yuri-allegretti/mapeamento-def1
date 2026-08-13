import Link from "next/link";
import type { Establishment } from "@/data/types";
import { establishmentRoute } from "@/lib/routes";
import { CopyAddressButton } from "./CopyAddressButton";
import { Distance } from "./Distance";
import { Rating } from "./Rating";

export function CompactEstablishmentCard({ establishment, returnQuery }: { establishment: Establishment; returnQuery?: string }) {
  const params = new URLSearchParams({ from: "onde-comer" });
  if (returnQuery) params.set("returnQuery", returnQuery);
  return (
    <article id={`card-${establishment.slug}`} className="card-surface p-5">
      <p className="eyebrow">{establishment.type}</p>
      <h2 className="mt-1 text-lg font-bold text-[var(--forest)]">{establishment.name}</h2>
      <div className="mt-2"><Rating rating={establishment.rating} compact /></div>
      <div className="mt-3"><Distance meters={establishment.distanceMeters} compact /></div>
      <p className="mt-3 inline-flex rounded-full bg-[var(--soft)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)]">{establishment.food?.ticket ? `Ticket R$ ${establishment.food.ticket.min}–${establishment.food.ticket.max}` : "Ticket não informado"}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{establishment.address.line}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <CopyAddressButton address={establishment.address} className="button-primary px-3" />
        <Link href={`${establishmentRoute(establishment.slug)}?${params}`} className="button-secondary min-h-11 px-3">Ver detalhes</Link>
      </div>
    </article>
  );
}
