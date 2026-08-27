"use client";

type MapPosition = { x: number; y: number };

type MapItem = { slug: string; name: string; mapPosition: MapPosition };

export function MapPlaceholder({
  items,
  selectedSlug,
  onSelect,
  title = "Representação cartográfica",
  className = "min-h-[26rem]",
}: {
  items: MapItem[];
  selectedSlug?: string;
  onSelect?: (slug: string) => void;
  title?: string;
  className?: string;
}) {
  return (
    <section className={`map-grid relative overflow-hidden rounded-2xl border border-[var(--line)] shadow-[var(--shadow-sm)] ${className}`} aria-label={title}>
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 border-[var(--forest)] bg-white px-3 py-2 text-center shadow-sm">
        <span className="block text-xs font-bold uppercase tracking-wide text-[var(--forest)]">Aroeira</span>
        <span className="text-[10px] text-[var(--muted)]">ponto de referência</span>
      </div>
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[var(--forest)]/40" aria-hidden="true" />
      {items.map((item, index) => {
        const selected = selectedSlug === item.slug;
        return (
          <button
            key={item.slug}
            type="button"
            onClick={() => onSelect?.(item.slug)}
            aria-label={`Selecionar ${item.name}`}
            aria-pressed={selected}
            className={`absolute z-20 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-xs font-bold shadow-sm ${selected ? "border-[var(--gold)] bg-[var(--forest)] text-white" : "border-white bg-[var(--leaf-strong)] text-[var(--forest)]"}`}
            style={{ left: `${item.mapPosition.x}%`, top: `${item.mapPosition.y}%` }}
          >
            {index + 1}
          </button>
        );
      })}
      <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-[var(--line)] bg-white/95 p-3 text-xs text-[var(--muted)] shadow-sm">
        Representação estrutural com posições simuladas. O conteúdo e os links funcionam sem este mapa.
      </div>
    </section>
  );
}
