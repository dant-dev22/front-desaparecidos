import { useState } from "react";
import type { SimilarCase } from "../types";

interface SimilarCasesModalProps {
  open: boolean;
  cases: SimilarCase[];
  onClose: () => void;
}

function CaseCard({ c }: { c: SimilarCase }) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = (c.nombre_completo ?? "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");

  const photoUrl = c.ruta_foto?.trim();
  const showPhoto = Boolean(photoUrl) && !imageFailed;

  return (
    <li className="rounded-2xl bg-white shadow-card overflow-hidden border border-wc-ink/5">
      <div className="aspect-[4/5] bg-wc-cream relative overflow-hidden">
        {showPhoto && photoUrl ? (
          <img
            src={photoUrl}
            alt={c.nombre_completo ?? "Missing-person registry photo"}
            className="absolute inset-0 z-[1] h-full w-full object-cover bg-wc-cream"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 z-0 flex items-center justify-center text-4xl font-stadium text-wc-ink/30 bg-gradient-to-br from-wc-cream to-white">
            {initials || "?"}
          </div>
        )}
        <div className="pointer-events-none absolute top-2 left-2 z-[2] chip bg-wc-blue text-white">
          MISSING
        </div>
      </div>
      <div className="p-3">
        <p className="font-stadium uppercase tracking-wide text-sm text-wc-ink truncate">
          {c.nombre_completo ?? "Name withheld"}
        </p>
        <p className="text-xs text-wc-ink/60 mt-0.5">
          {c.edad_momento_desaparicion != null
            ? `Age at disappearance: ${c.edad_momento_desaparicion}`
            : "Age unknown"}
        </p>
        {c.id_cedula_busqueda != null && (
          <p className="text-[10px] uppercase tracking-wider text-wc-ink/40 mt-1">
            File #{c.id_cedula_busqueda}
          </p>
        )}
      </div>
    </li>
  );
}

export function SimilarCasesModal({ open, cases, onClose }: SimilarCasesModalProps) {
  if (!open) return null;
  const top3 = cases.slice(0, 3);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-wc-ink/70 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="similar-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl bg-wc-cream rounded-t-3xl sm:rounded-3xl shadow-trophy overflow-hidden animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="bg-wc-hero text-white px-5 py-4 flex items-center justify-between">
          <div>
            <p className="font-stadium uppercase tracking-widest text-[11px] text-wc-gold">
              Top 3 · Public records
            </p>
            <h3 id="similar-title" className="stadium-title text-xl sm:text-2xl">
              Similar cases nearby
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/15 hover:bg-white/25 transition w-9 h-9 flex items-center justify-center text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <div className="px-4 sm:px-6 py-5">
          {top3.length === 0 ? (
            <p className="text-center text-wc-ink/60 py-8">
              No similar cases were returned for your filters.
            </p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {top3.map((c, i) => (
                <CaseCard key={`${c.id_cedula_busqueda ?? "x"}-${i}`} c={c} />
              ))}
            </ul>
          )}

          <p className="mt-5 text-[11px] text-wc-ink/50 leading-relaxed text-center">
            Same skeletal government disappearance file the backend is chewing through — it hurts to
            look at because that row count is literally what stacks up near you partying through World
            Cup week. Numbers aren’t softened for manners.
          </p>
        </div>
      </div>
    </div>
  );
}
