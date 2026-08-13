import type { Metadata } from "next";
import Image from "next/image";
import { GuideIcon } from "@/components/GuideIcon";
import { MobileHeader } from "@/components/MobileHeader";
import { PartnerInterestForm } from "@/components/PartnerInterestForm";
import { SimulationNotice } from "@/components/SimulationNotice";

export const metadata: Metadata = { title: "Seja parceiro" };

const steps = [
  ["01", "Você propõe", "Um benefício simples, sustentável e com regras fáceis de consultar."],
  ["02", "O Aroeira divulga", "Seu estabelecimento aparece no guia e nos fluxos relevantes."],
  ["03", "A equipe utiliza", "Funcionários conferem regras e apresentam a comprovação definida."],
];

export default function BecomePartnerPage() {
  return <><MobileHeader title="Seja parceiro" backHref="/guia" /><main id="conteudo" className="pb-12">
    <section className="overflow-hidden bg-[var(--forest)] text-white"><div className="page-shell grid gap-8 py-12 lg:grid-cols-[1fr_0.78fr] lg:items-center lg:py-18"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--sun)]">Parceria Aroeira</p><h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">Aproxime seu estabelecimento de quem trabalha na região</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">O programa poderá conectar estabelecimentos próximos aos funcionários por meio de benefícios claros e divulgação no guia.</p></div><div className="relative min-h-72 overflow-hidden rounded-2xl border border-white/20 shadow-2xl"><Image src="/brand/aroeira-equipe.png" alt="Pessoas colaborando em um ambiente corporativo" fill priority className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 40vw" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--forest-strong)] to-transparent p-5 pt-16"><strong className="text-lg">Conexões que fortalecem a região</strong></div></div></div></section>

    <section className="page-shell py-11"><SimulationNotice compact /><div className="mt-8 grid gap-5 md:grid-cols-3">{steps.map(([number, title, description]) => <article key={number} className="card-surface p-6"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--leaf)] text-sm font-bold text-[var(--forest)]">{number}</span><h2 className="mt-5 text-xl font-bold text-[var(--forest)]">{title}</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p></article>)}</div></section>

    <section className="brand-pattern border-y border-[var(--leaf-strong)]"><div className="page-shell grid gap-9 py-12 lg:grid-cols-2"><div><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[var(--forest)]"><GuideIcon name="partners" /></span><h2 className="mt-5 text-3xl font-bold text-[var(--forest)]">Contrapartidas previstas</h2><ul className="mt-5 space-y-3 text-[var(--muted)]"><li>• Página do estabelecimento no guia.</li><li>• Destaque do benefício nos fluxos compatíveis.</li><li>• Link para site ou WhatsApp quando fornecido.</li><li>• Canal futuro para correção das informações.</li></ul></div><div><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[var(--forest)]"><GuideIcon name="leaf" /></span><h2 className="mt-5 text-3xl font-bold text-[var(--forest)]">Exemplos demonstrativos</h2><ul className="mt-5 space-y-3 text-[var(--muted)]"><li>• Desconto percentual em um período.</li><li>• Bebida ou sobremesa de cortesia.</li><li>• Aula experimental ou primeira utilização.</li><li>• Preço especial em serviço selecionado.</li></ul></div></div></section>

    <section className="page-shell grid gap-9 py-12 lg:grid-cols-[0.75fr_1.25fr]"><div><p className="eyebrow">Antes de começar</p><h2 className="mt-2 text-3xl font-bold text-[var(--forest)]">Perguntas frequentes</h2><div className="mt-5 space-y-3"><details className="card-surface p-4"><summary className="flex min-h-11 items-center font-bold text-[var(--forest)]">Existe custo para participar?</summary><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Ainda não há regra oficial. Este ponto será definido antes do lançamento real.</p></details><details className="card-surface p-4"><summary className="flex min-h-11 items-center font-bold text-[var(--forest)]">O benefício precisa ser permanente?</summary><p className="mt-2 text-sm leading-6 text-[var(--muted)]">A estrutura aceita validade e revisão, mas os critérios finais ainda serão aprovados.</p></details><details className="card-surface p-4"><summary className="flex min-h-11 items-center font-bold text-[var(--forest)]">Quando o estabelecimento aparece?</summary><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Somente após revisão das informações e aprovação da parceria real.</p></details></div></div><PartnerInterestForm /></section>
  </main></>;
}
