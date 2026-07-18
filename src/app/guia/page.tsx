import Link from "next/link";
import { MobileHeader } from "@/components/MobileHeader";
import { SimulationNotice } from "@/components/SimulationNotice";

const employeePaths = [
  { href: "/guia/onde-comer", title: "Encontrar onde comer", description: "Compare gastronomia, ticket, VR e minutos a pé." },
  { href: "/guia/parceiros", title: "Consultar benefícios", description: "Veja como funcionará o catálogo de parceiros conveniados." },
  { href: "/guia/transporte", title: "Explorar transporte", description: "Conheça a estrutura prevista para pontos e linhas próximas." },
];

export default function GuidePage() {
  return (
    <>
      <MobileHeader title="Início" />
      <main id="conteudo" className="pb-12">
        <section className="border-b border-[var(--line)] bg-[var(--soft)]">
          <div className="page-shell grid gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--gold)]">Guia Aroeira Office Park</p>
              <h1 className="mt-3 text-4xl font-bold leading-tight text-[var(--forest)] sm:text-5xl">O que você precisa agora?</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--muted)]">Um único guia para decidir o almoço, consultar benefícios e entender a infraestrutura ao redor do Aroeira.</p>
              <div className="mt-6"><SimulationNotice /></div>
            </div>
            <div className="hidden border border-[var(--line)] bg-white p-6 lg:block">
              <p className="text-sm font-bold text-[var(--forest)]">Duas experiências, uma base</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-[var(--leaf)] p-4"><strong className="block text-lg text-[var(--forest)]">Funcionários</strong><span className="mt-1 block text-sm text-[var(--muted)]">Decisão rápida e ações diretas.</span></div>
                <div className="bg-[var(--sand)] p-4"><strong className="block text-lg text-[var(--forest)]">Empresas</strong><span className="mt-1 block text-sm text-[var(--muted)]">Visão da região e valor da localização.</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="page-shell py-10 lg:grid lg:grid-cols-[1fr_0.85fr] lg:gap-10 lg:py-14">
          <div>
            <h2 className="text-2xl font-bold text-[var(--forest)]">Para quem está no Aroeira</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {employeePaths.map((item, index) => <Link key={item.href} href={item.href} className="group border border-[var(--line)] bg-white p-5 hover:border-[var(--forest)]"><span className="text-xs font-bold text-[var(--gold)]">0{index + 1}</span><h3 className="mt-2 text-xl font-bold text-[var(--forest)] group-hover:underline">{item.title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{item.description}</p><span className="mt-4 inline-block font-bold text-[var(--forest)]">Abrir →</span></Link>)}
            </div>
          </div>
          <aside className="mt-8 border border-[var(--forest)] bg-[var(--forest)] p-6 text-white lg:mt-0 lg:self-start">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-200">Para empresas e visitantes</p>
            <h2 className="mt-3 text-3xl font-bold">Conheça a região</h2>
            <p className="mt-3 leading-7 text-emerald-50/80">Explore categorias, serviços, alimentação e a futura estrutura de transporte em uma experiência planejada para análise comercial.</p>
            <Link href="/guia/regiao" className="mt-6 flex min-h-12 items-center justify-center bg-white px-5 font-bold text-[var(--forest)]">Explorar a região</Link>
            <Link href="/guia/seja-parceiro" className="mt-3 flex min-h-12 items-center justify-center border border-white px-5 font-bold text-white">Meu estabelecimento quer participar</Link>
          </aside>
        </section>

        <section id="contato-institucional" className="page-shell border border-[var(--line)] bg-[var(--sand)] p-6 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div><p className="text-sm font-bold text-[var(--gold)]">Integração institucional futura</p><h2 className="mt-1 text-2xl font-bold text-[var(--forest)]">Conheça o Aroeira Office Park</h2><p className="mt-2 text-sm text-[var(--muted)]">O destino definitivo deste CTA será fornecido pela agência responsável pelo domínio institucional.</p></div>
          <span className="mt-4 inline-flex min-h-12 items-center border border-[var(--forest)] px-5 font-bold text-[var(--forest)] lg:mt-0" aria-disabled="true">Contato institucional em breve</span>
        </section>
      </main>
    </>
  );
}
