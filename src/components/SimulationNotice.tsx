import { GuideIcon } from "./GuideIcon";

export function SimulationNotice({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      aria-label="Aviso sobre os dados"
      className={`flex items-start gap-3 rounded-xl border border-amber-300 bg-[var(--sand)] text-amber-950 ${compact ? "px-3 py-2.5 text-xs" : "px-4 py-3 text-sm"}`}
    >
      <GuideIcon name="info" className="mt-0.5 h-5 w-5 shrink-0" />
      <p><strong>Dados demonstrativos.</strong>{" "}Esta área ainda usa conteúdo ilustrativo para validar a estrutura do MVP. Ela não altera os dados consolidados dos estabelecimentos.</p>
    </aside>
  );
}
