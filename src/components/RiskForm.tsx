import { useEffect, useMemo, useState } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import { prettyCity, type LocationsMap, type RiskFormValues, type Sex } from "../types";
import {
  findCanonicalMunicipio,
  findCanonicalState,
  resolveCatalogIds,
} from "../utils/catalogResolve";
import { Spinner } from "./Spinner";

export interface RiskSubmitPayload {
  estado_id: number;
  municipio_id: number;
  municipioNombre: string;
  edad: number;
  sexo: Sex;
  estatura: number | null;
  colonia: string | null;
}

interface RiskFormProps {
  submitting: boolean;
  locations: LocationsMap | null;
  locationsReady: boolean;
  locationsError: string | null;
  onSubmit: (values: RiskSubmitPayload) => void;
  errorMessage: string | null;
}

export function RiskForm({
  submitting,
  locations,
  locationsReady,
  locationsError,
  onSubmit,
  errorMessage,
}: RiskFormProps) {
  const { status: geoStatus, location, error: geoError, retry } = useGeolocation();
  const [values, setValues] = useState<RiskFormValues>({
    estado: "",
    municipio: "",
    edad: "",
    sexo: "",
    estatura: "",
    colonia: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [autoFilledFromGeo, setAutoFilledFromGeo] = useState(false);

  const estadoOptions = useMemo(() => {
    if (!locations) return [];
    return Object.keys(locations).sort((a, b) => a.localeCompare(b, "es"));
  }, [locations]);

  const municipioOptions = useMemo(() => {
    if (!locations || !values.estado) return [];
    const munis = locations[values.estado]?.municipios ?? {};
    return Object.keys(munis).sort((a, b) => a.localeCompare(b, "es"));
  }, [locations, values.estado]);

  useEffect(() => {
    if (autoFilledFromGeo || !locations) return;
    if (!location?.state) return;
    const st = findCanonicalState(locations, location.state);
    if (!st) return;
    setValues((v) => {
      if (v.estado.trim() !== "" || v.municipio.trim() !== "") return v;
      const next = { ...v, estado: st };
      if (location.city) {
        const mu = findCanonicalMunicipio(locations, st, location.city);
        if (mu) next.municipio = mu;
      }
      return next;
    });
    setAutoFilledFromGeo(true);
  }, [autoFilledFromGeo, location, locations]);

  function handleChange<K extends keyof RiskFormValues>(key: K, value: RiskFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleEstadoPick(estadoKey: string) {
    setValues((v) => ({ ...v, estado: estadoKey, municipio: "" }));
  }

  function validate(): string | null {
    if (!locationsReady || !locations) {
      return "Location catalog is still loading.";
    }
    if (!values.estado) return "Please select your state.";
    if (!values.municipio) return "Please select your city / municipality.";
    const ids = resolveCatalogIds(locations, values.estado, values.municipio);
    if (!ids) return "That municipality is not available for this state.";
    const ageNum = Number(values.edad);
    if (!values.edad || Number.isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
      return "Age must be between 0 and 120.";
    }
    if (!values.sexo) return "Please select sex.";
    if (values.estatura) {
      const h = Number(values.estatura);
      if (Number.isNaN(h) || h < 0.5 || h > 2.5) return "Height must be between 0.5 m and 2.5 m.";
    }
    return null;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ estado: true, municipio: true, edad: true, sexo: true, estatura: true });
    const err = validate();
    if (err || !locations) return;

    const ids = resolveCatalogIds(locations, values.estado, values.municipio);
    if (!ids) return;

    onSubmit({
      estado_id: ids.estado_id,
      municipio_id: ids.municipio_id,
      municipioNombre: prettyCity(values.municipio),
      edad: Number(values.edad),
      sexo: values.sexo as Sex,
      estatura: values.estatura ? Number(values.estatura) : null,
      colonia: values.colonia.trim() ? values.colonia.trim() : null,
    });
  }

  const validationError = Object.values(touched).some(Boolean) ? validate() : null;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-card overflow-hidden"
      noValidate
    >
      <header className="bg-wc-hero text-white px-6 py-5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 field-stripes" aria-hidden="true" />
        <div className="relative">
          <p className="font-stadium uppercase tracking-widest text-xs text-wc-gold">
            Pre-match check-in
          </p>
          <h2 className="stadium-title text-2xl sm:text-3xl mt-1">
            Your fan profile
          </h2>
          <p className="text-sm text-white/80 mt-1">
          Enter your information. At the moment, the application is only available in Jalisco, Michoacán, and Colima. We will search for people matching your characteristics who have gone missing in your area
          </p>
        </div>
      </header>

      <div className="px-5 sm:px-7 py-6 space-y-5">
        {!locationsReady && (
          <div className="rounded-2xl border-2 border-wc-blue/20 bg-wc-blue/5 p-6 flex flex-col items-center gap-3">
            <Spinner size="lg" />
            <p className="text-sm text-center text-wc-ink/70">
              Pulling the state list the backend can legally scan inside the disappearance dump…
            </p>
          </div>
        )}

        {locationsReady && locationsError && (
          <div
            role="alert"
            className="rounded-xl bg-wc-red/10 border-2 border-wc-red/20 px-4 py-3 text-sm text-wc-red"
          >
            {locationsError}
          </div>
        )}

        {/* Auto location */}
        <div className="rounded-2xl border-2 border-wc-green/15 bg-wc-green/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-2xl" aria-hidden="true">📍</span>
              <div className="min-w-0">
                <p className="font-stadium uppercase tracking-wider text-xs text-wc-ink/60">
                  Detected location
                </p>
                {geoStatus === "loading" && (
                  <p className="text-sm text-wc-ink/70 flex items-center gap-2">
                    <Spinner size="sm" /> Pinging the GPS…
                  </p>
                )}
                {geoStatus === "ready" && (
                  <p className="text-sm text-wc-ink truncate">
                    {location?.city ? (
                      <>
                        <span className="chip bg-wc-green text-white mr-2">
                          {prettyCity(location.city)}
                        </span>
                        {location.raw && (
                          <span className="text-wc-ink/50 text-xs">{location.raw}</span>
                        )}
                      </>
                    ) : (
                      <span className="text-wc-ink/60">
                        Coordinates captured · city unknown
                      </span>
                    )}
                  </p>
                )}
                {(geoStatus === "denied" || geoStatus === "error") && (
                  <p className="text-sm text-wc-red">{geoError ?? "Location unavailable"}</p>
                )}
              </div>
            </div>
            {(geoStatus === "denied" || geoStatus === "error") && (
              <button
                type="button"
                onClick={retry}
                className="text-xs font-stadium uppercase tracking-wider text-wc-blue underline"
              >
                Retry
              </button>
            )}
          </div>
          {locationsReady && (
            <p className="text-[11px] text-wc-ink/50 mt-3 leading-relaxed">
              When GPS matches the catalog below, state and municipality are prefilled once. Adjust the
              menus if needed (for example Estado de México is listed as <span className="font-semibold">MEXICO</span>).
            </p>
          )}
        </div>

        {/* Picks come from `/locations` so IDs line up when the backend trawls the registry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label htmlFor="estado" className="form-label">
              State
            </label>
            <select
              id="estado"
              className="form-input"
              value={values.estado}
              onChange={(e) => handleEstadoPick(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, estado: true }))}
              disabled={!locationsReady || !!locationsError || !locations}
              required
            >
              <option value="">— Select state —</option>
              {estadoOptions.map((key) => (
                <option key={key} value={key}>
                  {prettyCity(key)}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="municipio" className="form-label">
              City / municipality
            </label>
            <select
              id="municipio"
              className="form-input"
              value={values.municipio}
              onChange={(e) => handleChange("municipio", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, municipio: true }))}
              disabled={!locationsReady || !!locationsError || !values.estado}
              required
            >
              <option value="">— Select municipality —</option>
              {municipioOptions.map((key) => (
                <option key={key} value={key}>
                  {prettyCity(key)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Age + Sex */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="edad" className="form-label">
              Age
            </label>
            <input
              id="edad"
              type="number"
              inputMode="numeric"
              min={0}
              max={120}
              className="form-input"
              placeholder="e.g. 27"
              value={values.edad}
              onChange={(e) => handleChange("edad", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, edad: true }))}
              required
              disabled={!locationsReady || !!locationsError}
            />
          </div>
          <div>
            <label htmlFor="sexo" className="form-label">
              Sex
            </label>
            <select
              id="sexo"
              className="form-input"
              value={values.sexo}
              onChange={(e) => handleChange("sexo", e.target.value as Sex)}
              onBlur={() => setTouched((t) => ({ ...t, sexo: true }))}
              required
              disabled={!locationsReady || !!locationsError}
            >
              <option value="">— Pick —</option>
              <option value="HOMBRE">Male</option>
              <option value="MUJER">Female</option>
            </select>
          </div>
        </div>

        {/* Height + Neighborhood */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="estatura" className="form-label">
              Height (m) <span className="text-wc-ink/40 normal-case">· optional</span>
            </label>
            <input
              id="estatura"
              type="number"
              inputMode="decimal"
              step="0.01"
              min={0.5}
              max={2.5}
              className="form-input"
              placeholder="1.75"
              value={values.estatura}
              onChange={(e) => handleChange("estatura", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, estatura: true }))}
              disabled={!locationsReady || !!locationsError}
            />
          </div>
          <div>
            <label htmlFor="colonia" className="form-label">
              Neighborhood <span className="text-wc-ink/40 normal-case">· optional</span>
            </label>
            <input
              id="colonia"
              type="text"
              className="form-input"
              placeholder="e.g. Historic center"
              value={values.colonia}
              onChange={(e) => handleChange("colonia", e.target.value)}
              disabled={!locationsReady || !!locationsError}
            />
          </div>
        </div>

        {(validationError || errorMessage) && (
          <div
            role="alert"
            className="rounded-xl bg-wc-red/10 border-2 border-wc-red/20 px-4 py-3 text-sm text-wc-red"
          >
            {validationError ?? errorMessage}
          </div>
        )}

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={submitting || !locationsReady || !!locationsError}
        >
          {submitting ? (
            <>
              <Spinner size="sm" />
              <span>Checking the lineup…</span>
            </>
          ) : (
            <>
              <span aria-hidden="true">🥅</span>
              Kick off the check
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-wc-ink/50 leading-relaxed">
          We stash nothing in this SPA — whatever you punched in gets blasted to the backend for one
          pass through that disappearance spreadsheet. Anything public in there is still theirs, not ours.
        </p>
      </div>
    </form>
  );
}
