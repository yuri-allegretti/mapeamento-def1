import type { Category, Establishment, FoodProfile } from "./types";

type FoodSeed = {
  slug: string;
  name: string;
  address: string;
  walkingMinutes: number;
  cuisine: string;
  ticketMin: number;
  ticketMax: number;
  ticketStatus?: "reference" | "simulated";
  vrCards: string[];
  serviceModes: string[];
};

const foodSeeds: FoodSeed[] = [
  { slug: "restaurante-quinoa-225", name: "Restaurante Quinoa 225", address: "Av. Mal. Humberto de Alencar Castelo Branco, 225 — Tarumã", walkingMinutes: 10, cuisine: "Brasileira", ticketMin: 20, ticketMax: 100, vrCards: ["Alelo", "VR"], serviceModes: ["Buffet", "Almoço"] },
  { slug: "restaurante-slow-fire", name: "Restaurante Slow Fire", address: "R. Dr. João Evangelista Espíndola, 1587 — Jardim Social", walkingMinutes: 10, cuisine: "Carnes", ticketMin: 20, ticketMax: 40, vrCards: ["Sodexo"], serviceModes: ["À la carte"] },
  { slug: "restaurante-yifan", name: "Restaurante YIFAN", address: "Av. Mal. Humberto de Alencar Castelo Branco — Cristo Rei", walkingMinutes: 13, cuisine: "Asiática", ticketMin: 20, ticketMax: 40, vrCards: ["Alelo", "Ticket"], serviceModes: ["Buffet"] },
  { slug: "dalle-pizza-taruma", name: "Dalle Pizza - Tarumã", address: "Av. Victor Ferreira do Amaral, 142 — Tarumã", walkingMinutes: 6, cuisine: "Pizzaria", ticketMin: 20, ticketMax: 40, vrCards: ["VR"], serviceModes: ["À la carte", "Delivery"] },
  { slug: "habibs-taruma", name: "Habib's", address: "Av. Victor Ferreira do Amaral, 639 — Tarumã", walkingMinutes: 8, cuisine: "Árabe", ticketMin: 20, ticketMax: 60, vrCards: ["Alelo", "VR", "Sodexo"], serviceModes: ["Lanches", "Delivery"] },
  { slug: "restaurante-peixinho-pizzaria", name: "Restaurante Peixinho & Pizzaria", address: "R. Frei Orlando, 690 — Tarumã", walkingMinutes: 4, cuisine: "Brasileira", ticketMin: 40, ticketMax: 100, vrCards: ["Ticket"], serviceModes: ["Buffet", "Pizzaria"] },
  { slug: "limoeiro-casa-de-comidas", name: "Limoeiro - Casa de Comidas", address: "Av. Mal. Humberto de Alencar Castelo Branco, 669 — Jardim Social", walkingMinutes: 9, cuisine: "Contemporânea", ticketMin: 60, ticketMax: 140, vrCards: ["Alelo"], serviceModes: ["À la carte"] },
  { slug: "happy-burger-restaurante", name: "Happy Burger & Restaurante", address: "Av. Mal. Humberto de Alencar Castelo Branco, 251 — Cristo Rei", walkingMinutes: 9, cuisine: "Hambúrguer", ticketMin: 40, ticketMax: 60, vrCards: ["VR"], serviceModes: ["Lanches", "Delivery"] },
  { slug: "madero-jardim-social", name: "Madero Steak House Jardim Social", address: "Av. Nossa Sra. da Luz, 2521 — Jardim Social", walkingMinutes: 14, cuisine: "Carnes", ticketMin: 60, ticketMax: 100, vrCards: ["Alelo", "Sodexo"], serviceModes: ["À la carte"] },
  { slug: "restaurante-peruano", name: "Restaurante Peruano Gastronomia e Cultura", address: "Av. Mal. Humberto de Alencar Castelo Branco, 675 — Tarumã", walkingMinutes: 14, cuisine: "Peruana", ticketMin: 60, ticketMax: 120, vrCards: ["Ticket"], serviceModes: ["À la carte"] },
  { slug: "paiol-do-joao", name: "Paiol do João Carnes e Assados", address: "R. Gottlieb Rosenau, 158 — Tarumã", walkingMinutes: 11, cuisine: "Carnes", ticketMin: 60, ticketMax: 160, vrCards: ["VR"], serviceModes: ["Retirada"] },
  { slug: "costelao-fontana", name: "Costelão Fontana Churrascaria Curitiba", address: "Av. Mal. Humberto de Alencar Castelo Branco, 645 — Tarumã", walkingMinutes: 14, cuisine: "Churrascaria", ticketMin: 60, ticketMax: 80, vrCards: ["Alelo", "VR"], serviceModes: ["Buffet"] },
  { slug: "barraca-do-claudio", name: "Barraca do Claudio", address: "Av. Victor Ferreira do Amaral, 348 — Tarumã", walkingMinutes: 2, cuisine: "Lanches", ticketMin: 40, ticketMax: 60, vrCards: ["Sodexo"], serviceModes: ["Lanches"] },
  { slug: "mamae-urso-cafe", name: "Mamãe Urso Café", address: "R. Pres. Epitácio Pessoa, 558 — Tarumã", walkingMinutes: 12, cuisine: "Cafeteria", ticketMin: 20, ticketMax: 50, ticketStatus: "simulated", vrCards: ["Alelo"], serviceModes: ["Café", "Lanches"] },
  { slug: "leve-sabor", name: "Leve Sabor", address: "Av. Victor Ferreira do Amaral, 315 — Tarumã", walkingMinutes: 10, cuisine: "Saudável", ticketMin: 25, ticketMax: 55, ticketStatus: "simulated", vrCards: ["VR", "Ticket"], serviceModes: ["Almoço", "Retirada"] },
  { slug: "cintia-cakes", name: "Cintia Cakes Confeiteira", address: "R. Teófilo Soares Gomes, 815 — Jardim Social", walkingMinutes: 10, cuisine: "Confeitaria", ticketMin: 15, ticketMax: 45, ticketStatus: "simulated", vrCards: ["Alelo"], serviceModes: ["Doces", "Retirada"] },
  { slug: "we-love-espetinho-sushi", name: "We Love Espetinho e Sushi", address: "Av. Victor Ferreira do Amaral, 760 — Tarumã", walkingMinutes: 8, cuisine: "Japonesa", ticketMin: 20, ticketMax: 120, vrCards: ["Alelo", "VR"], serviceModes: ["À la carte", "Delivery"] },
  { slug: "mcdonalds-cristo-rei", name: "McDonald's - Cristo Rei", address: "Av. Mal. Humberto A. Castelo Branco, 1081 — Cristo Rei", walkingMinutes: 18, cuisine: "Fast-food", ticketMin: 20, ticketMax: 40, vrCards: ["Alelo", "Sodexo"], serviceModes: ["Lanches", "Delivery"] },
  { slug: "churras-express-assai", name: "Churras Express (Assaí)", address: "Av. Mal. Humberto de Alencar Castelo Branco, 230 — Cristo Rei", walkingMinutes: 12, cuisine: "Brasileira", ticketMin: 20, ticketMax: 40, vrCards: ["VR"], serviceModes: ["Almoço"] },
  { slug: "subway-taruma", name: "Subway - Tarumã", address: "Av. Victor Ferreira do Amaral, 1280 — Tarumã", walkingMinutes: 17, cuisine: "Sanduíches", ticketMin: 20, ticketMax: 40, vrCards: ["Alelo", "Ticket"], serviceModes: ["Lanches", "Delivery"] },
  { slug: "yellow-dog-taruma", name: "Yellow Dog | Hot Dog Tarumã", address: "Av. Victor Ferreira do Amaral, 518 — Tarumã", walkingMinutes: 5, cuisine: "Lanches", ticketMin: 20, ticketMax: 40, vrCards: ["VR"], serviceModes: ["Lanches", "Delivery"] },
  { slug: "los-loccos-curitiba", name: "Los Loccos Curitiba", address: "Av. Victor Ferreira do Amaral, 293 — Tarumã", walkingMinutes: 4, cuisine: "Mexicana", ticketMin: 20, ticketMax: 80, vrCards: ["Alelo"], serviceModes: ["À la carte", "Delivery"] },
  { slug: "folhetim-bar", name: "Folhetim Bar", address: "Av. Victor Ferreira do Amaral, 883 — Tarumã", walkingMinutes: 10, cuisine: "Bar e petiscos", ticketMin: 60, ticketMax: 140, vrCards: ["Sodexo"], serviceModes: ["À la carte"] },
  { slug: "rio-verde", name: "Rio Verde", address: "Av. Victor Ferreira do Amaral, 816 — Tarumã", walkingMinutes: 11, cuisine: "Mercado e refeições", ticketMin: 20, ticketMax: 55, ticketStatus: "simulated", vrCards: ["Alelo", "VR", "Ticket"], serviceModes: ["Pratos prontos", "Retirada"] },
  { slug: "super-muffato-taruma", name: "Super Muffato Tarumã", address: "Av. Victor Ferreira do Amaral, 1088 — Tarumã", walkingMinutes: 13, cuisine: "Mercado e refeições", ticketMin: 20, ticketMax: 55, ticketStatus: "simulated", vrCards: ["Alelo", "VR"], serviceModes: ["Pratos prontos", "Retirada"] },
  { slug: "festval-jardim-social", name: "Festval Jardim Social", address: "R. Arquimedes Cruz, 85 — Jardim Social", walkingMinutes: 18, cuisine: "Mercado e refeições", ticketMin: 20, ticketMax: 55, ticketStatus: "simulated", vrCards: ["Ticket"], serviceModes: ["Pratos prontos"] },
  { slug: "familia-farinha", name: "Família Farinha", address: "Av. Nossa Sra. da Luz, 2315 — Jardim Social", walkingMinutes: 17, cuisine: "Panificadora", ticketMin: 15, ticketMax: 45, ticketStatus: "simulated", vrCards: ["Alelo"], serviceModes: ["Café", "Lanches"] },
  { slug: "caldo-de-cana-praca-das-nacoes", name: "Caldo de Cana Praça das Nações", address: "Praça das Nações, 805 — Alto da XV", walkingMinutes: 12, cuisine: "Lanches", ticketMin: 12, ticketMax: 32, ticketStatus: "simulated", vrCards: ["VR"], serviceModes: ["Lanches"] },
  { slug: "churrascaria-recanto-gaucho", name: "Churrascaria Recanto Gaúcho", address: "Av. Victor Ferreira do Amaral, 247 — Tarumã", walkingMinutes: 5, cuisine: "Churrascaria", ticketMin: 80, ticketMax: 100, vrCards: ["Alelo", "Sodexo"], serviceModes: ["Buffet"] },
  { slug: "saint-georges-panificadora", name: "Saint Georges Panificadora Artesanal", address: "Av. Victor Ferreira do Amaral, 518 — Tarumã", walkingMinutes: 5, cuisine: "Panificadora", ticketMin: 15, ticketMax: 45, ticketStatus: "simulated", vrCards: ["Ticket"], serviceModes: ["Café", "Lanches"] },
  { slug: "casa-di-pao-sem-gluten", name: "Casa di pão sem glúten - Curitiba", address: "Av. Sen. Souza Naves, 1785 — Cristo Rei", walkingMinutes: 15, cuisine: "Sem glúten", ticketMin: 20, ticketMax: 55, ticketStatus: "simulated", vrCards: ["Alelo"], serviceModes: ["Café", "Retirada"] },
];

