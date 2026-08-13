import { describe, expect, it } from "vitest";
import { getFoodEstablishments } from "@/data";
import {
  defaultFoodFilters,
  filterFoodEstablishments,
  parseFoodState,
  serializeFoodState,
  sortFoodEstablishments,
} from "./establishment-rules";

describe("filtros e ordenação de alimentação", () => {
  const food = getFoodEstablishments();

  it("combina busca, grupo, ticket e distância com dados conhecidos", () => {
    const candidate = food.find((item) => item.food?.ticket && item.distanceMeters !== undefined);
    expect(candidate).toBeDefined();
    const result = filterFoodEstablishments(food, {
      search: candidate!.name,
      group: candidate!.food!.group,
      ticketMax: candidate!.food!.ticket!.min,
      maxDistanceMeters: candidate!.distanceMeters!,
    });
    expect(result.map((item) => item.slug)).toContain(candidate!.slug);
  });

  it("não assume valores ausentes ao aplicar filtros numéricos", () => {
    expect(filterFoodEstablishments(food, { ...defaultFoodFilters, ticketMax: 100 }).every((item) => item.food?.ticket)).toBe(true);
    expect(filterFoodEstablishments(food, { ...defaultFoodFilters, maxDistanceMeters: 2000 }).every((item) => item.distanceMeters !== undefined)).toBe(true);
  });

  it("ordena valores conhecidos antes dos ausentes", () => {
    const byDistance = sortFoodEstablishments(food, "distance");
    const knownDistances = byDistance.filter((item) => item.distanceMeters !== undefined).map((item) => item.distanceMeters!);
    expect(knownDistances).toEqual([...knownDistances].sort((a, b) => a - b));
    const firstUnknownDistance = byDistance.findIndex((item) => item.distanceMeters === undefined);
    expect(firstUnknownDistance === -1 || firstUnknownDistance >= knownDistances.length).toBe(true);

    const byTicket = sortFoodEstablishments(food, "ticket");
    const knownTickets = byTicket.filter((item) => item.food?.ticket).map((item) => item.food!.ticket!.min);
    expect(knownTickets).toEqual([...knownTickets].sort((a, b) => a - b));
  });

  it("serializa e restaura o estado pela URL", () => {
    const filters = { ...defaultFoodFilters, search: "pizza", group: "Alimentação Restaurantes", ticketMax: 60, maxDistanceMeters: 1500 };
    const query = serializeFoodState(filters, "ticket");
    expect(parseFoodState(new URLSearchParams(query))).toEqual({ filters, sort: "ticket" });
  });
});
