import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
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
    return new Intl.DateTimeFormat("es-MX", {
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
    return `${new Intl.NumberFormat("es-MX", { maximumFractionDigits: 0 }).format(n)} cm`;
  }
  return `${new Intl.NumberFormat("es-MX", { maximumFractionDigits: 2 }).format(n)} m`;
}

function Detail({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-[10px] uppercase tracking-wider text-wc-ink/45">{label}</dt>
      <dd className="text-xs text-wc-ink mt-0.5 leading-snug break-words">{value}</dd>
    </div>
  );
}

function SimilarCasePhotoLightbox({
  open,
  photoUrl,
  alt,
  labelledById,
  onClose,
}: {
  open: boolean;
  photoUrl: string;
  alt: string;
  labelledById: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-wc-ink/85 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledById}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <figure
        className="relative max-h-[90vh] max-w-[min(94vw,900px)]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photoUrl}
          alt={alt}
          className="max-h-[85vh] w-auto max-w-full rounded-lg object-contain shadow-trophy bg-wc-ink"
        />
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-2 -right-2 rounded-full bg-white text-wc-ink w-9 h-9 flex items-center justify-center shadow-card hover:bg-wc-cream text-lg leading-none"
          aria-label="Cerrar imagen ampliada"
        >
          ✕
        </button>
      </figure>
    </div>,
    document.body,
  );
}

export function SimilarCaseCard({ c }: { c: SimilarCase }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const lightboxTitleId = useId();
  const initials = initialsFromName(c.nombre_completo ?? null);
  const photoUrl = c.ruta_foto?.trim();
  const showPhoto = Boolean(photoUrl) && !imageFailed;
  const dateLabel = formatDisappearanceDate(c.fecha_desaparicion ?? null);
  const heightLabel = formatHeight(c.estatura ?? null);

  return (
    <li className="rounded-2xl bg-white shadow-card overflow-hidden border border-wc-ink/5 flex flex-col">
      <SimilarCasePhotoLightbox
        open={lightboxOpen && Boolean(photoUrl)}
        photoUrl={photoUrl ?? ""}
        alt={
          c.nombre_completo
            ? `Foto registral · ${c.nombre_completo}`
            : "Foto del registro de persona desaparecida"
        }
        labelledById={lightboxTitleId}
        onClose={() => setLightboxOpen(false)}
      />
      <span id={lightboxTitleId} className="sr-only">
        Imagen ampliada{": "}
        {c.nombre_completo ?? "registro público"}
      </span>

      <div className="aspect-[4/5] bg-wc-cream relative overflow-hidden shrink-0">
        {showPhoto && photoUrl ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(true);
            }}
            className="group absolute inset-0 z-[1] block cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wc-gold focus-visible:ring-inset text-left"
            aria-label="Ver foto en tamaño completo"
          >
            <img
              src={photoUrl}
              alt={c.nombre_completo ?? "Missing-person registry photo"}
              className="absolute inset-0 h-full w-full object-cover bg-wc-cream transition group-hover:opacity-95"
              loading="lazy"
              referrerPolicy="no-referrer"
              draggable={false}
              onError={() => setImageFailed(true)}
            />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-wc-ink/70 via-wc-ink/20 to-transparent py-10 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="block text-center font-stadium uppercase tracking-wide text-[10px] text-white drop-shadow-sm">
                Toca para ampliar
              </span>
            </span>
          </button>
        ) : (
          <div className="absolute inset-0 z-0 flex items-center justify-center text-4xl font-stadium text-wc-ink/30 bg-gradient-to-br from-wc-cream to-white">
            {initials || "?"}
          </div>
        )}
        <div className="pointer-events-none absolute top-2 left-2 z-[2] chip bg-wc-blue text-white">
          MISSING
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1 min-h-0">
        <p className="font-stadium uppercase tracking-wide text-sm text-wc-ink line-clamp-2">
          {c.nombre_completo ?? "Sin nombre en el registro"}
        </p>

        <dl className="mt-2 space-y-2 flex-1">
          {c.id_cedula_busqueda != null && (
            <Detail label="Expediente" value={String(c.id_cedula_busqueda)} />
          )}
          <Detail
            label="Edad al desaparecer"
            value={
              c.edad_momento_desaparicion != null
                ? `${c.edad_momento_desaparicion} años`
                : "No registrada"
            }
          />
          {heightLabel && <Detail label="Estatura" value={heightLabel} />}
          <Detail
            label="Tez"
            value={c.tez?.trim() ? c.tez.trim() : "No registrada"}
          />
          <Detail
            label="Color de ojos"
            value={c.ojos_color?.trim() ? c.ojos_color.trim() : "No registrado"}
          />
          <Detail
            label="Fecha de desaparición"
            value={dateLabel ?? "No registrada"}
          />
        </dl>
      </div>
    </li>
  );
}
