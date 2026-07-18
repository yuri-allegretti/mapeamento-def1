import Link from "next/link";

export default function NotFound() {
  return <main id="conteudo" className="page-shell flex min-h-screen items-center justify-center py-12"><section className="max-w-xl border border-[var(--line)] p-8 text-center"><p className="text-sm font-bold uppercase tracking-wide text-[var(--gold)]">Erro 404</p><h1 className="mt-2 text-4xl font-bold text-[var(--forest)]">Página não encontrada</h1><p className="mt-3 text-[var(--muted)]">O endereço pode ter mudado ou não fazer parte do MVP.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><Link href="/guia/onde-comer" className="flex min-h-12 items-center justify-center bg-[var(--forest)] px-5 font-bold text-white">Onde comer</Link><Link href="/guia" className="flex min-h-12 items-center justify-center border border-[var(--forest)] px-5 font-bold text-[var(--forest)]">Início do guia</Link></div></section></main>;
}
