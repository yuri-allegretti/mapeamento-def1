import type { PartnerBenefit } from "@/data/types";

export function BenefitBlock({ benefit, showRules = false }: { benefit: PartnerBenefit; showRules?: boolean }) {
  return (
    <section className="border border-amber-300 bg-[var(--sand)] p-4" aria-labelledby={`benefit-${benefit.id}`}>
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--gold)]">Parceiro demonstrativo</p>
      <h2 id={`benefit-${benefit.id}`} className="mt-1 text-lg font-bold text-[var(--forest)]">{benefit.title}</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">{benefit.summary}</p>
      {showRules && (
        <div className="mt-4 border-t border-amber-300 pt-3">
          <p className="text-sm font-bold">Como utilizar</p>
          <p className="mt-1 text-sm">{benefit.proofMethod}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
            {benefit.rules.map((rule) => <li key={rule}>{rule}</li>)}
          </ul>
        </div>
      )}
    </section>
  );
}
