"use client";

import { useEffect, useRef, useState } from "react";
import type { Establishment } from "@/data/types";
import { GuideIcon } from "./GuideIcon";

type CopyStatus = "idle" | "success" | "error";

function formatAddress(address: Establishment["address"]) {
  return `${address.line}, ${address.city} - ${address.state}`;
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Clipboard indisponível");
}

export function CopyAddressButton({
  address,
  className = "button-primary",
}: {
  address: Establishment["address"];
  className?: string;
}) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  async function handleCopy() {
    clearTimeout(resetTimer.current);
    try {
      await copyText(formatAddress(address));
      setStatus("success");
    } catch {
      setStatus("error");
    }
    resetTimer.current = setTimeout(() => setStatus("idle"), 2500);
  }

  const label = status === "success" ? "Endereço copiado" : status === "error" ? "Não foi possível copiar" : "Copiar endereço";

  return <button type="button" onClick={handleCopy} className={`${className} rounded-xl`} aria-live="polite"><GuideIcon name={status === "success" ? "check" : "copy"} className="h-4 w-4 shrink-0" />{label}</button>;
}
