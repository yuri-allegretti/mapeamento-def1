export type PartnerInterestInput = {
  establishmentName: string;
  contactName: string;
  email: string;
  category: string;
  message: string;
  consent: boolean;
};

export type PartnerFormErrors = Partial<
  Record<keyof PartnerInterestInput, string>
>;

export function validatePartnerInterest(
  input: PartnerInterestInput,
): PartnerFormErrors {
  const errors: PartnerFormErrors = {};
  if (input.establishmentName.trim().length < 2) {
    errors.establishmentName = "Informe o nome do estabelecimento.";
  }
  if (input.contactName.trim().length < 2) {
    errors.contactName = "Informe o nome da pessoa responsável.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.email = "Informe um e-mail válido.";
  }
  if (!input.category) {
    errors.category = "Selecione uma categoria.";
  }
  if (!input.consent) {
    errors.consent = "Confirme o consentimento para continuar.";
  }
  return errors;
}

export interface PartnerFormAdapter {
  submit(input: PartnerInterestInput): Promise<{ protocol: string }>;
}

export const demoPartnerFormAdapter: PartnerFormAdapter = {
  async submit(input) {
    await new Promise((resolve) => setTimeout(resolve, 450));
    if (input.email.toLocaleLowerCase() === "erro@demo.local") {
      throw new Error("Falha demonstrativa de envio");
    }
    return { protocol: `DEMO-${Date.now().toString().slice(-6)}` };
  },
};
