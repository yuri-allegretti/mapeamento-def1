export function WalkingTime({ minutes, compact = false }: { minutes: number; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 font-semibold text-[var(--forest)] ${compact ? "text-xs" : "text-sm"}`}>
      <span aria-hidden="true">↟</span>
      Aproximadamente {minutes} {minutes === 1 ? "minuto" : "minutos"} a pé
    </span>
  );
}
