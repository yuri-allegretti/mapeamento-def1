import type { Metadata } from "next";
import Link from "next/link";
import { GuideIcon } from "@/components/GuideIcon";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";

export const metadata: Metadata = { title: "Parceiros" };

export default function PartnersPage() {
  return <><MobileHeader title="Parceiros" /><main id="conteudo" className="pb-24 lg:pb-14">
    <section className="brand-pattern border-b border-[var(--leaf-strong)]"><div className="page-shell py-10 lg:py-14"><p className="eyebrow">Benefícios para funcionários</p><h1 className="mt-2 text-4xl font-bold text-[var(--forest)] lg:text-5xl">Parceiros do Guia Aroeira</h1><p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">O catálogo publicará apenas benefícios formalizados, claros e vigentes.</p></div></section>
    <section className="page-shell py-12 lg:py-16"><div className="card-surface mx-auto max-w-3xl p-8 text-center sm:p-12"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--leaf)] text-[var(--forest)]"><GuideIcon name="partners" className="h-8 w-8" /></span><h2 className="mt-6 text-2xl font-bold text-[var(--forest)]">Nenhum benefício ativo no momento</h2><p className="mx-auto mt-3 max-w-xl leading-7 text-[var(--muted)]">Os benefícios demonstrativos foram removidos. Novos parceiros aparecerão aqui depois da validação das regras e da publicação.</p><Link href="/guia/seja-parceiro" className="button-primary mx-auto mt-7">Seja parceiro <GuideIcon name="arrow" className="h-4 w-4" /></Link></div></section>
  </main><MobileNav active="parceiros" /></>;
}
