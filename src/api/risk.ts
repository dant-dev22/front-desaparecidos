import type { RiskResponse, Sex } from "../types";

const PREFIX = (import.meta.env.VITE_API_PREFIX ?? "").replace(/\/$/, "");
const ABSOLUTE = (import.meta.env.VITE_API_BASE_URL ?? "https://urworldcup.com").replace(/\/$/, "");

function buildBaseUrl(): string {
  if (PREFIX) return PREFIX;
  return `${ABSOLUTE}/api`;
}

export interface GetRiskParams {
  estado: number;
  municipio_id: number;
  municipio_nombre?: string | null;
  edad: number;
  sexo: Sex;
  estatura?: number | null;
  colonia?: string | null;
}

export async function getRisk(
  params: GetRiskParams,
  signal?: AbortSignal,
): Promise<RiskResponse> {
  const qs = new URLSearchParams();
  qs.set("estado", String(params.estado));
  qs.set("municipio_id", String(params.municipio_id));
  if (params.municipio_nombre && params.municipio_nombre.trim()) {
    qs.set("municipio_nombre", params.municipio_nombre.trim());
  }
  qs.set("edad", String(params.edad));
  qs.set("sexo", params.sexo);
  if (params.estatura !== undefined && params.estatura !== null && !Number.isNaN(params.estatura)) {
    qs.set("estatura", String(params.estatura));
  }
  if (params.colonia && params.colonia.trim()) {
    qs.set("colonia", params.colonia.trim());
  }

  const url = `${buildBaseUrl()}/risk?${qs.toString()}`;
  const res = await fetch(url, {
    method: "GET",
    signal,
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    let detail: string | null = null;
    try {
      const body = (await res.json()) as { detail?: unknown };
      const d = body?.detail;
      if (typeof d === "string") detail = d;
      else if (Array.isArray(d) && d[0] && typeof (d[0] as { msg?: string }).msg === "string") {
        detail = (d[0] as { msg: string }).msg;
      }
    } catch {
      // ignore
    }
    throw new Error(detail ?? `Risk API error (${res.status})`);
  }

  return (await res.json()) as RiskResponse;
}
