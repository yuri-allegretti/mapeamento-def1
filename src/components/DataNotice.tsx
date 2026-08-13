import { GuideIcon } from "./GuideIcon";

export function DataNotice({ compact = false }: { compact?: boolean }) {
  return <aside aria-label="Origem dos dados" className={`flex items-start gap-3 rounded-xl border border-[var(--leaf-strong)] bg-[var(--leaf)] text-[var(--forest-strong)] ${compact ? "px-3 py-2.5 text-xs" : "px-4 py-3 text-sm"}`}><GuideIcon name="info" className="mt-0.5 h-5 w-5 shrink-0" /><p><strong>Dados consolidados.</strong> Informações provenientes do levantamento Yuri, Maia e Ian, verificado em 12/08/2026. Campos ausentes não são estimados.</p></aside>;
}
