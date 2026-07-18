import Link from "next/link";

const items = [
  { href: "/guia/onde-comer", label: "Comer", icon: "◉" },
  { href: "/guia/parceiros", label: "Parceiros", icon: "◇" },
  { href: "/guia/regiao", label: "Região", icon: "⌖" },
  { href: "/guia/transporte", label: "Transporte", icon: "↔" },
];

export function MobileNav({ active }: { active: string }) {
  return (
    <nav aria-label="Navegação do guia" className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-white lg:hidden">
      <ul className="grid grid-cols-4">
        {items.map((item) => {
          const isActive = active === item.label.toLocaleLowerCase("pt-BR");
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold ${isActive ? "bg-[var(--leaf)] text-[var(--forest)]" : "text-[var(--muted)]"}`}
              >
                <span aria-hidden="true" className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
