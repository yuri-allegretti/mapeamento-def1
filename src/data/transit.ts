import transitJson from "./generated/transit.json";
import type { TransitDataset } from "./types";

export const transitData = transitJson as TransitDataset;

export const publishedTransitLines = transitData.lines.filter((line) => line.publicationStatus === "published");
export const pendingTransitLines = transitData.lines.filter((line) => line.publicationStatus === "pending");
export const transitStops = transitData.stops;
