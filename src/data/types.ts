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

export type TransitPublicationStatus = "published" | "pending" | "excluded";

export type TransitStopService = {
  lineCode: string;
  directions: string[];
};

export type TransitLineStop = {
  stopId: string;
  directions: string[];
};

export type TransitLine = {
  system: "urban" | "metropolitan";
  systemLabel: string;
  code: string;
  name: string;
  category: string;
  colorPattern?: string;
  cardOnly: boolean | null;
  officialStopCount: number | null;
  directions: string[];
  operationalStatus: string;
  publicationStatus: TransitPublicationStatus;
  publicationDecision: string;
  sourceUrl: string;
  sourceUpdatedAt: string;
  scheduleUrl: string;
  observations?: string;
  stops: TransitLineStop[];
  sourceRecord: { sheet: "Linhas"; row: number };
};

export type TransitStop = {
  id: string;
  name: string;
  neighborhood?: string;
  latitude: number;
  longitude: number;
  distanceMeters: number;
  distanceBand: string;
  stopType: string;
  accessibility: string;
  situation: string;
  confidence: string;
  mapUrl: string;
  sourceUrl: string;
  sourceUpdatedAt: string;
  verifiedAt: string;
  observations?: string;
  services: TransitStopService[];
  sourceRecord: { sheet: "Pontos oficiais"; row: number };
};

export type TransitDataset = {
  metadata: {
    referenceName: string;
    referenceAddress: string;
    radiusMeters: number;
    distanceMethod: "geodesic-straight-line";
    validationDate: string;
    urbanSourceUpdatedAt?: string;
  };
  stops: TransitStop[];
  lines: TransitLine[];
};
