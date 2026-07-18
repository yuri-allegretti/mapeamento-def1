import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BenefitBlock } from "@/components/BenefitBlock";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import { MobileHeader } from "@/components/MobileHeader";
import { SimulationNotice } from "@/components/SimulationNotice";
import { VrList } from "@/components/VrList";
import { WalkingTime } from "@/components/WalkingTime";
import { establishments, getEstablishmentBySlug, getPartnerBenefit } from "@/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return establishments.map((establishment) => ({ slug: establishment.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const establishment = getEstablishmentBySlug(slug);
  return { title: establishment?.name ?? "Estabelecimento não encontrado" };
}

function safeBackHref(from: string | undefined, returnQuery: string | undefined) {
  if (from === "onde-comer") return `/guia/onde-comer${returnQuery ? `?${returnQuery}` : ""}`;
  if (from === "parceiros") return "/guia/parceiros";
  if (from === "regiao") return "/guia/regiao";
  return "/guia";
}

export default async function EstablishmentPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ from?: string; returnQuery?: string }> }) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const establishment = getEstablishmentBySlug(slug);
  if (!establishment) notFound();
  const benefit = getPartnerBenefit(slug);
  const backHref = safeBackHref(query.from, query.returnQuery);
  const related = establishments.filter((item) => item.category === establishment.category && item.slug !== establishment.slug).slice(0, 3);

  return (
    <>
      <div className="lg:hidden"><MobileHeader title="Estabelecimento" backHref={backHref} /></div>
      <main id="conteudo" className="pb-12">
        <div className="page-shell py-5"><Link href={backHref} className="hidden min-h-11 items-center font-bold text-[var(--forest)] underline lg:inline-flex">← Voltar ao resultado</Link><div className="mt-3"><SimulationNotice compact /></div></div>
        <div className="page-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <section className="border border-[var(--line)] bg-white">
              <div className="flex min-h-48 items-center justify-center bg-[var(--soft)] text-sm text-[var(--muted)]">Placeholder de fotografia autorizada</div>
              <div className="p-5 sm:p-7"><p className="text-xs font-bold uppercase tracking-wide text-[var(--gold)]">{establishment.categoryLabel} · {establishment.subcategory}</p><h1 className="mt-2 text-3xl font-bold text-[var(--forest)] sm:text-4xl">{establishment.name}</h1><p className="mt-3 leading-7 text-[var(--muted)]">{establishment.description}</p><div className="mt-4"><WalkingTime minutes={establishment.walkingMinutes} /></div></div>
            </section>
            {benefit && <div className="mt-5"><BenefitBlock benefit={benefit} showRules /></div>}
            <section className="mt-5 border border-[var(--line)] p-5 sm:p-7"><h2 className="text-2xl font-bold text-[var(--forest)]">Informações</h2><dl className="mt-5 grid gap-5 sm:grid-cols-2"><div><dt className="text-sm font-bold">Categoria</dt><dd className="mt-1 text-sm text-[var(--muted)]">{establishment.subcategory}</dd></div><div><dt className="text-sm font-bold">Endereço de referência</dt><dd className="mt-1 text-sm text-[var(--muted)]">{establishment.address}</dd></div>{establishment.food && <><div><dt className="text-sm font-bold">Gastronomia</dt><dd className="mt-1 text-sm text-[var(--muted)]">{establishment.food.cuisine}</dd></div><div><dt className="text-sm font-bold">Ticket</dt><dd className="mt-1 text-sm text-[var(--muted)]">R$ {establishment.food.ticketMin}–{establishment.food.ticketMax} · {establishment.food.ticketStatus === "simulated" ? "simulado" : "referência do levantamento"}</dd></div><div><dt className="text-sm font-bold">Serviço</dt><dd className="mt-1 text-sm text-[var(--muted)]">{establishment.food.serviceModes.join(", ")}</dd></div><div><dt className="text-sm font-bold">Cartões VR demonstrativos</dt><dd className="mt-2"><VrList cards={establishment.food.vrCards} /></dd></div></>}</dl></section>
            <section className="mt-5"><h2 className="text-2xl font-bold text-[var(--forest)]">Localização estrutural</h2><p className="mt-1 text-sm text-[var(--muted)]">O mapa é ilustrativo. A ação de rota usa uma busca externa segura.</p><div className="mt-4"><MapPlaceholder items={[establishment]} selectedSlug={establishment.slug} className="min-h-[24rem]" /></div></section>
          </div>
          <aside className="lg:sticky lg:top-5 lg:self-start"><div className="border border-[var(--line)] bg-[var(--soft)] p-5"><h2 className="text-lg font-bold text-[var(--forest)]">Ações</h2><a href={establishment.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="mt-4 flex min-h-12 items-center justify-center bg-[var(--forest)] px-4 font-bold text-white">Como chegar</a>{establishment.menuUrl && <a href={establishment.menuUrl} target="_blank" rel="noopener noreferrer" className="mt-3 flex min-h-12 items-center justify-center border border-[var(--forest)] px-4 font-bold text-[var(--forest)]">Ver cardápio de referência</a>}<p className="mt-4 text-xs leading-5 text-[var(--muted)]">Fonte do nome/endereço: {establishment.sourceLabel}. Caminhada, posição, VR, descrições e benefícios são demonstrativos.</p></div></aside>
        </div>
        <section className="page-shell mt-12"><h2 className="text-2xl font-bold text-[var(--forest)]">Também nesta categoria</h2><div className="mt-4 grid gap-3 md:grid-cols-3">{related.map((item) => <Link key={item.slug} href={`/guia/estabelecimento/${item.slug}?from=${query.from ?? "guia"}`} className="border border-[var(--line)] p-4"><span className="text-xs font-bold text-[var(--gold)]">{item.subcategory}</span><strong className="mt-1 block text-[var(--forest)]">{item.name}</strong><span className="mt-2 block text-sm text-[var(--muted)]">Aproximadamente {item.walkingMinutes} min a pé</span></Link>)}</div></section>
      </main>
    </>
  );
}
