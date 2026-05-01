export type Sex = "HOMBRE" | "MUJER";

export interface StateData {
  estado_id: number;
  municipios: Record<string, number>;
}

export type LocationsMap = Record<string, StateData>;

export interface RiskFormValues {
  /** Canonical state key from `GET /locations` (e.g. JALISCO). */
  estado: string;
  /** Municipality key inside the selected state (e.g. GUADALAJARA). */
  municipio: string;
  edad: string;
  sexo: Sex | "";
  estatura: string;
  colonia: string;
}

export interface SimilarCase {
  id_cedula_busqueda: number | string | null;
  ruta_foto: string | null;
  nombre_completo: string | null;
  edad_momento_desaparicion: number | null;
}

export interface RiskResponse {
  score: number;
  nivel: "bajo" | "medio" | "alto" | string;
  casos_similares: SimilarCase[];
  total_casos_similares: number;
  municipio: string;
  colonia: string | null;
}

export interface DetectedLocation {
  lat: number;
  lon: number;
  city: string | null;
  state: string | null;
  raw: string | null;
}

export function prettyCity(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function normalizeKey(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .trim()
    .replace(/\s+/g, " ");
}
