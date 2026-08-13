import type { Metadata } from "next";
import { Suspense } from "react";
import { FoodExplorer } from "@/components/FoodExplorer";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";
import { getFoodEstablishments } from "@/data";

export const metadata: Metadata = { title: "Onde comer" };

export default function WhereToEatPage() {
  const establishments = getFoodEstablishments();
  return (
    <>
      <MobileHeader title="Onde comer" />
      <main id="conteudo">
        <section className="brand-pattern border-b border-[var(--leaf-strong)]">
          <div className="page-shell py-8 lg:py-12">
          <div className="lg:flex lg:items-end lg:justify-between lg:gap-8">
            <div><p className="eyebrow">Decisão rápida para o almoço</p><h1 className="mt-2 text-3xl font-bold text-[var(--forest)] lg:text-5xl">Onde comer perto do Aroeira</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] lg:text-base">Compare tipo, distância e ticket com dados do levantamento consolidado.</p></div>
          </div>
          </div>
        </section>
        <Suspense fallback={<div className="page-shell card-surface my-8 p-8">Preparando filtros…</div>}>
          <FoodExplorer establishments={establishments} />
        </Suspense>
      </main>
      <MobileNav active="comer" />
    </>
  );
}
