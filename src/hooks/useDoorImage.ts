import { useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import { RootState } from "../app/store";
import { debounce } from "../utils";

// The default configuration always renders the SAME door, so we cache the first door of each session as
// a data URL and show it INSTANTLY on the next page load (no spinner), then swap in the freshly-fetched
// one. `localStorage` persists across refreshes; a data URL survives (a blob: URL would not).
const DEFAULT_DOOR_KEY = "defaultDoorImg";

const blobUrlToDataUrl = async (blobUrl: string): Promise<string> => {
  const blob = await (await fetch(blobUrl)).blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

interface UseDoorImageReturn {
  /** The door image that is fully loaded and safe to display. */
  doorImage: string | null;
  /** No door has ever been shown yet → show a spinner. */
  isInitialLoad: boolean;
  /** A newer door is being fetched/preloaded → blur the current one. */
  isUpdating: boolean;
  isError: boolean;
}

const postFetcher = async (url: string, data: unknown): Promise<string> => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

const useDoorImage = (): UseDoorImageReturn => {
  const selectedConfiguration = useSelector(
    (state: RootState) => state.configuration
  );

  // last URL returned by the API (may not be decoded/preloaded yet)
  const [fetchedUrl, setFetchedUrl] = useState<string | null>(null);
  // the URL that has finished preloading and is safe to render — seeded from the cached default door so
  // something shows on the very first paint instead of a blank spinner.
  const [readySrc, setReadySrc] = useState<string | null>(() => {
    try {
      return localStorage.getItem(DEFAULT_DOOR_KEY);
    } catch {
      return null;
    }
  });
  // cache only the FIRST door of the session (= the default) as the next-load placeholder.
  const cachedDefault = useRef(false);
  // false until the first FRESH (API) door has loaded — used to suppress the "updating" spinner on the
  // initial re-fetch when a cached default is already on screen (only real user changes should spin).
  const [freshLoaded, setFreshLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  // true from the moment the config changes until the new door is ready
  const [pending, setPending] = useState(false);

  const fetchImage = async (config: unknown) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "default-api-url";
      const url = await postFetcher(`${apiUrl}/api/door/image`, config);
      setFetchedUrl(url);
      setIsError(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setIsError(true);
    }
  };

  const debouncedFetch = useMemo(() => debounce(fetchImage, 500), []);

  // Blur immediately when the config changes (before the debounce fires), and
  // trigger the (debounced) fetch. Wait for the config to be SEEDED (model-id set by
  // fetchDefaultItems) — otherwise the initial empty config renders a bare door that then
  // gets replaced once defaults arrive (the "base first, then glass/equipment" flash).
  useEffect(() => {
    if (selectedConfiguration && selectedConfiguration["model-id"]) {
      setPending(true);
      debouncedFetch(selectedConfiguration);
    }
  }, [selectedConfiguration, debouncedFetch]);

  // The new door has finished loading → stop blurring.
  useEffect(() => {
    setPending(false);
  }, [readySrc]);

  // Preload the fetched image off-screen; only promote it to `readySrc` once
  // fully decoded, so the previous door stays on screen until the new one is
  // ready (no spinner flash / no wrong-shape placeholder on updates).
  useEffect(() => {
    if (!fetchedUrl) return;
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      setReadySrc(fetchedUrl);
      setFreshLoaded(true);
      // persist the first door of the session (the default) for an instant next load
      if (!cachedDefault.current) {
        cachedDefault.current = true;
        blobUrlToDataUrl(fetchedUrl)
          .then((dataUrl) => {
            try {
              localStorage.setItem(DEFAULT_DOOR_KEY, dataUrl);
            } catch {
              /* quota / disabled storage — ignore */
            }
          })
          .catch(() => {});
      }
    };
    img.src = fetchedUrl;
    return () => {
      cancelled = true;
    };
  }, [fetchedUrl]);

  const isInitialLoad = readySrc === null;
  // don't spin over the cached default while the initial fresh fetch runs — only for real updates
  const isUpdating = pending && freshLoaded;

  return { doorImage: readySrc, isInitialLoad, isUpdating, isError };
};

export default useDoorImage;
