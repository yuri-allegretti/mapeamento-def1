import type { Metadata } from "next";
import { Suspense } from "react";
import { FoodExplorer } from "@/components/FoodExplorer";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";
import { SimulationNotice } from "@/components/SimulationNotice";
import { getFoodEstablishments, partnerBenefits } from "@/data";

export const metadata: Metadata = { title: "Onde comer" };

export default function WhereToEatPage() {
  const establishments = getFoodEstablishments();
  return (
    <>
      <MobileHeader title="Onde comer" />
      <main id="conteudo">
        <section className="page-shell py-6 lg:py-8">
          <div className="lg:flex lg:items-end lg:justify-between lg:gap-8">
            <div><p className="hidden text-sm font-bold uppercase tracking-wide text-[var(--gold)] lg:block">Decisão rápida para o almoço</p><h1 className="text-3xl font-bold text-[var(--forest)] lg:mt-2 lg:text-4xl">Onde comer perto do Aroeira</h1><p className="mt-2 max-w-2xl text-sm text-[var(--muted)] lg:text-base">Combine filtros, compare minutos de caminhada e abra a rota. A lista funciona independentemente do mapa.</p></div>
            <div className="mt-4 lg:mt-0 lg:max-w-lg"><SimulationNotice compact /></div>
          </div>
        </section>
        <Suspense fallback={<div className="page-shell border border-[var(--line)] p-8">Preparando filtros…</div>}>
          <FoodExplorer establishments={establishments} benefits={partnerBenefits} />
        </Suspense>
      </main>
      <MobileNav active="comer" />
    </>
  );
}
