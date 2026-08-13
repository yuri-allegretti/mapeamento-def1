import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DataNotice } from "@/components/DataNotice";
import { Distance } from "@/components/Distance";
import { GuideIcon } from "@/components/GuideIcon";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";
import { RegionExplorer } from "@/components/RegionExplorer";
import { getAllEstablishments } from "@/data";
import { transitStops } from "@/data/transit";

export const metadata: Metadata = { title: "Conheça a região", description: "Estabelecimentos verificados no entorno do Aroeira Office Park." };

export default function RegionPage() {
  const establishments = getAllEstablishments();
  const categories = new Set(establishments.map((item) => item.primaryCategoryId)).size;
  const featured = [...establishments].filter((item) => item.distanceMeters !== undefined).sort((a, b) => a.distanceMeters! - b.distanceMeters!).slice(0, 4);
  const metrics = [
    [establishments.length, "estabelecimentos"],
    [categories, "categorias"],
    [0, "parcerias ativas"],
    [transitStops.length, "pontos demonstrativos"],
  ];

  return <><MobileHeader title="Região" /><main id="conteudo" className="pb-24 lg:pb-0">
    <section className="relative isolate overflow-hidden bg-[var(--forest-strong)] text-white">
      <Image src="/brand/aroeira-fachada-principal.png" alt="Fachada principal do Aroeira Office Park" fill priority className="-z-20 object-cover object-center" sizes="100vw" />
      <div className="hero-shade absolute inset-0 -z-10" />
      <div className="page-shell grid gap-7 py-12 lg:grid-cols-[1fr_auto] lg:items-end lg:py-18">
        <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--sun)]">Localização estratégica</p><h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight lg:text-5xl">Estrutura para a rotina de trabalho</h1><p className="mt-4 max-w-2xl text-base leading-8 text-white/78 lg:text-lg">Explore estabelecimentos e serviços verificados no entorno do Aroeira.</p></div>
        <a href="https://www.aroeiraofficepark.com/" target="_blank" rel="noopener noreferrer" className="button-light">Conhecer o Aroeira <GuideIcon name="arrow" className="h-4 w-4" /></a>
      </div>
    </section>

    <section className="page-shell py-7"><DataNotice compact /><div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">{metrics.map(([value, label]) => <div key={label} className="card-surface p-4 sm:p-5"><strong className="text-3xl text-[var(--forest)]">{value}</strong><span className="mt-1 block text-xs font-medium text-[var(--muted)] sm:text-sm">{label}</span></div>)}</div></section>

    <section className="page-shell py-5 lg:py-10"><div className="mb-6"><p className="eyebrow">Entorno do empreendimento</p><h2 className="mt-2 text-3xl font-bold text-[var(--forest)]">Explore a infraestrutura</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Pesquise por nome, tipo ou endereço e filtre os resultados por categoria.</p></div><RegionExplorer establishments={establishments} /></section>

    <section className="page-shell py-10 lg:hidden"><h2 className="text-2xl font-bold text-[var(--forest)]">Mais próximos</h2><div className="mt-4 grid gap-3">{featured.map((item) => <div key={item.slug} className="card-surface p-4"><p className="eyebrow">{item.primaryCategoryLabel}</p><p className="mt-1 font-bold text-[var(--forest)]">{item.name}</p><div className="mt-2"><Distance meters={item.distanceMeters} compact /></div></div>)}</div></section>

    <section className="brand-pattern border-y border-[var(--leaf-strong)]"><div className="page-shell grid gap-6 py-11 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="eyebrow">Transporte demonstrativo</p><h2 className="mt-2 text-3xl font-bold text-[var(--forest)]">Estrutura aguardando dados oficiais</h2><p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">Os estabelecimentos já usam a base consolidada; pontos e linhas continuam simulados e identificados como tal.</p></div><Link href="/guia/transporte" className="button-secondary">Ver transporte <GuideIcon name="arrow" className="h-4 w-4" /></Link></div></section>
  </main><MobileNav active="região" /></>;
}
