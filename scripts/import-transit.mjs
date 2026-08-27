import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import readXlsxFile from "read-excel-file/node";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "Linhas de onibus AOP.xlsx");
const outputDir = path.join(root, "src", "data", "generated");
const outputPath = path.join(outputDir, "transit.json");
const reportPath = path.join(outputDir, "transit-import-report.json");
const checkOnly = process.argv.includes("--check");

const stopHeaders = [
  "ID URBS", "Nome/endereço oficial", "Bairro", "Latitude", "Longitude",
  "Distância ao AOP (m)", "Faixa", "Tipo de ponto", "Linhas urbanas",
  "Sentidos / destinos", "Acessibilidade", "Situação", "Confiança",
  "Origem no CSV", "Título original no CSV", "Google Place ID",
  "Link Google Maps (CSV)", "Link do ponto por coordenada", "Fonte oficial URBS",
  "Data-base URBS", "Data da validação", "Observações",
];

const lineHeaders = [
  "Sistema", "Código", "Nome oficial", "Categoria", "Cor / padrão",
  "Somente cartão", "Pontos oficiais no raio", "Sentidos / destinos observados",
  "Situação em 12/08/2026", "Publicar no site?", "Fonte",
  "Atualização da fonte", "Link de consulta", "Observações",
];

function text(value) {
  if (value instanceof Date) return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(value);
  return String(value ?? "").trim();
}

function optionalText(value) {
  const result = text(value);
  return result || undefined;
}

function number(value, field) {
  const result = Number(value);
  if (!Number.isFinite(result)) throw new Error(`Valor numérico inválido em ${field}: ${value}`);
  return result;
}

function assertHttpUrl(value, field) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`URL inválida em ${field}: ${value}`);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error(`URL insegura em ${field}: ${value}`);
  return value;
}

function rowsFromSheet(sheets, sheetName, headers) {
  const sheet = sheets.find((entry) => entry.sheet === sheetName);
  if (!sheet) throw new Error(`Aba obrigatória ausente: ${sheetName}`);
  const actualHeaders = headers.map((_, index) => text(sheet.data[0]?.[index]));
  if (JSON.stringify(actualHeaders) !== JSON.stringify(headers)) throw new Error(`Cabeçalho incompatível na aba ${sheetName}`);
  return sheet.data.slice(1).filter((row) => row.some((cell) => cell !== null && cell !== "")).map((row, rowIndex) => ({
    ...Object.fromEntries(headers.map((header, column) => [header, row[column]])),
    sourceRow: rowIndex + 2,
  }));
}

function splitList(value) {
  return text(value).split(";").map((item) => item.trim()).filter(Boolean);
}

function parseStopServices(linesValue, directionsValue, stopId) {
  const directionsByCode = new Map();
  for (const item of splitList(directionsValue)) {
    const separator = item.indexOf(":");
    if (separator < 1) throw new Error(`Sentido sem código no ponto ${stopId}: ${item}`);
    const code = item.slice(0, separator).trim();
    const direction = item.slice(separator + 1).trim();
    if (!directionsByCode.has(code)) directionsByCode.set(code, []);
    directionsByCode.get(code).push(direction);
  }

  return splitList(linesValue).map((item) => {
    const [rawCode] = item.split(" — ");
    const code = rawCode.trim();
    const directions = [...new Set(directionsByCode.get(code) ?? [])];
    if (!directions.length) throw new Error(`Linha ${code} sem sentido associado no ponto ${stopId}`);
    return { lineCode: code, directions };
  });
}

function publicationStatus(value) {
  if (value === "Sim") return "published";
  if (value === "Não") return "excluded";
  return "pending";
}