const mapPositionForIndex = (index: number) => ({
  x: 12 + ((index * 17) % 76),
  y: 14 + ((index * 23) % 72),
});

const foodEstablishments: Establishment[] = foodSeeds.map((seed, index) => {
  const food: FoodProfile = {
    cuisine: seed.cuisine,
    ticketMin: seed.ticketMin,
    ticketMax: seed.ticketMax,
    ticketStatus: seed.ticketStatus ?? "reference",
    vrCards: seed.vrCards,
    vrStatus: "simulated",
    serviceModes: seed.serviceModes,
  };

  return {
    id: `food-${String(index + 1).padStart(2, "0")}`,
    slug: seed.slug,
    name: seed.name,
    category: "alimentacao",
    categoryLabel: "Alimentação",
    subcategory: seed.cuisine,
    description: `${seed.cuisine} para uma pausa próxima ao Aroeira. Informações operacionais são demonstrativas neste MVP.`,
    address: seed.address,
    walkingMinutes: seed.walkingMinutes,
    walkingTimeStatus: "simulated",
    mapPosition: mapPositionForIndex(index),
    sourceLabel: "Abas de alimentação da planilha (referência de leitura)",
    isSimulated: true,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${seed.name} Curitiba`)}`,
    menuUrl: index % 3 === 0 ? `https://www.google.com/search?q=${encodeURIComponent(`${seed.name} cardápio`)}` : undefined,
    food,
  };
});

