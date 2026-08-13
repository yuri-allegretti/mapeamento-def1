import Link from "next/link";

export default function NotFound() {
  return <main id="conteudo" className="brand-pattern flex min-h-screen items-center justify-center p-4"><section className="card-surface max-w-xl p-8 text-center sm:p-12"><p className="eyebrow">Erro 404</p><h1 className="mt-2 text-4xl font-bold text-[var(--forest)]">Página não encontrada</h1><p className="mt-3 leading-7 text-[var(--muted)]">O endereço pode ter mudado ou não fazer parte do guia.</p><div className="mt-7 grid gap-3 sm:grid-cols-2"><Link href="/guia/onde-comer" className="button-primary">Onde comer</Link><Link href="/guia" className="button-secondary">Início do guia</Link></div></section></main>;
}
