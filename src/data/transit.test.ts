import { describe, expect, it } from "vitest";
import { pendingTransitLines, publishedTransitLines, transitData, transitStops } from "./transit";

describe("dados consolidados de transporte", () => {
  it("publica somente o conjunto editorial validado", () => {
    expect(transitStops).toHaveLength(69);
    expect(publishedTransitLines).toHaveLength(17);
    expect(pendingTransitLines.map((line) => line.code)).toEqual(["220", "B03", "C03", "D01", "D02", "D66", "D69"]);
    expect(transitData.lines.find((line) => line.code === "X90")?.publicationStatus).toBe("excluded");
  });

  it("mantém as faixas oficiais de distância", () => {
    expect(transitStops.filter((stop) => stop.distanceMeters <= 300)).toHaveLength(8);
    expect(transitStops.filter((stop) => stop.distanceMeters >= 301 && stop.distanceMeters <= 600)).toHaveLength(20);
    expect(transitStops.filter((stop) => stop.distanceMeters >= 601 && stop.distanceMeters <= 1000)).toHaveLength(41);
  });

  it("preserva as 29 combinações publicáveis de linha e sentido", () => {
    const pairs = new Set(publishedTransitLines.flatMap((line) => line.stops.flatMap((stop) => stop.directions.map((direction) => `${line.code}|${direction}`))));
    expect(pairs.size).toBe(29);
    expect(publishedTransitLines.every((line) => line.stops.length > 0)).toBe(true);
  });

  it("mantém rastreabilidade e links externos seguros", () => {
    for (const stop of transitStops) {
      expect(stop.sourceRecord.sheet).toBe("Pontos oficiais");
      expect(stop.mapUrl).toMatch(/^https:\/\/www\.google\.com\/maps\?q=/);
      expect(stop.sourceUrl).toMatch(/^https:\/\//);
      expect(stop.distanceMeters).toBeGreaterThanOrEqual(0);
      expect(stop.distanceMeters).toBeLessThanOrEqual(1000);
    }
    for (const line of transitData.lines) {
      expect(line.sourceRecord.sheet).toBe("Linhas");
      expect(line.scheduleUrl).toMatch(/^https:\/\//);
    }
  });
});
