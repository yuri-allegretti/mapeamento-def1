import { describe, expect, it } from "vitest";
import { getFoodEstablishments, partnerBenefits } from "@/data";
import {
  defaultFoodFilters,
  filterFoodEstablishments,
  parseFoodState,
  serializeFoodState,
  sortFoodEstablishments,
} from "./establishment-rules";

describe("food filtering and sorting", () => {
  const food = getFoodEstablishments();

  it("combines search, partner, VR, ticket and walking filters", () => {
    const result = filterFoodEstablishments(
      food,
      {
        search: "quinoa",
        partnersOnly: true,
        cuisine: "Brasileira",
        ticketMax: 40,
        vrCard: "Alelo",
        maxWalkingMinutes: 10,
      },
      partnerBenefits,
    );
    expect(result.map((item) => item.slug)).toEqual(["restaurante-quinoa-225"]);
  });

  it("never includes an incompatible partner ahead of compatible results", () => {
    const result = filterFoodEstablishments(
      food,
      { ...defaultFoodFilters, partnersOnly: true, cuisine: "Pizzaria" },
      partnerBenefits,
    );
    expect(result.map((item) => item.slug)).toEqual(["dalle-pizza-taruma"]);
    expect(result.some((item) => item.slug === "habibs-taruma")).toBe(false);
  });

  it("sorts by walking minutes and then by name", () => {
    const result = sortFoodEstablishments(food, "walking");
    expect(result[0].walkingMinutes).toBeLessThanOrEqual(result[1].walkingMinutes);
    expect(result.at(-1)?.walkingMinutes).toBeGreaterThanOrEqual(result[0].walkingMinutes);
  });

  it("sorts by minimum ticket", () => {
    const result = sortFoodEstablishments(food, "ticket");
    expect(result[0].food?.ticketMin).toBe(12);
  });

  it("round-trips filter state through the URL", () => {
    const filters = { ...defaultFoodFilters, search: "pizza", partnersOnly: true, ticketMax: 60, vrCard: "VR", maxWalkingMinutes: 10 };
    const query = serializeFoodState(filters, "ticket");
    expect(parseFoodState(new URLSearchParams(query))).toEqual({ filters, sort: "ticket" });
  });
});
