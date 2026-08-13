import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import "./globals.css";

const montserrat = localFont({
  src: "./fonts/montserrat-latin.woff2",
  variable: "--font-montserrat",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Guia Aroeira Office Park",
    template: "%s | Guia Aroeira",
  },
  description:
    "Guia de alimentação e serviços do entorno do Aroeira Office Park.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={montserrat.variable}>
        <a
          href="#conteudo"
          className="sr-only z-50 bg-white px-4 py-3 text-[var(--forest)] focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
        >
          Pular para o conteúdo
        </a>
        {children}
        <footer className="border-t border-[var(--line)] bg-white">
          <div className="page-shell flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/guia" aria-label="Início do Guia Aroeira"><BrandLogo className="h-9 w-auto" /></Link>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-[var(--muted)]">
              <a href="https://www.aroeiraofficepark.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--forest)]">Site institucional</a>
              <Link href="/guia/termos" className="hover:text-[var(--forest)]">Termos de uso</Link>
              <Link href="/guia/privacidade" className="hover:text-[var(--forest)]">Privacidade</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
