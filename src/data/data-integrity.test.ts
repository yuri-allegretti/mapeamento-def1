import { describe, expect, it } from "vitest";
import { establishments, partnerBenefits } from "./index";

describe("MVP local data", () => {
  it("has unique stable slugs", () => {
    const slugs = establishments.map((item) => item.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.every((slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))).toBe(true);
  });

  it("marks every enriched MVP record as simulated", () => {
    expect(establishments.every((item) => item.isSimulated)).toBe(true);
    expect(establishments.every((item) => item.walkingTimeStatus === "simulated")).toBe(true);
  });

  it("keeps active benefits simulated and linked to existing establishments", () => {
    const slugs = new Set(establishments.map((item) => item.slug));
    for (const benefit of partnerBenefits) {
      expect(benefit.isActive).toBe(true);
      expect(benefit.isSimulated).toBe(true);
      expect(slugs.has(benefit.establishmentSlug)).toBe(true);
    }
  });
});
