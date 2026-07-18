export const guideRoutes = [
  "/guia",
  "/guia/onde-comer",
  "/guia/regiao",
  "/guia/parceiros",
  "/guia/transporte",
  "/guia/seja-parceiro",
] as const;

export const establishmentRoute = (slug: string) =>
  `/guia/estabelecimento/${encodeURIComponent(slug)}`;
