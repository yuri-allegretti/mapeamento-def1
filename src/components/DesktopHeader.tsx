"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "./BrandLogo";

const links = [
  { href: "/guia/onde-comer", label: "Onde comer" },
  { href: "/guia/regiao", label: "Região" },
  { href: "/guia/parceiros", label: "Parceiros" },
  { href: "/guia/transporte", label: "Transporte" },
];

export function DesktopHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 hidden border-b border-[var(--line)] bg-white/95 shadow-[0_3px_18px_rgba(36,62,30,0.06)] backdrop-blur lg:block">
      <div className="page-shell flex min-h-20 items-center justify-between gap-8">
        <Link href="/guia" aria-label="Início do Guia Aroeira" className="shrink-0 rounded-lg"><BrandLogo priority className="h-12 w-auto" /></Link>
        <nav aria-label="Navegação principal" className="flex items-center gap-1 text-sm font-semibold">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={`rounded-lg px-3 py-3 ${active ? "bg-[var(--leaf)] text-[var(--forest)]" : "text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--forest)]"}`}>{link.label}</Link>;
          })}
          <Link href="/guia/seja-parceiro" className="button-secondary ml-2 min-h-11 px-4 py-2">Seja parceiro</Link>
        </nav>
      </div>
    </header>
  );
}
