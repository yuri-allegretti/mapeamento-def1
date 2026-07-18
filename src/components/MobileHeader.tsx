import Link from "next/link";

export function MobileHeader({ title, backHref }: { title: string; backHref?: string }) {
  return (
    <header className="border-b border-[var(--line)] bg-white lg:hidden">
      <div className="flex min-h-16 items-center gap-3 px-4">
        {backHref ? (
          <Link href={backHref} aria-label="Voltar" className="flex min-h-11 min-w-11 items-center justify-center border border-[var(--line)] text-xl">
            ←
          </Link>
        ) : (
          <Link href="/guia" aria-label="Início do Guia Aroeira" className="flex min-h-11 min-w-11 items-center justify-center bg-[var(--forest)] font-bold text-white">
            A
          </Link>
        )}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Guia Aroeira</p>
          <p className="font-bold text-[var(--forest)]">{title}</p>
        </div>
      </div>
    </header>
  );
}
