import { describe, expect, it } from "vitest";
import { establishments, getEstablishmentBySlug, getFoodEstablishments, partnerBenefits } from "./index";

describe("dados consolidados", () => {
  it("publica os totais canônicos esperados", () => {
    expect(establishments).toHaveLength(110);
    expect(getFoodEstablishments()).toHaveLength(33);
    expect(getFoodEstablishments().filter((item) => item.food?.ticket)).toHaveLength(21);
    expect(partnerBenefits).toHaveLength(0);
  });

  it("mantém identificadores e slugs únicos", () => {
    const ids = establishments.map((item) => item.id);
    const slugs = establishments.map((item) => item.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.every((slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))).toBe(true);
  });

  it("preserva alias de rota para a antiga unidade Rio Verde", () => {
    expect(getEstablishmentBySlug("rio-verde-supermercado")?.slug).toBe("rio-verde");
  });

  it("mantém rastreabilidade e links externos seguros", () => {
    for (const item of establishments) {
      expect(item.sourceRecords.length).toBeGreaterThan(0);
      expect(item.verifiedAt).toBe("12/08/2026");
      expect(item.googleMapsUrl).toMatch(/^https:\/\//);
      if (item.websiteUrl) expect(item.websiteUrl).toMatch(/^https?:\/\//);
    }
  });
});
