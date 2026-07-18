"use client";

import { ErrorState } from "@/components/States";

export default function GuideError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main id="conteudo" className="page-shell py-16"><ErrorState onRetry={reset} /></main>;
}
