export function EmptyState({ title = "Nenhum resultado", description, onClear }: { title?: string; description: string; onClear?: () => void }) {
  return (
    <section className="border border-dashed border-[var(--line)] bg-[var(--soft)] p-8 text-center" role="status">
      <h2 className="text-lg font-bold text-[var(--forest)]">{title}</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm text-[var(--muted)]">{description}</p>
      {onClear && <button type="button" onClick={onClear} className="mt-4 min-h-11 bg-[var(--forest)] px-5 py-2 font-semibold text-white">Limpar filtros</button>}
    </section>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <section className="border border-red-300 bg-red-50 p-8 text-center" role="alert">
      <h2 className="text-lg font-bold text-red-900">Não foi possível carregar esta área</h2>
      <p className="mt-2 text-sm text-red-800">O restante do guia continua disponível. Tente novamente em alguns instantes.</p>
      {onRetry && <button type="button" onClick={onRetry} className="mt-4 min-h-11 border border-red-800 px-5 py-2 font-semibold text-red-900">Tentar novamente</button>}
    </section>
  );
}
