import type { LocationsMap } from "../types";
import { normalizeKey } from "../types";

export function findCanonicalState(locations: LocationsMap, raw: string): string | null {
  if (!raw.trim()) return null;
  const needle = normalizeKey(raw);
  for (const name of Object.keys(locations)) {
    if (normalizeKey(name) === needle) return name;
  }
  return null;
}

export function findCanonicalMunicipio(
  locations: LocationsMap,
  estadoKey: string,
  raw: string,
): string | null {
  if (!raw.trim()) return null;
  const block = locations[estadoKey];
  if (!block) return null;
  const needle = normalizeKey(raw);
  for (const munName of Object.keys(block.municipios)) {
    if (normalizeKey(munName) === needle) return munName;
  }
  return null;
}

export function resolveCatalogIds(
  locations: LocationsMap,
  estadoKey: string,
  municipioKey: string,
): { estado_id: number; municipio_id: number } | null {
  const data = locations[estadoKey];
  if (!data) return null;
  const mid = data.municipios[municipioKey];
  if (mid === undefined) return null;
  return { estado_id: data.estado_id, municipio_id: mid };
}
