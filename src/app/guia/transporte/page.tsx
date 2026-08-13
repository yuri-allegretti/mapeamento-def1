import type { Metadata } from "next";
import { GuideIcon } from "@/components/GuideIcon";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";
import { SimulationNotice } from "@/components/SimulationNotice";
import { TransitMapPlaceholder } from "@/components/MapPlaceholder";
import { WalkingTime } from "@/components/WalkingTime";
import { transitStops } from "@/data/transit";

export const metadata: Metadata = { title: "Transporte" };

function StopCard({ stop }: { stop: (typeof transitStops)[number] }) {
  return <article className="card-surface p-5"><div className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--leaf)] text-[var(--forest)]"><GuideIcon name="transport" /></span><div><p className="eyebrow">Ponto simulado</p><h2 className="mt-1 text-xl font-bold text-[var(--forest)]">{stop.name}</h2></div></div><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{stop.reference}</p><div className="mt-3"><WalkingTime minutes={stop.walkingMinutes} compact /></div><div className="mt-5 space-y-3">{stop.lines.map((line) => <div key={line.id} className="rounded-xl border-l-4 border-[var(--brand-green)] bg-[var(--soft)] p-3"><div className="flex items-start justify-between gap-3"><strong className="text-[var(--forest)]">{line.number} · {line.name}</strong><span className="rounded-full bg-[var(--sand)] px-2 py-1 text-[10px] font-bold uppercase text-[var(--gold)]">demo</span></div><p className="mt-1 text-sm">{line.direction}</p><p className="mt-1 text-xs text-[var(--muted)]">{line.origin} → {line.destination}</p></div>)}</div><span className="mt-4 flex min-h-11 items-center justify-center rounded-xl border border-dashed border-[var(--line)] text-sm font-bold text-[var(--muted)]" aria-disabled="true">Link oficial futuro</span></article>;
}

export default function TransitPage() {
  return <><MobileHeader title="Transporte" /><main id="conteudo" className="pb-24 lg:pb-14"><section className="brand-pattern border-b border-[var(--leaf-strong)]"><div className="page-shell py-10 lg:py-14"><p className="eyebrow">Estrutura de demonstração</p><h1 className="mt-2 text-4xl font-bold text-[var(--forest)] lg:text-5xl">Transporte próximo ao Aroeira</h1><p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">Esta página demonstra como pontos, caminhada, linhas, sentidos, origem e destino serão organizados. Nenhuma linha abaixo representa o levantamento oficial.</p><div className="mt-6 max-w-3xl"><SimulationNotice /></div></div></section><section className="page-shell grid gap-8 py-10 lg:grid-cols-[minmax(24rem,0.8fr)_minmax(34rem,1.2fr)]"><div><p className="eyebrow">Estrutura prevista</p><h2 className="mt-2 text-3xl font-bold text-[var(--forest)]">Pontos próximos simulados</h2><div className="mt-5 space-y-4">{transitStops.map((stop) => <StopCard key={stop.id} stop={stop} />)}</div></div><aside className="lg:sticky lg:top-24 lg:self-start"><div className="mb-4"><p className="eyebrow">Visualização</p><h2 className="mt-2 text-3xl font-bold text-[var(--forest)]">Representação estrutural</h2><p className="mt-2 text-sm text-[var(--muted)]">Posições ilustrativas, sem integração externa.</p></div><TransitMapPlaceholder stops={transitStops} /></aside></section></main><MobileNav active="transporte" /></>;
}
