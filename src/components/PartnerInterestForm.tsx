"use client";

import { useState } from "react";
import { demoPartnerFormAdapter, validatePartnerInterest, type PartnerFormErrors, type PartnerInterestInput } from "@/lib/partner-form-adapter";

const initialForm: PartnerInterestInput = { establishmentName: "", contactName: "", email: "", category: "", message: "", consent: false };

export function PartnerInterestForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<PartnerFormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [protocol, setProtocol] = useState("");
  const update = <K extends keyof PartnerInterestInput>(key: K, value: PartnerInterestInput[K]) => setForm((current) => ({ ...current, [key]: value }));
  const fieldClass = "mt-1 min-h-12 w-full border border-[var(--line)] bg-white px-3";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validatePartnerInterest(form);
    setErrors(validation);
    if (Object.keys(validation).length) {
      setStatus("idle");
      document.getElementById("form-error-summary")?.focus();
      return;
    }
    setStatus("submitting");
    try {
      const result = await demoPartnerFormAdapter.submit(form);
      setProtocol(result.protocol);
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <section className="border border-emerald-300 bg-emerald-50 p-6" role="status" tabIndex={-1}><h2 className="text-xl font-bold text-emerald-950">Interesse registrado na demonstração</h2><p className="mt-2 text-sm text-emerald-900">Protocolo {protocol}. Nenhuma informação foi enviada a um serviço externo.</p><button type="button" onClick={() => setStatus("idle")} className="mt-4 min-h-11 border border-emerald-900 px-4 font-bold text-emerald-950">Enviar outra demonstração</button></section>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 border border-[var(--line)] bg-white p-5 sm:p-7">
      <div><p className="text-xs font-bold uppercase tracking-wide text-[var(--gold)]">Formulário demonstrativo</p><h2 className="mt-1 text-2xl font-bold text-[var(--forest)]">Quero conversar sobre parceria</h2><p className="mt-2 text-sm text-[var(--muted)]">Nesta etapa, o envio é apenas simulado e não sai do navegador.</p></div>
      {Object.keys(errors).length > 0 && <div id="form-error-summary" role="alert" tabIndex={-1} className="border border-red-300 bg-red-50 p-3 text-sm text-red-900"><strong>Revise os campos indicados.</strong></div>}
      {status === "error" && <div role="alert" className="border border-red-300 bg-red-50 p-3 text-sm text-red-900"><strong>Não foi possível concluir a demonstração.</strong> Revise os dados e tente novamente.</div>}
      <div><label htmlFor="establishmentName" className="font-bold">Nome do estabelecimento</label><input id="establishmentName" value={form.establishmentName} onChange={(event) => update("establishmentName", event.target.value)} aria-invalid={Boolean(errors.establishmentName)} aria-describedby={errors.establishmentName ? "establishmentName-error" : undefined} className={fieldClass} />{errors.establishmentName && <p id="establishmentName-error" className="mt-1 text-sm text-red-700">{errors.establishmentName}</p>}</div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label htmlFor="contactName" className="font-bold">Pessoa responsável</label><input id="contactName" value={form.contactName} onChange={(event) => update("contactName", event.target.value)} aria-invalid={Boolean(errors.contactName)} className={fieldClass} />{errors.contactName && <p className="mt-1 text-sm text-red-700">{errors.contactName}</p>}</div>
        <div><label htmlFor="email" className="font-bold">E-mail</label><input id="email" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby="email-hint" className={fieldClass} /><p id="email-hint" className="mt-1 text-xs text-[var(--muted)]">Use erro@demo.local para visualizar o estado de falha.</p>{errors.email && <p className="mt-1 text-sm text-red-700">{errors.email}</p>}</div>
      </div>
      <div><label htmlFor="category" className="font-bold">Categoria</label><select id="category" value={form.category} onChange={(event) => update("category", event.target.value)} aria-invalid={Boolean(errors.category)} className={fieldClass}><option value="">Selecione</option><option>Alimentação</option><option>Saúde e bem-estar</option><option>Serviços</option><option>Educação</option><option>Outro</option></select>{errors.category && <p className="mt-1 text-sm text-red-700">{errors.category}</p>}</div>
      <div><label htmlFor="message" className="font-bold">Ideia de benefício <span className="font-normal text-[var(--muted)]">(opcional)</span></label><textarea id="message" rows={4} value={form.message} onChange={(event) => update("message", event.target.value)} className="mt-1 w-full border border-[var(--line)] p-3" /></div>
      <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={form.consent} onChange={(event) => update("consent", event.target.checked)} className="mt-0.5 h-5 w-5 shrink-0" /><span>Concordo com o uso destes dados apenas para demonstrar o fluxo de contato.</span></label>{errors.consent && <p className="text-sm text-red-700">{errors.consent}</p>}
      <button type="submit" disabled={status === "submitting"} className="min-h-12 w-full bg-[var(--forest)] px-5 font-bold text-white disabled:cursor-wait disabled:opacity-60">{status === "submitting" ? "Simulando envio…" : "Enviar interesse demonstrativo"}</button>
    </form>
  );
}
