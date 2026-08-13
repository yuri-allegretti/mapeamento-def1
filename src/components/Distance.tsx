export function formatDistance(meters: number) {
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km`;
}

export function Distance({ meters, compact = false }: { meters?: number; compact?: boolean }) {
  if (meters === undefined) {
    return <span className="text-sm text-[var(--muted)]">Distância não informada</span>;
  }
  return (
    <span className={`inline-flex items-center gap-2 font-semibold text-[var(--forest)] ${compact ? "text-sm" : "text-base"}`}>
      <GuideIcon name="region" className="h-4 w-4 shrink-0" />
      {formatDistance(meters)} do Aroeira
    </span>
  );
}
import { GuideIcon } from "./GuideIcon";
