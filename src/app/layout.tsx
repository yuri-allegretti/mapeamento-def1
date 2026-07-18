import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Guia Aroeira Office Park",
    template: "%s | Guia Aroeira",
  },
  description:
    "MVP estrutural do guia de alimentação, serviços, parceiros e transporte do entorno do Aroeira Office Park.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <a
          href="#conteudo"
          className="sr-only z-50 bg-white px-4 py-3 text-[var(--forest)] focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
        >
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