type ServiceSeed = {
  slug: string;
  name: string;
  category: Exclude<Category, "alimentacao">;
  categoryLabel: string;
  subcategory: string;
  address: string;
  walkingMinutes: number;
};

const serviceSeeds: ServiceSeed[] = [
  { slug: "academia-smart-fit-taruma", name: "Academia Smart Fit - Tarumã", category: "academias", categoryLabel: "Academias", subcategory: "Academia", address: "Av. Victor Ferreira do Amaral — Tarumã", walkingMinutes: 9 },
  { slug: "sanitas-fitness-academia", name: "Sanita's Fitness Academia", category: "academias", categoryLabel: "Academias", subcategory: "Academia", address: "Tarumã — Curitiba", walkingMinutes: 12 },
  { slug: "nou-exclusive-gym", name: "NOU Exclusive Gym", category: "academias", categoryLabel: "Academias", subcategory: "Academia", address: "R. Arquimedes Cruz, 112 — Curitiba", walkingMinutes: 14 },
  { slug: "contos-do-ben", name: "Contos do Ben", category: "educacao", categoryLabel: "Educação", subcategory: "Livraria infantil", address: "R. Oyapock, 367 — Curitiba", walkingMinutes: 11 },
  { slug: "escola-infantil-joao-e-maria", name: "Escola Infantil João e Maria - Tarumã", category: "educacao", categoryLabel: "Educação", subcategory: "Educação infantil", address: "R. Antônio Camilo, 148 — Curitiba", walkingMinutes: 8 },
  { slug: "especifico-curso-preparatorio", name: "Específico Curso Preparatório", category: "educacao", categoryLabel: "Educação", subcategory: "Curso preparatório", address: "Av. Affonso Penna, 974 — Curitiba", walkingMinutes: 10 },
  { slug: "clean-up-lavanderias", name: "Clean Up Lavanderias", category: "servicos", categoryLabel: "Serviços", subcategory: "Lavanderia", address: "Tarumã — Curitiba", walkingMinutes: 6 },
  { slug: "correios-agf-nacoes", name: "Correios - AGF Nações", category: "servicos", categoryLabel: "Serviços", subcategory: "Correios", address: "R. Gilberto Mezzomo, 52 — Curitiba", walkingMinutes: 7 },
  { slug: "studio-da-barba", name: "Studio da Barba", category: "servicos", categoryLabel: "Serviços", subcategory: "Barbearia", address: "Curitiba — PR", walkingMinutes: 13 },
  { slug: "banco24horas", name: "Banco24Horas", category: "bancos", categoryLabel: "Bancos e lotéricas", subcategory: "Caixa eletrônico", address: "Av. Mal. Humberto de Alencar Castelo Branco, 230 — Curitiba", walkingMinutes: 7 },
  { slug: "loterias-trevo-do-taruma", name: "Loterias Trevo do Tarumã", category: "bancos", categoryLabel: "Bancos e lotéricas", subcategory: "Casa lotérica", address: "Av. Victor Ferreira do Amaral, 1088 — Curitiba", walkingMinutes: 12 },
  { slug: "rio-verde-supermercado", name: "Rio Verde — supermercado", category: "supermercados", categoryLabel: "Supermercados", subcategory: "Supermercado", address: "Av. Victor Ferreira do Amaral, 816 — Tarumã", walkingMinutes: 11 },
];

const serviceEstablishments: Establishment[] = serviceSeeds.map((seed, index) => ({
  id: `service-${String(index + 1).padStart(2, "0")}`,
  slug: seed.slug,
  name: seed.name,
  category: seed.category,
  categoryLabel: seed.categoryLabel,
  subcategory: seed.subcategory,
  description: `${seed.subcategory} incluído para demonstrar a infraestrutura disponível na região.`,
  address: seed.address,
  walkingMinutes: seed.walkingMinutes,
  walkingTimeStatus: "simulated",
  mapPosition: mapPositionForIndex(foodSeeds.length + index),
  sourceLabel: "ESTABELECIMENTOS - YURI (referência de leitura)",
  isSimulated: true,
  googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${seed.name} Curitiba`)}`,
}));

export const establishments: Establishment[] = [
  ...foodEstablishments,
  ...serviceEstablishments,
];
