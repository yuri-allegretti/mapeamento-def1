import type { TransitStop } from "./types";

export const transitStops: TransitStop[] = [
  {
    id: "demo-stop-norte",
    name: "Ponto demonstrativo Aroeira Norte",
    reference: "Próximo à entrada norte — posição ilustrativa",
    walkingMinutes: 3,
    walkingTimeStatus: "simulated",
    mapPosition: { x: 38, y: 24 },
    isSimulated: true,
    lines: [
      { id: "demo-d01-n", number: "D01", name: "Linha demonstrativa Centro", direction: "Sentido Centro", origin: "Terminal Demonstração Norte", destination: "Centro demonstrativo", isSimulated: true },
      { id: "demo-d12-n", number: "D12", name: "Linha demonstrativa Circular", direction: "Sentido horário", origin: "Aroeira Norte", destination: "Bairro demonstrativo", isSimulated: true },
    ],
  },
  {
    id: "demo-stop-sul",
    name: "Ponto demonstrativo Aroeira Sul",
    reference: "Av. de referência — posição ilustrativa",
    walkingMinutes: 6,
    walkingTimeStatus: "simulated",
    mapPosition: { x: 58, y: 68 },
    isSimulated: true,
    lines: [
      { id: "demo-d01-s", number: "D01", name: "Linha demonstrativa Centro", direction: "Sentido bairro", origin: "Centro demonstrativo", destination: "Terminal Demonstração Norte", isSimulated: true },
      { id: "demo-d20-s", number: "D20", name: "Linha demonstrativa Interbairros", direction: "Sentido leste", origin: "Bairro Modelo", destination: "Terminal Ilustrativo", isSimulated: true },
    ],
  },
  {
    id: "demo-stop-leste",
    name: "Estação demonstrativa Linha Verde",
    reference: "Conexão futura a confirmar em fonte oficial",
    walkingMinutes: 9,
    walkingTimeStatus: "simulated",
    mapPosition: { x: 79, y: 43 },
    isSimulated: true,
    lines: [
      { id: "demo-d30", number: "D30", name: "Linha demonstrativa Expressa", direction: "Sentido centro", origin: "Terminal Ilustrativo", destination: "Centro demonstrativo", isSimulated: true },
    ],
  },
];
