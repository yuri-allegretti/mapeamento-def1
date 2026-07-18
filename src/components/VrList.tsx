export function VrList({ cards, compact = false }: { cards: string[]; compact?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5" aria-label={`Cartões VR demonstrativos: ${cards.join(", ")}`}>
      {cards.map((card) => (
        <span key={card} className={`border border-[var(--line)] bg-[var(--soft)] font-semibold text-[var(--muted)] ${compact ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs"}`}>
          {card}
        </span>
      ))}
    </div>
  );
}