async function build() {
  if (!fs.existsSync(sourcePath)) throw new Error(`Arquivo não encontrado: ${sourcePath}`);
  const sheets = await readXlsxFile(sourcePath, { getSheets: true });
  const stopRows = rowsFromSheet(sheets, "Pontos oficiais", stopHeaders);
  const lineRows = rowsFromSheet(sheets, "Linhas", lineHeaders);

  const stops = stopRows.map((row) => {
    const id = text(row["ID URBS"]);
    const latitude = number(row.Latitude, `latitude do ponto ${id}`);
    const longitude = number(row.Longitude, `longitude do ponto ${id}`);
    const distanceMeters = number(row["Distância ao AOP (m)"], `distância do ponto ${id}`);
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) throw new Error(`Coordenadas inválidas no ponto ${id}`);
    if (distanceMeters < 0 || distanceMeters > 1000) throw new Error(`Ponto ${id} fora do raio de 1 km`);

    return {
      id,
      name: text(row["Nome/endereço oficial"]),
      neighborhood: optionalText(row.Bairro),
      latitude,
      longitude,
      distanceMeters,
      distanceBand: text(row.Faixa),
      stopType: text(row["Tipo de ponto"]),
      accessibility: text(row.Acessibilidade),
      situation: text(row.Situação),
      confidence: text(row.Confiança),
      mapUrl: assertHttpUrl(text(row["Link do ponto por coordenada"]), `mapa do ponto ${id}`),
      sourceUrl: assertHttpUrl(text(row["Fonte oficial URBS"]), `fonte do ponto ${id}`),
      sourceUpdatedAt: text(row["Data-base URBS"]),
      verifiedAt: text(row["Data da validação"]),
      observations: optionalText(row.Observações),
      services: parseStopServices(row["Linhas urbanas"], row["Sentidos / destinos"], id),
      sourceRecord: { sheet: "Pontos oficiais", row: row.sourceRow },
    };
  }).sort((a, b) => a.distanceMeters - b.distanceMeters || a.name.localeCompare(b.name, "pt-BR"));

  const stopIds = new Set(stops.map((stop) => stop.id));
  if (stopIds.size !== stops.length) throw new Error("Há IDs URBS duplicados na aba Pontos oficiais");

  const lineCodes = new Set(lineRows.map((row) => text(row.Código)));
  if (lineCodes.size !== lineRows.length) throw new Error("Há códigos duplicados na aba Linhas");
  for (const stop of stops) {
    for (const service of stop.services) {
      if (!lineCodes.has(service.lineCode)) throw new Error(`Linha ${service.lineCode} do ponto ${stop.id} não existe na aba Linhas`);
    }
  }

  const lines = lineRows.map((row) => {
    const code = text(row.Código);
    const systemLabel = text(row.Sistema);
    const lineStops = stops.flatMap((stop) => {
      const service = stop.services.find((entry) => entry.lineCode === code);
      return service ? [{ stopId: stop.id, directions: service.directions }] : [];
    });
    const rawStopCount = row["Pontos oficiais no raio"];
    const officialStopCount = rawStopCount === null || text(rawStopCount) === "" ? null : number(rawStopCount, `quantidade de pontos da linha ${code}`);
    if (officialStopCount !== null && officialStopCount !== lineStops.length) throw new Error(`Quantidade de pontos divergente para a linha ${code}`);

    return {
      system: systemLabel.startsWith("Urbano") ? "urban" : "metropolitan",
      systemLabel,
      code,
      name: text(row["Nome oficial"]),
      category: text(row.Categoria),
      colorPattern: optionalText(row["Cor / padrão"]),
      cardOnly: text(row["Somente cartão"]) === "Sim" ? true : text(row["Somente cartão"]) === "Não" ? false : null,
      officialStopCount,
      directions: splitList(row["Sentidos / destinos observados"]),
      operationalStatus: text(row["Situação em 12/08/2026"]),
      publicationStatus: publicationStatus(text(row["Publicar no site?"])),
      publicationDecision: text(row["Publicar no site?"]),
      sourceUrl: assertHttpUrl(text(row.Fonte), `fonte da linha ${code}`),
      sourceUpdatedAt: text(row["Atualização da fonte"]),
      scheduleUrl: assertHttpUrl(text(row["Link de consulta"]), `consulta da linha ${code}`),
      observations: optionalText(row.Observações),
      stops: lineStops,
      sourceRecord: { sheet: "Linhas", row: row.sourceRow },
    };
  });

  const publishedLines = lines.filter((line) => line.publicationStatus === "published");
  const pendingLines = lines.filter((line) => line.publicationStatus === "pending");
  const excludedLines = lines.filter((line) => line.publicationStatus === "excluded");
  const directionPairs = new Set(publishedLines.flatMap((line) => line.stops.flatMap((entry) => entry.directions.map((direction) => `${line.code}|${direction}`))));
  const validationDate = stops[0]?.verifiedAt;
  if (!validationDate || stops.some((stop) => stop.verifiedAt !== validationDate)) throw new Error("Datas de validação inconsistentes entre os pontos");
  if (stops.length !== 69) throw new Error(`Esperados 69 pontos oficiais; encontrados ${stops.length}`);
  if (publishedLines.length !== 17 || pendingLines.length !== 7 || excludedLines.length !== 1) throw new Error("Totais editoriais de linhas divergentes do levantamento aprovado");
  if (directionPairs.size !== 29) throw new Error(`Esperadas 29 combinações linha/sentido; encontradas ${directionPairs.size}`);
  if (publishedLines.some((line) => !line.stops.length)) throw new Error("Há linha publicada sem ponto oficial associado");
  if (lines.find((line) => line.code === "X90")?.publicationStatus !== "excluded") throw new Error("A linha X90 deve permanecer excluída");

  const data = {
    metadata: {
      referenceName: "Aroeira Office Park",
      referenceAddress: "Av. Victor Ferreira do Amaral, 306, Tarumã, Curitiba",
      radiusMeters: 1000,
      distanceMethod: "geodesic-straight-line",
      validationDate,
      urbanSourceUpdatedAt: publishedLines.find((line) => line.system === "urban")?.sourceUpdatedAt,
    },
    stops,
    lines,
  };

  const report = {
    sourceFile: path.relative(root, sourcePath).replaceAll("\\", "/"),
    sourceSha256: crypto.createHash("sha256").update(fs.readFileSync(sourcePath)).digest("hex"),
    generatedFrom: { stops: "Pontos oficiais", lines: "Linhas" },
    counts: {
      stops: stops.length,
      publishedLines: publishedLines.length,
      pendingLines: pendingLines.length,
      excludedLines: excludedLines.length,
      publishedLineStopRelations: publishedLines.reduce((total, line) => total + line.stops.length, 0),
      publishedLineDirectionPairs: directionPairs.size,
      distanceBands: Object.fromEntries([...new Set(stops.map((stop) => stop.distanceBand))].map((band) => [band, stops.filter((stop) => stop.distanceBand === band).length])),
    },
    qualityNotes: {
      accessibilityNotInformed: stops.filter((stop) => stop.accessibility === "Não informada na base consultada").length,
      stopsWithoutPhysicalMarking: stops.filter((stop) => stop.stopType === "Sem demarcação").length,
      stopsWithoutNeighborhood: stops.filter((stop) => !stop.neighborhood).length,
    },
    pendingLineCodes: pendingLines.map((line) => line.code),
    excludedLineCodes: excludedLines.map((line) => line.code),
  };

  const serializedData = `${JSON.stringify(data, null, 2)}\n`;
  const serializedReport = `${JSON.stringify(report, null, 2)}\n`;
  if (checkOnly) {
    if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, "utf8") !== serializedData) throw new Error("transit.json está fora de sincronia; execute npm run import:transit");
    if (!fs.existsSync(reportPath) || fs.readFileSync(reportPath, "utf8") !== serializedReport) throw new Error("transit-import-report.json está fora de sincronia; execute npm run import:transit");
    console.log(`Transporte verificado: ${stops.length} pontos, ${publishedLines.length} linhas publicadas e ${pendingLines.length} pendentes.`);
    return;
  }

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, serializedData);
  fs.writeFileSync(reportPath, serializedReport);
  console.log(`Gerados ${stops.length} pontos, ${publishedLines.length} linhas publicadas e ${pendingLines.length} pendentes.`);
}

build().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
