export type Category =
  | "alimentacao"
  | "academias"
  | "supermercados"
  | "educacao"
  | "servicos"
  | "bancos";

export type DataStatus = "reference" | "simulated";

export type MapPosition = {
  x: number;
  y: number;
};

export type FoodProfile = {
  cuisine: string;
  ticketMin: number;
  ticketMax: number;
  ticketStatus: DataStatus;
  vrCards: string[];
  vrStatus: "simulated";
  serviceModes: string[];
};

export type Establishment = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  categoryLabel: string;
  subcategory: string;
  description: string;
  address: string;
  walkingMinutes: number;
  walkingTimeStatus: "simulated";
  mapPosition: MapPosition;
  sourceLabel: string;
  isSimulated: true;
  googleMapsUrl: string;
  websiteUrl?: string;
  whatsappUrl?: string;
  menuUrl?: string;
  food?: FoodProfile;
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
  isSimulated: true;
};

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
