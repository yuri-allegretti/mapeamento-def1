import { describe, expect, it } from "vitest";
import { demoPartnerFormAdapter, validatePartnerInterest } from "./partner-form-adapter";

describe("partner interest form", () => {
  it("returns accessible field errors for incomplete input", () => {
    const errors = validatePartnerInterest({ establishmentName: "", contactName: "", email: "inválido", category: "", message: "", consent: false });
    expect(errors).toMatchObject({ establishmentName: expect.any(String), contactName: expect.any(String), email: expect.any(String), category: expect.any(String), consent: expect.any(String) });
  });

  it("accepts a complete demonstration", async () => {
    const result = await demoPartnerFormAdapter.submit({ establishmentName: "Café Exemplo", contactName: "Ana", email: "ana@example.com", category: "Alimentação", message: "", consent: true });
    expect(result.protocol).toMatch(/^DEMO-/);
  });

  it("exposes a deterministic demonstration error", async () => {
    await expect(demoPartnerFormAdapter.submit({ establishmentName: "Café Exemplo", contactName: "Ana", email: "erro@demo.local", category: "Alimentação", message: "", consent: true })).rejects.toThrow("Falha demonstrativa");
  });
});
