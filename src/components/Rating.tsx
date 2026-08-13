import type { Establishment } from "@/data/types";

export function Rating({ rating, compact = false }: { rating?: Establishment["rating"]; compact?: boolean }) {
  if (!rating) return null;
  return (
    <p className={`${compact ? "text-xs" : "text-sm"} text-[var(--muted)]`}>
      <strong className="inline-flex items-center gap-1 text-[var(--ink)]"><span className="text-[var(--gold)]" aria-hidden="true">★</span>{rating.value.toLocaleString("pt-BR")}</strong>
      {rating.reviewCount !== undefined && ` · ${rating.reviewCount.toLocaleString("pt-BR")} avaliações`}
      {compact ? ` · ${rating.provider}, ${rating.verifiedAt}` : ` · ${rating.provider}, verificado em ${rating.verifiedAt}`}
    </p>
  );
}
