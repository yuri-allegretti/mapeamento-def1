import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

export function MobileHeader({ title, backHref }: { title: string; backHref?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-white/95 shadow-[0_3px_16px_rgba(36,62,30,0.06)] backdrop-blur lg:hidden">
      <div className="flex min-h-18 items-center gap-3 px-4">
        {backHref && <Link href={backHref} aria-label="Voltar" className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--line)] text-xl text-[var(--forest)]">←</Link>}
        <Link href="/guia" aria-label="Início do Guia Aroeira" className="shrink-0 rounded-lg"><BrandLogo priority className="h-9 w-auto" /></Link>
        <span className="ml-auto max-w-28 truncate rounded-full bg-[var(--leaf)] px-3 py-1.5 text-xs font-bold text-[var(--forest)]">{title}</span>
      </div>
    </header>
  );
}
