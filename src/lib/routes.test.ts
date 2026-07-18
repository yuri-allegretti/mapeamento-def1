import { describe, expect, it } from "vitest";
import { establishments } from "@/data";
import { establishmentRoute, guideRoutes } from "./routes";

describe("guide navigation", () => {
  it("declares all required static routes once", () => {
    expect(new Set(guideRoutes).size).toBe(guideRoutes.length);
    expect(guideRoutes).toEqual(expect.arrayContaining(["/guia", "/guia/onde-comer", "/guia/regiao", "/guia/parceiros", "/guia/transporte", "/guia/seja-parceiro"]));
  });

  it("creates a stable detail URL for every slug", () => {
    for (const establishment of establishments) {
      expect(establishmentRoute(establishment.slug)).toBe(`/guia/estabelecimento/${establishment.slug}`);
    }
  });
});
