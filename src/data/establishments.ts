import establishmentsJson from "./generated/establishments.json";
import type { Establishment } from "./types";

export const establishments = establishmentsJson as Establishment[];
