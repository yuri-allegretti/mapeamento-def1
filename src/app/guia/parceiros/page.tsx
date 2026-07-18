import type { Metadata } from "next";
import Link from "next/link";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";
import { PartnerExplorer } from "@/components/PartnerExplorer";
import { SimulationNotice } from "@/components/SimulationNotice";
import { getPartnerEstablishments } from "@/data";

export const metadata: Metadata = { title: "Parceiros" };

export default function PartnersPage() {
  const entries = getPartnerEstablishments();
  return (
    <><MobileHeader title="Parceiros" /><main id="conteudo" className="pb-24 lg:pb-12"><section className="bg-[var(--soft)]"><div className="page-shell py-8 lg:py-12"><p className="text-sm font-bold uppercase tracking-wide text-[var(--gold)]">Benefícios para funcionários</p><h1 className="mt-2 text-4xl font-bold text-[var(--forest)]">Parceiros do Guia Aroeira</h1><p className="mt-3 max-w-2xl text-[var(--muted)]">Veja como o catálogo funcionará: encontre o benefício, confira as regras e abra o estabelecimento relacionado.</p><div className="mt-5"><SimulationNotice /></div></div></section><section className="page-shell py-8"><div className="mb-8 grid gap-3 sm:grid-cols-3"><div className="border border-[var(--line)] p-4"><strong className="text-[var(--forest)]">1. Encontre</strong><p className="mt-1 text-sm text-[var(--muted)]">Filtre pela categoria desejada.</p></div><div className="border border-[var(--line)] p-4"><strong className="text-[var(--forest)]">2. Confira</strong><p className="mt-1 text-sm text-[var(--muted)]">Leia regras e comprovação.</p></div><div className="border border-[var(--line)] p-4"><strong className="text-[var(--forest)]">3. Utilize</strong><p className="mt-1 text-sm text-[var(--muted)]">Abra rota ou estabelecimento.</p></div></div><PartnerExplorer entries={entries} /><div className="mt-10 border border-[var(--forest)] bg-[var(--leaf)] p-6 lg:flex lg:items-center lg:justify-between"><div><h2 className="text-2xl font-bold text-[var(--forest)]">Quer fazer parte?</h2><p className="mt-1 text-sm text-[var(--muted)]">Conheça a proposta e teste o formulário demonstrativo.</p></div><Link href="/guia/seja-parceiro" className="mt-4 flex min-h-12 items-center justify-center bg-[var(--forest)] px-6 font-bold text-white lg:mt-0">Seja parceiro</Link></div></section></main><MobileNav active="parceiros" /></>
  );
}
