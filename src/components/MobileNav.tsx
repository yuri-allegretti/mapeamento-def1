import Link from "next/link";
import { GuideIcon, type GuideIconName } from "./GuideIcon";

const items: Array<{ href: string; label: string; icon: GuideIconName }> = [
  { href: "/guia/onde-comer", label: "Comer", icon: "food" },
  { href: "/guia/parceiros", label: "Parceiros", icon: "partners" },
  { href: "/guia/regiao", label: "Região", icon: "region" },
  { href: "/guia/transporte", label: "Transporte", icon: "transport" },
];

export function MobileNav({ active }: { active: string }) {
  return (
    <nav aria-label="Navegação do guia" className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_28px_rgba(36,62,30,0.08)] backdrop-blur lg:hidden">
      <ul className="grid grid-cols-4">
        {items.map((item) => {
          const isActive = active === item.label.toLocaleLowerCase("pt-BR");
          return (
            <li key={item.href}>
              <Link href={item.href} aria-current={isActive ? "page" : undefined} className={`relative flex min-h-17 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold ${isActive ? "text-[var(--forest)]" : "text-[var(--muted)]"}`}>
                {isActive && <span className="absolute top-1 h-1 w-7 rounded-full bg-[var(--brand-green)]" />}
                <GuideIcon name={item.icon} className={`h-5 w-5 ${isActive ? "stroke-[2.2]" : ""}`} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
