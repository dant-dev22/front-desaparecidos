import { useState } from "react";
import type { SimilarCase } from "../types";

function initialsFromName(name: string | null): string {
  return (name ?? "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDisappearanceDate(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const s = typeof raw === "string" ? raw.trim() : String(raw).trim();
  if (!s) return null;

  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeZone: "UTC",
    }).format(d);
  }
  return s;
}

/** Registry may send metres (~1–2.4) or centimetres (≥ ~25); choose a sane label either way. */
function formatHeight(estatura: number | null | undefined): string | null {
  if (estatura === null || estatura === undefined || Number.isNaN(estatura)) return null;

  const n = Number(estatura);
  if (n >= 25) {
    return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n)} cm`;
  }
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n)} m`;
}

/** List row with a larger photo thumbnail so registry images read clearly on phones. */
export function SimilarCaseCard({ c }: { c: SimilarCase }) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = initialsFromName(c.nombre_completo ?? null);
  const photoUrl = c.ruta_foto?.trim();
  const showPhoto = Boolean(photoUrl) && !imageFailed;
  const dateLabel = formatDisappearanceDate(c.fecha_desaparicion ?? null);
  const heightLabel = formatHeight(c.estatura ?? null);
  const ageN = Number(c.edad_momento_desaparicion);
  const ageYears =
    c.edad_momento_desaparicion != null && !Number.isNaN(ageN)
      ? `${ageN} ${ageN === 1 ? "year" : "years"}`
      : null;

  return (
    <li className="flex gap-3 sm:gap-4 rounded-xl border border-wc-ink/8 bg-wc-cream/35 p-3 sm:p-3.5">
      <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-wc-cream ring-1 ring-wc-ink/5">
        {showPhoto && photoUrl ? (
          <img
            src={photoUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
            draggable={false}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-stadium text-2xl text-wc-ink/35">
            {initials || "?"}
          </div>
        )}
        <span className="pointer-events-none absolute bottom-0 left-0 right-0 bg-wc-blue/90 px-1 py-0.5 text-center font-stadium text-[9px] sm:text-[10px] uppercase tracking-wide text-white">
          Missing
        </span>
      </div>

      <div className="min-w-0 flex-1 py-0.5">
        <p className="font-stadium text-[13px] sm:text-sm leading-snug text-wc-ink line-clamp-2">
          {c.nombre_completo ?? "Name not listed"}
        </p>
        {(ageYears || dateLabel || heightLabel) && (
          <dl className="mt-1 space-y-0.5 text-[11px] leading-snug text-wc-ink/60">
            {ageYears && (
              <div className="flex flex-wrap gap-x-1">
                <dt className="text-wc-ink/45 shrink-0">Age at disappearance:</dt>
                <dd className="min-w-0">{ageYears}</dd>
              </div>
            )}
            {dateLabel && (
              <div className="flex flex-wrap gap-x-1">
                <dt className="text-wc-ink/45 shrink-0">Date of disappearance:</dt>
                <dd className="min-w-0">{dateLabel}</dd>
              </div>
            )}
            {heightLabel && (
              <div className="flex flex-wrap gap-x-1">
                <dt className="text-wc-ink/45 shrink-0">Height:</dt>
                <dd className="min-w-0">{heightLabel}</dd>
              </div>
            )}
          </dl>
        )}
        {c.id_cedula_busqueda != null && (
          <p className="mt-0.5 text-[10px] tabular-nums text-wc-ink/45">
            File #{String(c.id_cedula_busqueda)}
          </p>
        )}
      </div>
    </li>
  );
}
