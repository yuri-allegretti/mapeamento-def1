import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyAddressButton } from "@/components/CopyAddressButton";
import { Distance } from "@/components/Distance";
import { GuideIcon } from "@/components/GuideIcon";
import { MobileHeader } from "@/components/MobileHeader";
import { Rating } from "@/components/Rating";
import { establishments, getEstablishmentBySlug } from "@/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return establishments.flatMap((item) => [item.slug, ...item.legacySlugs].map((slug) => ({ slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: getEstablishmentBySlug(slug)?.name ?? "Estabelecimento não encontrado" };
}

function safeBackHref(from?: string, returnQuery?: string) {
  if (from === "onde-comer") return `/guia/onde-comer${returnQuery ? `?${returnQuery}` : ""}`;
  if (from === "parceiros") return "/guia/parceiros";
  if (from === "regiao") return "/guia/regiao";
  return "/guia";
}

export default async function EstablishmentPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ from?: string; returnQuery?: string }> }) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const establishment = getEstablishmentBySlug(slug);
  if (!establishment) notFound();
  const backHref = safeBackHref(query.from, query.returnQuery);
  const related = establishments.filter((item) => item.primaryCategoryId === establishment.primaryCategoryId && item.slug !== establishment.slug).slice(0, 3);

  return <><div className="lg:hidden"><MobileHeader title="Estabelecimento" backHref={backHref} /></div><main id="conteudo" className="pb-14">
    <div className="page-shell py-5"><Link href={backHref} className="hidden min-h-11 items-center gap-2 font-bold text-[var(--forest)] lg:inline-flex">← Voltar ao resultado</Link></div>
    <div className="page-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div>
        <section className="card-surface overflow-hidden"><div className="brand-pattern flex min-h-44 items-center justify-center border-b border-[var(--leaf-strong)] sm:min-h-52"><div className="text-center"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[var(--forest)] shadow-sm"><GuideIcon name="building" className="h-8 w-8" /></span><span className="mt-3 block text-xs font-bold uppercase tracking-[0.14em] text-[var(--forest)]">{establishment.primaryCategoryLabel}</span></div></div><div className="p-6 sm:p-8"><p className="eyebrow">{establishment.primaryCategoryLabel} · {establishment.type}</p><h1 className="mt-2 text-3xl font-bold leading-tight text-[var(--forest)] sm:text-4xl">{establishment.name}</h1><div className="mt-3"><Rating rating={establishment.rating} /></div><div className="mt-4"><Distance meters={establishment.distanceMeters} /></div></div></section>

        <section className="card-surface mt-5 p-6 sm:p-8"><p className="eyebrow">Dados do levantamento</p><h2 className="mt-2 text-2xl font-bold text-[var(--forest)]">Informações verificadas</h2><dl className="mt-6 grid gap-5 sm:grid-cols-2"><div className="rounded-xl bg-[var(--soft)] p-4"><dt className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Tipo</dt><dd className="mt-1 text-sm font-semibold">{establishment.type}</dd></div><div className="rounded-xl bg-[var(--soft)] p-4"><dt className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Endereço</dt><dd className="mt-1 text-sm leading-6">{establishment.address.line}, {establishment.address.city} — {establishment.address.state}</dd></div>{establishment.phone && <div className="rounded-xl bg-[var(--soft)] p-4"><dt className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Telefone</dt><dd className="mt-1 text-sm"><a href={establishment.phoneUrl} className="font-semibold text-[var(--forest)] underline">{establishment.phone}</a></dd></div>}{establishment.food?.ticket && <div className="rounded-xl bg-[var(--soft)] p-4"><dt className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Ticket</dt><dd className="mt-1 text-sm font-semibold">R$ {establishment.food.ticket.min}–{establishment.food.ticket.max}</dd></div>}<div className="rounded-xl bg-[var(--soft)] p-4"><dt className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Categorias</dt><dd className="mt-1 text-sm leading-6">{establishment.categoryTags.join(", ")}</dd></div><div className="rounded-xl bg-[var(--soft)] p-4"><dt className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Última verificação</dt><dd className="mt-1 text-sm font-semibold">{establishment.verifiedAt}</dd></div></dl></section>

        <section className="brand-pattern mt-5 rounded-2xl border border-[var(--leaf-strong)] p-6 sm:p-8"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[var(--forest)]"><GuideIcon name="region" /></span><h2 className="mt-5 text-2xl font-bold text-[var(--forest)]">Localização</h2><p className="mt-3 font-semibold text-[var(--ink)]">{establishment.address.line}, {establishment.address.city} — {establishment.address.state}</p><p className="mt-2 text-sm leading-6 text-[var(--muted)]">O guia funciona sem mapa. Copie o endereço para usar no aplicativo de navegação de sua preferência.</p><CopyAddressButton address={establishment.address} className="button-primary mt-5 w-full sm:w-auto" /></section>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start"><div className="card-surface p-5"><h2 className="text-lg font-bold text-[var(--forest)]">Ações</h2><CopyAddressButton address={establishment.address} className="button-primary mt-4 w-full" />{establishment.websiteUrl && <a href={establishment.websiteUrl} target="_blank" rel="noopener noreferrer" className="button-secondary mt-3 w-full">Visitar site <GuideIcon name="arrow" className="h-4 w-4" /></a>}<div className="mt-5 border-t border-[var(--line)] pt-4"><p className="text-xs leading-5 text-[var(--muted)]">Fontes: {establishment.sources.join(", ")}.</p><p className="mt-1 text-xs leading-5 text-[var(--muted)]">Dados verificados em {establishment.verifiedAt}.</p></div></div></aside>
    </div>

    <section className="page-shell mt-14"><p className="eyebrow">Continue explorando</p><h2 className="mt-2 text-2xl font-bold text-[var(--forest)]">Também nesta categoria</h2><div className="mt-5 grid gap-4 md:grid-cols-3">{related.map((item) => <Link key={item.slug} href={`/guia/estabelecimento/${item.slug}?from=${query.from ?? "guia"}`} className="card-surface card-interactive group p-5"><span className="eyebrow">{item.type}</span><strong className="mt-2 block text-[var(--forest)]">{item.name}</strong><span className="mt-3 block text-sm text-[var(--muted)]">{item.distanceMeters === undefined ? "Distância não informada" : `${item.distanceMeters} m do Aroeira`}</span><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--forest)]">Ver detalhes <GuideIcon name="arrow" className="h-4 w-4 group-hover:translate-x-1" /></span></Link>)}</div></section>
  </main></>;
}
