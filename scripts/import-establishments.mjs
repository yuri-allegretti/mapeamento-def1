import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import readXlsxFile from "read-excel-file/node";

const root = process.cwd();
for (const envFile of [".env.local", ".env"]) {
  const envPath = path.join(root, envFile);
  if (fs.existsSync(envPath)) process.loadEnvFile(envPath);
}
const sourcePath = path.join(root, "import", "estabelecimentos consolidado.xlsx");
const outputDir = path.join(root, "src", "data", "generated");
const outputPath = path.join(outputDir, "establishments.json");
const reportPath = path.join(outputDir, "import-report.json");
const overridesPath = path.join(root, "import", "geocoding-overrides.json");
const geocodingCachePath = path.join(root, "import", "geocoding-cache.json");
const checkOnly = process.argv.includes("--check");
const useGeocoding = process.argv.includes("--geocode");

const requiredSheets = [
  "Estabelecimentos - Yuri",
  "Estabelecimentos - Maia",
  "Estabelecimentos - Ian",
];
const expectedHeaders = [
  "NOME", "NOTA", "QTDE. REVIEWS", "ENDEREÇO", "city", "state",
  "countryCode", "SITE", "TEL.", "CATEGORIA 6", "URL", "TIPO",
  "CATEGORIA 1", "CATEGORIA 2", "CATEGORIA 3", "CATEGORIA 4",
  "CATEGORIA 5", "DISTÂNCIA", "TICKET MÉDIO", "FONTE",
  "DATA DA VERIFICAÇÃO",
];
const precedence = new Map(requiredSheets.map((sheet, index) => [sheet, index]));

const legacySlugs = new Map([
  ["restaurante quinoa 225", "restaurante-quinoa-225"],
  ["restaurante slow fire", "restaurante-slow-fire"],
  ["restaurante yifan", "restaurante-yifan"],
  ["dalle pizza taruma", "dalle-pizza-taruma"],
  ["habib s", "habibs-taruma"],
  ["restaurante peixinho pizzaria", "restaurante-peixinho-pizzaria"],
  ["limoeiro casa de comidas", "limoeiro-casa-de-comidas"],
  ["happy burger restaurante", "happy-burger-restaurante"],
  ["madero steak house jardim social", "madero-jardim-social"],
  ["restaurante peruano gastronomia e cultura", "restaurante-peruano"],
  ["paiol do joao carnes e assados", "paiol-do-joao"],
  ["costelao fontana churrascaria curitiba", "costelao-fontana"],
  ["barraca do claudio", "barraca-do-claudio"],
  ["mamae urso cafe", "mamae-urso-cafe"],
  ["leve sabor", "leve-sabor"],
  ["we love espetinho e sushi", "we-love-espetinho-sushi"],
  ["mcdonald s cristo rei", "mcdonalds-cristo-rei"],
  ["churras express assai", "churras-express-assai"],
  ["subway taruma", "subway-taruma"],
  ["yellow dog hot dog taruma", "yellow-dog-taruma"],
  ["los loccos curitiba", "los-loccos-curitiba"],
  ["folhetim bar", "folhetim-bar"],
  ["cintia cakes confeiteira confeitaria bolos e doces em curitiba", "cintia-cakes"],
  ["rio verde", "rio-verde"],
  ["super muffato taruma", "super-muffato-taruma"],
  ["festval jardim social", "festval-jardim-social"],
  ["familia farinha", "familia-farinha"],
  ["caldo de cana praca das nacoes", "caldo-de-cana-praca-das-nacoes"],
  ["churrascaria recanto gaucho", "churrascaria-recanto-gaucho"],
  ["saint georges panificadora artesanal", "saint-georges-panificadora"],
  ["casa di pao sem gluten curitiba", "casa-di-pao-sem-gluten"],
  ["academia smart fit taruma", "academia-smart-fit-taruma"],
  ["sanita s fitness academia", "sanitas-fitness-academia"],
  ["nou exclusive gym", "nou-exclusive-gym"],
  ["contos do ben", "contos-do-ben"],
  ["escola infantil joao e maria taruma", "escola-infantil-joao-e-maria"],
  ["especifico curso preparatorio", "especifico-curso-preparatorio"],
  ["clean up lavanderias", "clean-up-lavanderias"],
  ["correios agf nacoes", "correios-agf-nacoes"],
  ["studio da barba", "studio-da-barba"],
  ["banco24horas", "banco24horas"],
  ["loterias trevo do taruma", "loterias-trevo-do-taruma"],
]);

