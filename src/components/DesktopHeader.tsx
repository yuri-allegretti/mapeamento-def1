import Link from "next/link";

export function DesktopHeader() {
  return (
    <header className="hidden border-b border-[var(--line)] bg-white lg:block">
      <div className="page-shell flex min-h-18 items-center justify-between gap-8">
        <Link href="/guia" className="text-lg font-bold text-[var(--forest)]">
          Aroeira Office Park
          <span className="ml-2 font-normal text-[var(--muted)]">Guia</span>
        </Link>
        <nav aria-label="Navegação principal" className="flex items-center gap-6 text-sm font-semibold">
          <Link href="/guia/onde-comer" className="hover:text-[var(--forest)]">Onde comer</Link>
          <Link href="/guia/regiao" className="hover:text-[var(--forest)]">Região</Link>
          <Link href="/guia/parceiros" className="hover:text-[var(--forest)]">Parceiros</Link>
          <Link href="/guia/transporte" className="hover:text-[var(--forest)]">Transporte</Link>
          <Link href="/guia/seja-parceiro" className="border border-[var(--forest)] px-4 py-2 text-[var(--forest)] hover:bg-[var(--leaf)]">
            Seja parceiro
          </Link>
        </nav>
      </div>
    </header>
  );
}
