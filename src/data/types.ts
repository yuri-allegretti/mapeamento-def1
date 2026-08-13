export type Category =
  | "alimentacao"
  | "saude"
  | "farmacias"
  | "supermercados"
  | "academias_esportes"
  | "bancos_correios_lotericas"
  | "educacao"
  | "servicos"
  | "postos"
  | "hoteis"
  | "shopping"
  | "parques"
  | "cultura";

export type Coordinates = {
  latitude: number;
  longitude: number;
  source: string;
};

export type FoodProfile = {
  group: string;
  ticket?: {
    min: number;
    max: number;
    currency: "BRL";
  };
};

export type Establishment = {
  id: string;
  slug: string;
  legacySlugs: string[];
  name: string;
  type: string;
  primaryCategoryId: Category;
  primaryCategoryLabel: string;
  categoryIds: Category[];
  categoryTags: string[];
  address: {
    line: string;
    city: string;
    state: string;
    countryCode: string;
  };
  phone?: string;
  phoneUrl?: string;
  websiteUrl?: string;
  googleMapsUrl: string;
  rating?: {
    value: number;
    reviewCount?: number;
    verifiedAt: string;
    provider: "Google Maps";
  };
  distanceMeters?: number;
  food?: FoodProfile;
  verifiedAt: string;
  sources: string[];
  location: {
    placeId?: string;
    manualCoordinates?: Coordinates;
  };
  sourceRecords: Array<{ sheet: string; row: number }>;
};

export type PartnerBenefit = {
  id: string;
  establishmentSlug: string;
  title: string;
  summary: string;
  rules: string[];
  proofMethod: string;
  category: Category;
  isActive: true;
};

export type MapPosition = { x: number; y: number };

export type TransitLine = {
  id: string;
  number: string;
  name: string;
  direction: string;
  origin: string;
  destination: string;
  isSimulated: true;
};

export type TransitStop = {
  id: string;
  name: string;
  reference: string;
  walkingMinutes: number;
  walkingTimeStatus: "simulated";
  mapPosition: MapPosition;
  lines: TransitLine[];
  officialUrl?: string;
  isSimulated: true;
};
