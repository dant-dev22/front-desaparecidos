import type { RiskResponse } from "../types";
import { prettyCity } from "../types";
import { ShareLocationButton } from "./ShareLocationButton";
import { DonationSection } from "./DonationSection";

interface ResultCardProps {
  result: RiskResponse;
  onViewSimilar: () => void;
  onReset: () => void;
}

const LEVEL_LABEL: Record<string, string> = {
  bajo: "Low risk",
  medio: "Medium risk",
  alto: "High risk",
};

const LEVEL_STYLES: Record<string, { chip: string; emoji: string }> = {
  bajo: {
    chip: "bg-wc-green text-white",
    emoji: "🟢",
  },
  medio: {
    chip: "bg-wc-gold text-wc-ink",
    emoji: "🟡",
  },
  alto: {
    chip: "bg-wc-red text-white",
    emoji: "🔴",
  },
};

export function ResultCard({ result, onViewSimilar, onReset }: ResultCardProps) {
  const styles = LEVEL_STYLES[result.nivel] ?? LEVEL_STYLES.medio;
  const label = LEVEL_LABEL[result.nivel] ?? result.nivel.toUpperCase();
  const cityLabel = prettyCity(result.municipio) || result.municipio;

  return (
    <article className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-card overflow-hidden animate-pop">
      <header className="bg-wc-hero text-white px-6 py-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 field-stripes" aria-hidden="true" />
        <div className="relative">
          <p className="font-stadium uppercase tracking-widest text-xs text-wc-gold">
            Final whistle · Your check-in
          </p>
          <div className="flex items-center justify-between mt-2 gap-3">
            <h2 className="stadium-title text-2xl sm:text-3xl">
              {label}
            </h2>
            <span className={`chip ${styles.chip}`}>
              <span aria-hidden="true">{styles.emoji}</span>
              {result.nivel.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-white/80 mt-1">
            Pulled blunt from that ledger:{" "}
            <strong>{result.total_casos_similares}</strong>{" "}
            {result.total_casos_similares === 1 ? "entry" : "entries"}
            snapped close to your profile near <strong>{cityLabel}</strong>.
          </p>
        </div>
      </header>

      <div className="px-5 sm:px-7 py-6 space-y-5">
        <dl className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-wc-cream p-4">
            <dt className="form-label">Similar cases</dt>
            <dd className="font-stadium text-2xl text-wc-blue">
              {result.total_casos_similares}
            </dd>
          </div>
          <div className="rounded-2xl bg-wc-cream p-4">
            <dt className="form-label">City</dt>
            <dd className="font-stadium text-base text-wc-ink truncate">
              {cityLabel}
            </dd>
          </div>
        </dl>

        <div className="grid gap-3">
          <button
            type="button"
            onClick={onViewSimilar}
            className="btn-secondary w-full"
            disabled={result.total_casos_similares === 0}
          >
            <span aria-hidden="true">📂</span>
            View similar cases
          </button>

          <ShareLocationButton cityLabel={cityLabel} />

          <DonationSection />

          <button
            type="button"
            onClick={onReset}
            className="text-sm font-stadium uppercase tracking-wider text-wc-ink/60 hover:text-wc-ink underline mt-1"
          >
            Run another check
          </button>
        </div>
      </div>
    </article>
  );
}
