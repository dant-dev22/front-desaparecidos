import { useEffect, useRef, useState } from "react";
import { reverseGeocode } from "../api/geocoding";
import type { DetectedLocation } from "../types";

type Status = "idle" | "loading" | "ready" | "denied" | "error";

interface UseGeolocationResult {
  status: Status;
  location: DetectedLocation | null;
  error: string | null;
  retry: () => void;
}

export function useGeolocation(): UseGeolocationResult {
  const [status, setStatus] = useState<Status>("idle");
  const [location, setLocation] = useState<DetectedLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("error");
      setError("Geolocation is not supported on this device.");
      return;
    }

    setStatus("loading");
    setError(null);

    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const geo = await reverseGeocode(latitude, longitude, controller.signal);
          setLocation({
            lat: latitude,
            lon: longitude,
            city: geo.city,
            state: geo.state,
            raw: geo.raw,
          });
          setStatus("ready");
        } catch (err) {
          setLocation({
            lat: latitude,
            lon: longitude,
            city: null,
            state: null,
            raw: null,
          });
          setStatus("ready");
          setError(err instanceof Error ? err.message : "Could not resolve city.");
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus("denied");
          setError("Location permission denied. Pick state and city manually.");
        } else {
          setStatus("error");
          setError(err.message || "Could not get your location.");
        }
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 60_000 },
    );

    return () => controller.abort();
  }, [tick]);

  return {
    status,
    location,
    error,
    retry: () => setTick((t) => t + 1),
  };
}
