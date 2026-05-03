import type { LocationsMap } from "../types";

const PREFIX = (import.meta.env.VITE_API_PREFIX ?? "").replace(/\/$/, "");
const ABSOLUTE = (import.meta.env.VITE_API_BASE_URL ?? "https://urworldcup.com").replace(/\/$/, "");

function buildBaseUrl(): string {
  if (PREFIX) return PREFIX;
  return `${ABSOLUTE}/api`;
}

export async function getLocations(signal?: AbortSignal): Promise<LocationsMap> {
  const res = await fetch(`${buildBaseUrl()}/locations`, {
    method: "GET",
    signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Locations API error (${res.status})`);
  }
  return (await res.json()) as LocationsMap;
}
