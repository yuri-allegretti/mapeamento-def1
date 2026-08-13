import Image from "next/image";
import Link from "next/link";
import { DataNotice } from "@/components/DataNotice";
import { GuideIcon, type GuideIconName } from "@/components/GuideIcon";
import { MobileHeader } from "@/components/MobileHeader";

const employeePaths: Array<{ href: string; title: string; description: string; icon: GuideIconName }> = [
  { href: "/guia/onde-comer", title: "Encontrar onde comer", description: "Compare tipo, ticket e distância do Aroeira.", icon: "food" },
  { href: "/guia/parceiros", title: "Ver parcerias", description: "Acompanhe benefícios formalizados e futuras adesões.", icon: "partners" },
  { href: "/guia/transporte", title: "Explorar transporte", description: "Conheça a estrutura prevista para pontos e linhas próximas.", icon: "transport" },
];

export default function GuidePage() {
  return (
    <>
      <MobileHeader title="Início" />
      <main id="conteudo" className="pb-14">
        <section className="relative isolate overflow-hidden bg-[var(--forest-strong)] text-white">
          <Image src="/brand/aroeira-fachada-angulo.png" alt="Fachada do Aroeira Office Park" fill priority className="-z-20 object-cover object-center lg:object-right" sizes="100vw" />
          <div className="hero-shade absolute inset-0 -z-10" />
          <div className="page-shell grid gap-8 py-12 lg:grid-cols-[1.05fr_0.75fr] lg:items-center lg:py-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--sun)]">Guia Aroeira Office Park</p>
              <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">O que você precisa agora?</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">Um único guia para decidir o almoço, consultar parcerias e entender a infraestrutura ao redor do Aroeira.</p>
              <div className="mt-7 max-w-2xl"><DataNotice /></div>
            </div>
            <div className="rounded-2xl border border-white/25 bg-white/92 p-5 text-[var(--ink)] shadow-2xl backdrop-blur sm:p-6">
              <div className="flex items-center gap-3 text-[var(--forest)]"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--leaf)]"><GuideIcon name="leaf" /></span><p className="font-bold">Duas experiências, uma base confiável</p></div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="rounded-xl bg-[var(--leaf)] p-4"><strong className="block text-lg text-[var(--forest)]">Funcionários</strong><span className="mt-1 block text-sm leading-6 text-[var(--muted)]">Decisão rápida e ações diretas.</span></div>
                <div className="rounded-xl bg-[var(--sand)] p-4"><strong className="block text-lg text-[var(--forest)]">Empresas</strong><span className="mt-1 block text-sm leading-6 text-[var(--muted)]">Visão da região e valor da localização.</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="page-shell py-12 lg:grid lg:grid-cols-[1fr_0.8fr] lg:gap-10 lg:py-16">
          <div>
            <p className="eyebrow">Acesso rápido</p>
            <h2 className="mt-2 text-3xl font-bold text-[var(--forest)]">Para quem está no Aroeira</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {employeePaths.map((item) => <Link key={item.href} href={item.href} className="card-surface card-interactive group flex gap-4 p-5"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--leaf)] text-[var(--forest)]"><GuideIcon name={item.icon} className="h-6 w-6" /></span><span className="min-w-0"><strong className="block text-xl text-[var(--forest)]">{item.title}</strong><span className="mt-1 block text-sm leading-6 text-[var(--muted)]">{item.description}</span><span className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[var(--forest)]">Abrir <GuideIcon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></span></Link>)}
            </div>
          </div>
          <aside className="brand-pattern relative mt-8 overflow-hidden rounded-2xl border border-[var(--leaf-strong)] p-6 lg:mt-0 lg:self-start lg:p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[var(--forest)] shadow-sm"><GuideIcon name="building" className="h-6 w-6" /></span>
            <p className="eyebrow mt-6">Para empresas e visitantes</p>
            <h2 className="mt-2 text-3xl font-bold text-[var(--forest)]">Conheça a região</h2>
            <p className="mt-3 leading-7 text-[var(--muted)]">Explore categorias, serviços, alimentação e a futura estrutura de transporte em uma experiência planejada para análise comercial.</p>
            <Link href="/guia/regiao" className="button-primary mt-6 w-full">Explorar a região <GuideIcon name="arrow" className="h-4 w-4" /></Link>
            <Link href="/guia/seja-parceiro" className="button-secondary mt-3 w-full">Meu estabelecimento quer participar</Link>
          </aside>
        </section>

        <section id="contato-institucional" className="page-shell overflow-hidden rounded-2xl bg-[var(--forest)] text-white shadow-[var(--shadow-md)] lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div className="p-7 lg:p-9"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--sun)]">Produtivo por natureza</p><h2 className="mt-2 text-3xl font-bold">Conheça o Aroeira Office Park</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">Conheça as lajes corporativas, os pilares de sustentabilidade e a estrutura do empreendimento.</p></div>
          <div className="px-7 pb-7 lg:px-9 lg:py-9"><a href="https://www.aroeiraofficepark.com/" target="_blank" rel="noopener noreferrer" className="button-light w-full whitespace-nowrap">Visitar site institucional <GuideIcon name="arrow" className="h-4 w-4" /></a></div>
        </section>
      </main>
    </>
  );
}
