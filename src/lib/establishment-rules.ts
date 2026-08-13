import type { Establishment } from "@/data/types";

export type FoodFilters = {
  search: string;
  group: string;
  ticketMax: number | null;
  maxDistanceMeters: number | null;
};

export type FoodSort = "distance" | "ticket" | "name";

export const defaultFoodFilters: FoodFilters = {
  search: "",
  group: "",
  ticketMax: null,
  maxDistanceMeters: null,
};

const normalizeText = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");

export function filterFoodEstablishments(establishments: Establishment[], filters: FoodFilters) {
  const search = normalizeText(filters.search.trim());
  return establishments.filter((establishment) => {
    if (!establishment.food) return false;
    if (search && !normalizeText(`${establishment.name} ${establishment.type} ${establishment.food.group}`).includes(search)) return false;
    if (filters.group && establishment.food.group !== filters.group) return false;
    if (filters.ticketMax !== null && (!establishment.food.ticket || establishment.food.ticket.min > filters.ticketMax)) return false;
    if (filters.maxDistanceMeters !== null && (establishment.distanceMeters === undefined || establishment.distanceMeters > filters.maxDistanceMeters)) return false;
    return true;
  });
}

export function sortFoodEstablishments(establishments: Establishment[], sort: FoodSort) {
  return [...establishments].sort((a, b) => {
    if (sort === "distance") return (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity) || a.name.localeCompare(b.name, "pt-BR");
    if (sort === "ticket") return (a.food?.ticket?.min ?? Infinity) - (b.food?.ticket?.min ?? Infinity) || a.name.localeCompare(b.name, "pt-BR");
    return a.name.localeCompare(b.name, "pt-BR");
  });
}

export function deriveFoodOptions(establishments: Establishment[]) {
  return {
    groups: [...new Set(establishments.flatMap((item) => item.food?.group ? [item.food.group] : []))].sort((a, b) => a.localeCompare(b, "pt-BR")),
  };
}

export function serializeFoodState(filters: FoodFilters, sort: FoodSort) {
  const params = new URLSearchParams();
  if (filters.search) params.set("q", filters.search);
  if (filters.group) params.set("grupo", filters.group);
  if (filters.ticketMax !== null) params.set("ticket", String(filters.ticketMax));
  if (filters.maxDistanceMeters !== null) params.set("distancia", String(filters.maxDistanceMeters));
  if (sort !== "distance") params.set("ordem", sort);
  return params.toString();
}

export function parseFoodState(params: URLSearchParams): { filters: FoodFilters; sort: FoodSort } {
  const numeric = (key: string) => {
    const value = Number(params.get(key));
    return Number.isFinite(value) && value > 0 ? value : null;
  };
  const requestedSort = params.get("ordem");
  return {
    filters: {
      search: params.get("q") ?? "",
      group: params.get("grupo") ?? "",
      ticketMax: numeric("ticket"),
      maxDistanceMeters: numeric("distancia"),
    },
    sort: requestedSort === "ticket" || requestedSort === "name" ? requestedSort : "distance",
  };
}
