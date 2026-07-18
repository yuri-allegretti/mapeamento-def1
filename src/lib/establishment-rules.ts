import type { Establishment, PartnerBenefit } from "@/data/types";

export type FoodFilters = {
  search: string;
  partnersOnly: boolean;
  cuisine: string;
  ticketMax: number | null;
  vrCard: string;
  maxWalkingMinutes: number | null;
};

export type FoodSort = "walking" | "ticket" | "name";

export const defaultFoodFilters: FoodFilters = {
  search: "",
  partnersOnly: false,
  cuisine: "",
  ticketMax: null,
  vrCard: "",
  maxWalkingMinutes: null,
};

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");

export function filterFoodEstablishments(
  establishments: Establishment[],
  filters: FoodFilters,
  benefits: PartnerBenefit[],
) {
  const activePartnerSlugs = new Set(
    benefits
      .filter((benefit) => benefit.isActive)
      .map((benefit) => benefit.establishmentSlug),
  );
  const normalizedSearch = normalizeText(filters.search.trim());

  return establishments.filter((establishment) => {
    if (!establishment.food) return false;
    if (
      normalizedSearch &&
      !normalizeText(`${establishment.name} ${establishment.food.cuisine}`).includes(
        normalizedSearch,
      )
    ) {
      return false;
    }
    if (filters.partnersOnly && !activePartnerSlugs.has(establishment.slug)) {
      return false;
    }
    if (filters.cuisine && establishment.food.cuisine !== filters.cuisine) {
      return false;
    }
    if (
      filters.ticketMax !== null &&
      establishment.food.ticketMin > filters.ticketMax
    ) {
      return false;
    }
    if (
      filters.vrCard &&
      !establishment.food.vrCards.includes(filters.vrCard)
    ) {
      return false;
    }
    if (
      filters.maxWalkingMinutes !== null &&
      establishment.walkingMinutes > filters.maxWalkingMinutes
    ) {
      return false;
    }
    return true;
  });
}

export function sortFoodEstablishments(
  establishments: Establishment[],
  sort: FoodSort,
) {
  return [...establishments].sort((a, b) => {
    if (sort === "walking") {
      return a.walkingMinutes - b.walkingMinutes || a.name.localeCompare(b.name);
    }
    if (sort === "ticket") {
      return (
        (a.food?.ticketMin ?? Number.POSITIVE_INFINITY) -
          (b.food?.ticketMin ?? Number.POSITIVE_INFINITY) ||
        a.name.localeCompare(b.name)
      );
    }
    return a.name.localeCompare(b.name, "pt-BR");
  });
}

export function deriveFoodOptions(establishments: Establishment[]) {
  const food = establishments.filter(
    (establishment): establishment is Establishment & { food: NonNullable<Establishment["food"]> } =>
      Boolean(establishment.food),
  );

  return {
    cuisines: [...new Set(food.map((establishment) => establishment.food.cuisine))].sort(
      (a, b) => a.localeCompare(b, "pt-BR"),
    ),
    vrCards: [...new Set(food.flatMap((establishment) => establishment.food.vrCards))].sort(
      (a, b) => a.localeCompare(b, "pt-BR"),
    ),
  };
}

export function serializeFoodState(filters: FoodFilters, sort: FoodSort) {
  const params = new URLSearchParams();
  if (filters.search) params.set("q", filters.search);
  if (filters.partnersOnly) params.set("parceiros", "1");
  if (filters.cuisine) params.set("gastronomia", filters.cuisine);
  if (filters.ticketMax !== null) params.set("ticket", String(filters.ticketMax));
  if (filters.vrCard) params.set("vr", filters.vrCard);
  if (filters.maxWalkingMinutes !== null) {
    params.set("caminhada", String(filters.maxWalkingMinutes));
  }
  if (sort !== "walking") params.set("ordem", sort);
  return params.toString();
}

export function parseFoodState(params: URLSearchParams): {
  filters: FoodFilters;
  sort: FoodSort;
} {
  const numeric = (key: string) => {
    const value = Number(params.get(key));
    return Number.isFinite(value) && value > 0 ? value : null;
  };
  const requestedSort = params.get("ordem");

  return {
    filters: {
      search: params.get("q") ?? "",
      partnersOnly: params.get("parceiros") === "1",
      cuisine: params.get("gastronomia") ?? "",
      ticketMax: numeric("ticket"),
      vrCard: params.get("vr") ?? "",
      maxWalkingMinutes: numeric("caminhada"),
    },
    sort:
      requestedSort === "ticket" || requestedSort === "name"
        ? requestedSort
        : "walking",
  };
}
