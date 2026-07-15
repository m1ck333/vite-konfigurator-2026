import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { RootState } from "../app/store";
import { debounce } from "../utils";

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
  // the URL that has finished preloading and is safe to render
  const [readySrc, setReadySrc] = useState<string | null>(null);
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
      if (!cancelled) setReadySrc(fetchedUrl);
    };
    img.src = fetchedUrl;
    return () => {
      cancelled = true;
    };
  }, [fetchedUrl]);

  const isInitialLoad = readySrc === null;
  const isUpdating = pending;

  return { doorImage: readySrc, isInitialLoad, isUpdating, isError };
};

export default useDoorImage;
