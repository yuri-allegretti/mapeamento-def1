import type { Metadata } from "next";
import { GuideIcon } from "@/components/GuideIcon";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";
import { TransitExplorer } from "@/components/TransitExplorer";
import { transitData } from "@/data/transit";

export const metadata: Metadata = {
  title: "Transporte",
  description: "Linhas e pontos de ônibus oficiais em um raio de 1 km do Aroeira Office Park.",
};

export default function TransitPage() {
  const publishedLines = transitData.lines.filter((line) => line.publicationStatus === "published");

  return <>
    <MobileHeader title="Transporte" />
    <main id="conteudo" className="pb-24 lg:pb-0">
      <section className="brand-pattern border-b border-[var(--leaf-strong)]">
        <div className="page-shell py-10 lg:py-14">
          <p className="eyebrow">Mobilidade no entorno</p>
          <h1 className="mt-2 max-w-4xl text-4xl font-bold leading-tight text-[var(--forest)] lg:text-5xl">Encontre a linha e o ponto certo para o seu destino</h1>
          <p className="mt-4 max-w-3xl leading-7 text-[var(--muted)]">Consulte linhas urbanas confirmadas pela URBS, compare sentidos e abra a localização do ponto recomendado sem depender de mapa incorporado.</p>

          <div className="mt-7 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="card-surface p-4"><strong className="block text-3xl text-[var(--forest)]">{publishedLines.length}</strong><span className="mt-1 block text-xs font-medium text-[var(--muted)]">linhas confirmadas</span></div>
            <div className="card-surface p-4"><strong className="block text-3xl text-[var(--forest)]">{transitData.stops.length}</strong><span className="mt-1 block text-xs font-medium text-[var(--muted)]">pontos oficiais</span></div>
            <div className="card-surface col-span-2 p-4 sm:col-span-1"><strong className="block text-3xl text-[var(--forest)]">1 km</strong><span className="mt-1 block text-xs font-medium text-[var(--muted)]">raio analisado</span></div>
          </div>

          <aside aria-label="Critérios dos dados de transporte" className="mt-6 flex max-w-3xl items-start gap-3 rounded-xl border border-[var(--leaf-strong)] bg-white/80 px-4 py-3 text-sm text-[var(--forest-strong)]">
            <GuideIcon name="info" className="mt-0.5 h-5 w-5 shrink-0" />
            <p><strong>Dados oficiais validados em {transitData.metadata.validationDate}.</strong> As distâncias são calculadas em linha reta a partir do Aroeira; o percurso real a pé pode ser maior. A base consultada não informa acessibilidade.</p>
          </aside>
        </div>
      </section>

      <TransitExplorer data={transitData} />

      <section className="border-t border-[var(--leaf-strong)] bg-[var(--forest-strong)] text-white">
        <div className="page-shell grid gap-5 py-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--sun)]">Antes de embarcar</p><h2 className="mt-2 text-2xl font-bold">Confirme horários no dia da viagem</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-white/75">Linhas, pontos e sentidos podem mudar. Os botões de horários levam à consulta oficial da URBS; linhas metropolitanas usam a fonte da AMEP.</p></div>
          <a href="https://www.urbs.curitiba.pr.gov.br/horario-de-onibus/" target="_blank" rel="noopener noreferrer" className="button-light">Consultar URBS<GuideIcon name="arrow" className="h-4 w-4" /></a>
        </div>
      </section>
    </main>
    <MobileNav active="transporte" />
  </>;
}
