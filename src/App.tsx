import { useEffect, useState } from "react";
import { getLocations } from "./api/locations";
import { getRisk } from "./api/risk";
import { RiskForm } from "./components/RiskForm";
import type { RiskSubmitPayload } from "./components/RiskForm";
import { SimilarCasesModal } from "./components/SimilarCasesModal";
import { ResultCard } from "./components/ResultCard";
import { WelcomeModal } from "./components/WelcomeModal";
import { Spinner } from "./components/Spinner";
import type { LocationsMap, RiskResponse } from "./types";

type View = "welcome" | "form" | "loading" | "result";

export default function App() {
  const [view, setView] = useState<View>("welcome");
  const [result, setResult] = useState<RiskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSimilar, setShowSimilar] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [locationsMap, setLocationsMap] = useState<LocationsMap | null>(null);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [locationsError, setLocationsError] = useState<string | null>(null);

  useEffect(() => {
    let stale = false;
    const ac = new AbortController();
    setLocationsLoading(true);

    void getLocations(ac.signal)
      .then((data) => {
        if (stale) return;
        setLocationsMap(data);
        setLocationsError(null);
      })
      .catch((e: unknown) => {
        if (stale) return;
        const name = e instanceof Error ? e.name : "";
        if (name === "AbortError") return;
        setLocationsError(e instanceof Error ? e.message : "Could not load locations.");
      })
      .finally(() => {
        if (!stale) setLocationsLoading(false);
      });

    return () => {
      stale = true;
      ac.abort();
    };
  }, []);

  const locationsReady = !locationsLoading && locationsError === null && locationsMap !== null;

  async function handleSubmit(values: RiskSubmitPayload) {
    setError(null);
    setView("loading");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => {},
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
      );
    }

    try {
      const data = await getRisk({
        estado: values.estado_id,
        municipio_id: values.municipio_id,
        municipio_nombre: values.municipioNombre,
        edad: values.edad,
        sexo: values.sexo,
        estatura: values.estatura,
      });
      setResult(data);
      setView("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setView("form");
    }
  }

  function reset() {
    setResult(null);
    setError(null);
    setView("form");
  }

  return (
    <main className="min-h-full">
      <WelcomeModal open={view === "welcome"} onAccept={() => setView("form")} />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-10">
        <BrandHeader />

        <section className="mt-6 sm:mt-10">
          {view === "form" && (
            <RiskForm
              submitting={false}
              locations={locationsMap}
              locationsReady={locationsReady}
              locationsError={locationsError}
              onSubmit={handleSubmit}
              errorMessage={error}
            />
          )}

          {view === "loading" && (
            <div className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-card p-10 flex flex-col items-center justify-center">
              <Spinner size="lg" label="Rifling the disappearance ledger…" />
              <p className="mt-4 text-center text-sm text-wc-ink/60 max-w-xs">
                Each hit scratches the upstream registry cold, so the API can choke for a beat. Chill —
                when it wakes up we’ll show whoever in that sheet looks uncomfortably close to you.
              </p>
            </div>
          )}

          {view === "result" && result && (
            <ResultCard
              result={result}
              onViewSimilar={() => setShowSimilar(true)}
              onReset={reset}
              coords={coords}
            />
          )}
        </section>

        <Footer />
      </div>

      {result && (
        <SimilarCasesModal
          open={showSimilar}
          cases={result.casos_similares}
          onClose={() => setShowSimilar(false)}
        />
      )}
    </main>
  );
}

function BrandHeader() {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-wc-hero shadow-trophy flex items-center justify-center text-xl">
          ⚽
        </div>
        <div className="leading-tight">
          <p className="stadium-title text-lg sm:text-xl text-wc-ink">Home Run 2026</p>
          <p className="text-[11px] uppercase tracking-widest text-wc-ink/50">
            World Cup safety companion
          </p>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-1">
        <span className="h-2 w-6 rounded-full bg-wc-green" aria-hidden="true" />
        <span className="h-2 w-6 rounded-full bg-white border border-wc-ink/20" aria-hidden="true" />
        <span className="h-2 w-6 rounded-full bg-wc-red" aria-hidden="true" />
        <span className="h-2 w-6 rounded-full bg-wc-blue" aria-hidden="true" />
        <span className="h-2 w-6 rounded-full bg-wc-gold" aria-hidden="true" />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-12 text-center text-[11px] uppercase tracking-widest text-wc-ink/40">
      Public disappearance data · Grim reality check · FIFA didn’t sanction this stunt
    </footer>
  );
}
