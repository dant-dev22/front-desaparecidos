interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  region?: string;
  suburb?: string;
  neighbourhood?: string;
}

interface NominatimResponse {
  display_name?: string;
  address?: NominatimAddress;
}

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";

export interface ReverseGeocodeResult {
  city: string | null;
  state: string | null;
  raw: string | null;
}

export async function reverseGeocode(
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<ReverseGeocodeResult> {
  const url = `${NOMINATIM_URL}?lat=${lat}&lon=${lon}&format=json&zoom=12&addressdetails=1&accept-language=es,en`;
  const res = await fetch(url, {
    method: "GET",
    signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Reverse geocoding failed (${res.status})`);
  }
  const data = (await res.json()) as NominatimResponse;
  const addr = data.address ?? {};

  const city =
    addr.city ??
    addr.town ??
    addr.village ??
    addr.municipality ??
    addr.county ??
    null;

  const state = addr.state ?? addr.region ?? null;

  return {
    city,
    state,
    raw: data.display_name ?? null,
  };
}
