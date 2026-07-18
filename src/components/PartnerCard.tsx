import Link from "next/link";
import type { Establishment, PartnerBenefit } from "@/data/types";
import { establishmentRoute } from "@/lib/routes";
import { WalkingTime } from "./WalkingTime";

export function PartnerCard({ establishment, benefit }: { establishment: Establishment; benefit: PartnerBenefit }) {
  return (
    <article className="border border-[var(--line)] bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--gold)]">Parceria simulada · {establishment.categoryLabel}</p>
      <h2 className="mt-2 text-xl font-bold text-[var(--forest)]">{establishment.name}</h2>
      <p className="mt-2 text-lg font-bold">{benefit.title}</p>
      <p className="mt-1 text-sm text-[var(--muted)]">{benefit.summary}</p>
      <div className="mt-3"><WalkingTime minutes={establishment.walkingMinutes} compact /></div>
      <details className="mt-4 border-t border-[var(--line)] pt-3">
        <summary className="min-h-11 font-bold text-[var(--forest)]">Ver regras demonstrativas</summary>
        <p className="mt-2 text-sm">{benefit.proofMethod}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">{benefit.rules.map((rule) => <li key={rule}>{rule}</li>)}</ul>
      </details>
      <Link href={`${establishmentRoute(establishment.slug)}?from=parceiros`} className="mt-4 flex min-h-11 items-center justify-center border border-[var(--forest)] px-4 text-sm font-bold text-[var(--forest)]">Ver estabelecimento</Link>
    </article>
  );
}
