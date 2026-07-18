import type { Metadata } from "next";
import Link from "next/link";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";
import { RegionExplorer } from "@/components/RegionExplorer";
import { SimulationNotice } from "@/components/SimulationNotice";
import { getAllEstablishments, getPartnerEstablishments } from "@/data";
import { transitStops } from "@/data/transit";

export const metadata: Metadata = { title: "Conheça a região", description: "Estrutura demonstrativa da região do Aroeira Office Park." };

export default function RegionPage() {
  const establishments = getAllEstablishments();
  const partners = getPartnerEstablishments();
  const categories = new Set(establishments.map((item) => item.category)).size;
  const featured = establishments.filter((item) => item.walkingMinutes <= 7).slice(0, 4);
  return (
    <>
      <MobileHeader title="Região" />
      <main id="conteudo" className="pb-24 lg:pb-0">
        <section className="border-b border-[var(--line)] bg-[var(--soft)]">
          <div className="page-shell grid gap-6 py-8 lg:grid-cols-[1fr_auto] lg:items-end lg:py-12">
            <div><p className="text-sm font-bold uppercase tracking-wide text-[var(--gold)]">Localização estratégica</p><h1 className="mt-2 text-4xl font-bold text-[var(--forest)] lg:text-5xl">Estrutura para a rotina de trabalho</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted)]">O MVP organiza alimentação, serviços e transporte para demonstrar como a região poderá ser explorada por empresas e funcionários.</p></div>
            <Link href="/guia#contato-institucional" className="flex min-h-12 items-center justify-center bg-[var(--forest)] px-6 font-bold text-white">Conhecer o Aroeira</Link>
          </div>
        </section>
        <section className="page-shell py-6"><SimulationNotice compact /><div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4"><div className="border border-[var(--line)] p-4"><strong className="text-2xl text-[var(--forest)]">{establishments.length}</strong><span className="block text-sm text-[var(--muted)]">referências locais</span></div><div className="border border-[var(--line)] p-4"><strong className="text-2xl text-[var(--forest)]">{categories}</strong><span className="block text-sm text-[var(--muted)]">categorias</span></div><div className="border border-[var(--line)] p-4"><strong className="text-2xl text-[var(--forest)]">{partners.length}</strong><span className="block text-sm text-[var(--muted)]">parcerias simuladas</span></div><div className="border border-[var(--line)] p-4"><strong className="text-2xl text-[var(--forest)]">{transitStops.length}</strong><span className="block text-sm text-[var(--muted)]">pontos simulados</span></div></div></section>
        <section className="page-shell py-4 lg:py-8"><div className="mb-5"><h2 className="text-2xl font-bold text-[var(--forest)]">Explore a infraestrutura</h2><p className="mt-1 text-sm text-[var(--muted)]">No desktop, camadas, mapa e detalhe trabalham juntos. No celular, as categorias e destaques vêm primeiro.</p></div><RegionExplorer establishments={establishments} /></section>
        <section className="page-shell py-10 lg:hidden"><h2 className="text-2xl font-bold text-[var(--forest)]">Destaques próximos</h2><div className="mt-4 grid gap-3">{featured.map((item) => <div key={item.slug} className="border border-[var(--line)] p-4"><p className="text-xs font-bold text-[var(--gold)]">{item.categoryLabel}</p><p className="mt-1 font-bold text-[var(--forest)]">{item.name}</p><p className="mt-1 text-sm text-[var(--muted)]">Aproximadamente {item.walkingMinutes} minutos a pé · simulado</p></div>)}</div></section>
        <section className="border-y border-[var(--line)] bg-[var(--leaf)]"><div className="page-shell grid gap-6 py-10 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-sm font-bold uppercase text-[var(--forest)]">Transporte demonstrativo</p><h2 className="mt-2 text-3xl font-bold text-[var(--forest)]">Estrutura pronta para receber dados oficiais</h2><p className="mt-3 max-w-3xl text-[var(--muted)]">A rota demonstra pontos, caminhada, linhas e sentidos sem alegar que o levantamento já foi validado.</p></div><Link href="/guia/transporte" className="flex min-h-12 items-center justify-center border border-[var(--forest)] bg-white px-6 font-bold text-[var(--forest)]">Ver transporte</Link></div></section>
        <section className="page-shell grid gap-5 py-12 lg:grid-cols-3"><article className="border border-[var(--line)] p-5"><p className="text-sm font-bold text-[var(--gold)]">01</p><h2 className="mt-2 text-xl font-bold text-[var(--forest)]">Conveniência para equipes</h2><p className="mt-2 text-sm text-[var(--muted)]">Alimentação e serviços organizados reduzem a fricção da rotina.</p></article><article className="border border-[var(--line)] p-5"><p className="text-sm font-bold text-[var(--gold)]">02</p><h2 className="mt-2 text-xl font-bold text-[var(--forest)]">Visão clara do entorno</h2><p className="mt-2 text-sm text-[var(--muted)]">Categorias e mapa apoiam uma avaliação comercial objetiva.</p></article><article className="border border-[var(--line)] p-5"><p className="text-sm font-bold text-[var(--gold)]">03</p><h2 className="mt-2 text-xl font-bold text-[var(--forest)]">Base preparada para evoluir</h2><p className="mt-2 text-sm text-[var(--muted)]">Dados locais podem ser substituídos por uma fonte oficial sem refazer as páginas.</p></article></section>
        <section className="page-shell mb-12 bg-[var(--forest)] p-7 text-white lg:flex lg:items-center lg:justify-between"><div><h2 className="text-3xl font-bold">Quer conhecer o Aroeira?</h2><p className="mt-2 text-emerald-50/80">O contato definitivo será integrado pela agência institucional.</p></div><Link href="/guia#contato-institucional" className="mt-5 flex min-h-12 items-center justify-center bg-white px-6 font-bold text-[var(--forest)] lg:mt-0">CTA institucional</Link></section>
      </main>
      <MobileNav active="região" />
    </>
  );
}