const legacyAliases = new Map([
  ["rio verde", ["rio-verde-supermercado"]],
]);

const labels = {
  alimentacao: "Alimentação",
  saude: "Saúde",
  farmacias: "Farmácias",
  supermercados: "Supermercados",
  academias_esportes: "Academias e esportes",
  bancos_correios_lotericas: "Bancos, Correios e lotéricas",
  educacao: "Educação",
  servicos: "Serviços",
  postos: "Postos de gasolina",
  hoteis: "Hotéis",
  shopping: "Shopping centers",
  parques: "Praças e parques",
  cultura: "Cultura",
};

function normalize(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slugify(value) {
  return normalize(value).replace(/\s+/g, "-") || "estabelecimento";
}

function isHttpUrl(value) {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

function scalar(rows, field) {
  return [...rows]
    .sort((a, b) => precedence.get(a.sheet) - precedence.get(b.sheet))
    .map((row) => row[field])
    .find((value) => value !== "" && value !== undefined && value !== null);
}

function number(value) {
  if (value === "" || value === undefined || value === null) return undefined;
  const parsed = Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function distance(value) {
  const match = String(value ?? "").match(/([\d.,]+)/);
  return match ? Math.round(Number(match[1].replace(",", "."))) : undefined;
}

function ticket(value) {
  const matches = String(value ?? "").match(/\d+(?:[.,]\d+)?/g);
  if (!matches?.length) return undefined;
  const values = matches.map((item) => Number(item.replace(",", ".")));
  return { min: values[0], max: values[1] ?? values[0], currency: "BRL" };
}

function placeId(url = "") {
  const match = String(url).match(/[?&]query_place_id=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

function categoryFor(row) {
  const broad = normalize(row["CATEGORIA 2"]);
  const type = normalize(row.TIPO);
  if (broad.startsWith("alimentacao")) return "alimentacao";
  if (broad === "saude hospitais") return "saude";
  if (broad === "saude farmacias") return "farmacias";
  if (broad === "supermercados") return "supermercados";
  if (broad === "postos de gasolina") return "postos";
  if (broad === "bancos correios e lotericas") return "bancos_correios_lotericas";
  if (broad === "hoteis") return "hoteis";
  if (broad === "shopping centers") return "shopping";
  if (broad === "lavanderias e pet shops") return "servicos";
  if (broad === "pracas e parques") return "parques";
  if (broad === "cultura") return "cultura";
  if (/supermerc/.test(type)) return "supermercados";
  if (/caixa|banco|correio|loter/.test(type)) return "bancos_correios_lotericas";
  if (/academ|artes marciais|quadra|futebol|clube|condicionamento/.test(type)) return "academias_esportes";
  if (/escola|educa|professor|universidade|curso|teste|creche|livraria infantil|cuidador/.test(type)) return "educacao";
  if (/arte|artesan|museu/.test(type)) return "cultura";
  return "servicos";
}

async function parseWorkbook() {
  if (!fs.existsSync(sourcePath)) throw new Error(`Arquivo não encontrado: ${sourcePath}`);
  const sheets = await readXlsxFile(sourcePath);
  for (const sheet of requiredSheets) {
    if (!sheets.some((entry) => entry.sheet === sheet)) throw new Error(`Aba obrigatória ausente: ${sheet}`);
  }
  const rows = [];
  for (const sheet of requiredSheets) {
    const matrix = sheets.find((entry) => entry.sheet === sheet).data;
    const cellText = (value) => value instanceof Date
      ? new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(value)
      : String(value ?? "").trim();
    const headers = expectedHeaders.map((_, column) => cellText(matrix[0]?.[column]));
    if (JSON.stringify(headers.slice(0, expectedHeaders.length)) !== JSON.stringify(expectedHeaders)) {
      throw new Error(`Cabeçalho incompatível na aba ${sheet}`);
    }
    for (let index = 1; index < matrix.length; index += 1) {
      const values = expectedHeaders.map((_, column) => cellText(matrix[index]?.[column]));
      if (!values.some(Boolean)) continue;
      const row = Object.fromEntries(expectedHeaders.map((header, column) => [header, values[column]]));
      for (const required of ["NOME", "ENDEREÇO", "URL", "FONTE", "DATA DA VERIFICAÇÃO"]) {
        if (!row[required]) throw new Error(`Campo ${required} vazio em ${sheet}, linha ${index + 1}`);
      }
      if (!isHttpUrl(row.URL)) throw new Error(`URL inválida em ${sheet}, linha ${index + 1}`);
      if (row.SITE && !isHttpUrl(row.SITE)) throw new Error(`SITE inválido em ${sheet}, linha ${index + 1}`);
      rows.push({ ...row, sheet, sourceRow: index + 1 });
    }
  }
  return rows;
}

async function geocodeMissing(establishments, geocodingCache) {
  if (!useGeocoding) return [];
  const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_GEOCODING_API_KEY é obrigatória com --geocode");
  const warnings = [];
  for (const establishment of establishments) {
    if (establishment.location.placeId || establishment.location.manualCoordinates) continue;
    const address = [establishment.address.line, establishment.address.city, establishment.address.state, establishment.address.countryCode].filter(Boolean).join(", ");
    const url = `https://geocode.googleapis.com/v4/geocode/address/${encodeURIComponent(address)}`;
    const response = await fetch(url, { headers: { "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": "results.placeId,results.granularity" } });
    if (!response.ok) throw new Error(`Geocoding falhou (${response.status}) para ${establishment.name}`);
    const body = await response.json();
    if (body.results?.length === 1 && body.results[0].placeId) {
      establishment.location.placeId = body.results[0].placeId;
      geocodingCache[establishment.slug] = { placeId: body.results[0].placeId };
    }
    else warnings.push({ code: "GEOCODING_UNRESOLVED", slug: establishment.slug, resultCount: body.results?.length ?? 0 });
  }
  return warnings;
}

async function build() {
  const rawRows = await parseWorkbook();
  const overrides = fs.existsSync(overridesPath) ? JSON.parse(fs.readFileSync(overridesPath, "utf8")) : {};
  const geocodingCache = fs.existsSync(geocodingCachePath) ? JSON.parse(fs.readFileSync(geocodingCachePath, "utf8")) : {};
  const groups = new Map();
  for (const row of rawRows) {
    const key = `${normalize(row.NOME)}|${normalize(row["ENDEREÇO"])}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }

  const establishments = [];
  const usedSlugs = new Set();
  for (const [identity, rows] of groups) {
    const name = scalar(rows, "NOME");
    const addressLine = scalar(rows, "ENDEREÇO");
    const normalizedName = normalize(name);
    const categories = [...new Set(rows.map(categoryFor))];
    const primaryCategoryId = categories.includes("supermercados") && rows.some((row) => row.sheet === "Estabelecimentos - Yuri")
      ? "supermercados"
      : categoryFor([...rows].sort((a, b) => precedence.get(a.sheet) - precedence.get(b.sheet))[0]);
    let slug = legacySlugs.get(normalizedName) ?? slugify(name);
    if (usedSlugs.has(slug)) slug = `${slug}-${crypto.createHash("sha1").update(normalize(addressLine)).digest("hex").slice(0, 6)}`;
    usedSlugs.add(slug);
    const categoryTags = [...new Set(rows.flatMap((row) => [row.TIPO, row["CATEGORIA 1"], row["CATEGORIA 2"], row["CATEGORIA 3"], row["CATEGORIA 4"], row["CATEGORIA 5"], row["CATEGORIA 6"]]).filter(Boolean))];
    const foodRows = rows.filter((row) => normalize(row["CATEGORIA 2"]).startsWith("alimentacao"));
    const sourceUrls = rows.map((row) => row.URL).filter(Boolean);
    const extractedPlaceId = rows.map((row) => placeId(row.URL)).find(Boolean);
    const override = overrides[slug];
    const rating = number(scalar(rows, "NOTA"));
    const reviewCount = number(scalar(rows, "QTDE. REVIEWS"));
    const parsedTicket = ticket(foodRows.map((row) => row["TICKET MÉDIO"]).find(Boolean));
    const distanceMeters = distance(rows.map((row) => row["DISTÂNCIA"]).find(Boolean));
    const phone = scalar(rows, "TEL.");
    if (rating !== undefined && (rating < 0 || rating > 5)) throw new Error(`Nota fora da faixa para ${slug}`);
    if (override && (!Number.isFinite(override.latitude) || override.latitude < -90 || override.latitude > 90 || !Number.isFinite(override.longitude) || override.longitude < -180 || override.longitude > 180 || !override.source)) {
      throw new Error(`Coordenadas manuais inválidas para ${slug}`);
    }
    establishments.push({
      id: `est_${crypto.createHash("sha256").update(identity).digest("hex").slice(0, 16)}`,
      slug,
      legacySlugs: legacyAliases.get(normalizedName) ?? [],
      name,
      type: scalar(rows, "TIPO"),
      primaryCategoryId,
      primaryCategoryLabel: labels[primaryCategoryId],
      categoryIds: categories,
      categoryTags,
      address: {
        line: addressLine,
        city: scalar(rows, "city"),
        state: scalar(rows, "state"),
        countryCode: scalar(rows, "countryCode"),
      },
      phone: phone || undefined,
      phoneUrl: phone ? `tel:${phone.replace(/[^+\d]/g, "")}` : undefined,
      websiteUrl: scalar(rows, "SITE") || undefined,
      googleMapsUrl: sourceUrls[0],
      rating: rating === undefined ? undefined : { value: rating, reviewCount, verifiedAt: scalar(rows, "DATA DA VERIFICAÇÃO"), provider: "Google Maps" },
      distanceMeters,
      food: foodRows.length ? {
        group: foodRows.map((row) => row["CATEGORIA 2"]).find(Boolean),
        ticket: parsedTicket,
      } : undefined,
      verifiedAt: scalar(rows, "DATA DA VERIFICAÇÃO"),
      sources: [...new Set(rows.map((row) => row.FONTE).filter(Boolean))],
      location: {
        placeId: extractedPlaceId ?? geocodingCache[slug]?.placeId,
        manualCoordinates: override ? { latitude: override.latitude, longitude: override.longitude, source: override.source } : undefined,
      },
      sourceRecords: rows.map((row) => ({ sheet: row.sheet, row: row.sourceRow })),
    });
  }

  const validSlugs = new Set(establishments.map((item) => item.slug));
  const unknownOverride = Object.keys(overrides).find((slug) => !validSlugs.has(slug));
  if (unknownOverride) throw new Error(`Override sem estabelecimento correspondente: ${unknownOverride}`);
  establishments.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  const geocodingWarnings = await geocodeMissing(establishments, geocodingCache);
  const report = {
    sourceSha256: crypto.createHash("sha256").update(fs.readFileSync(sourcePath)).digest("hex"),
    sourceFile: path.relative(root, sourcePath).replaceAll("\\", "/"),
    sheets: Object.fromEntries(requiredSheets.map((sheet) => [sheet, rawRows.filter((row) => row.sheet === sheet).length])),
    rawRecords: rawRows.length,
    canonicalRecords: establishments.length,
    mergedRecords: rawRows.length - establishments.length,
    foodRawRecords: rawRows.filter((row) => normalize(row["CATEGORIA 2"]).startsWith("alimentacao")).length,
    foodCanonicalRecords: establishments.filter((item) => item.food).length,
    foodWithTicket: establishments.filter((item) => item.food?.ticket).length,
    recordsWithPlaceId: establishments.filter((item) => item.location.placeId).length,
    recordsWithManualCoordinates: establishments.filter((item) => item.location.manualCoordinates).length,
    warnings: [
      ...establishments.filter((item) => !item.location.placeId && !item.location.manualCoordinates).map((item) => ({ code: "LOCATION_PENDING", slug: item.slug })),
      ...Object.keys(geocodingCache).filter((slug) => !validSlugs.has(slug)).map((slug) => ({ code: "GEOCODING_CACHE_UNUSED", slug })),
      ...geocodingWarnings,
    ],
    merges: establishments.filter((item) => item.sourceRecords.length > 1).map((item) => ({ slug: item.slug, sourceRecords: item.sourceRecords })),
  };

  if (!establishments.length) throw new Error("A importação não produziu estabelecimentos");

  const serializedData = `${JSON.stringify(establishments, null, 2)}\n`;
  const serializedReport = `${JSON.stringify(report, null, 2)}\n`;
  if (checkOnly) {
    if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, "utf8") !== serializedData) throw new Error("establishments.json está fora de sincronia; execute npm run import:data");
    if (!fs.existsSync(reportPath) || fs.readFileSync(reportPath, "utf8") !== serializedReport) throw new Error("import-report.json está fora de sincronia; execute npm run import:data");
    console.log(`Importação verificada: ${establishments.length} estabelecimentos, ${report.foodCanonicalRecords} em Onde comer.`);
    return;
  }
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, serializedData);
  fs.writeFileSync(reportPath, serializedReport);
  if (useGeocoding) fs.writeFileSync(geocodingCachePath, `${JSON.stringify(geocodingCache, null, 2)}\n`);
  console.log(`Gerados ${establishments.length} estabelecimentos (${report.foodCanonicalRecords} em Onde comer).`);
}

build().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
