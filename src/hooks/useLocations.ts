import { useEffect, useState } from "react";
import { getLocations } from "../api/locations";
import type { LocationsMap } from "../types";

interface UseLocationsResult {
  data: LocationsMap | null;
  loading: boolean;
  error: string | null;
}

let cache: LocationsMap | null = null;

export function useLocations(): UseLocationsResult {
  const [data, setData] = useState<LocationsMap | null>(cache);
  const [loading, setLoading] = useState<boolean>(!cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache) return;
    const controller = new AbortController();
    setLoading(true);
    getLocations(controller.signal)
      .then((map) => {
        cache = map;
        setData(map);
      })
      .catch((e) => {
        if (controller.signal.aborted) return;
        const msg = e instanceof Error ? e.message : "Could not load locations.";
        setError(
          /\(5\d\d\)/.test(msg)
            ? "There was an error loading the missing persons data, please try again."
            : msg,
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return { data, loading, error };
}
