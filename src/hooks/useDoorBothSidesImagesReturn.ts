import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

import { RootState } from "../app/store";
import { debounce } from "../utils";

interface ConfigurationState {
  model: string | null;
  type: string;
}

interface UseDoorBothSidesImagesReturn {
  innerDoorImage: string | null;
  outerDoorImage: string | null;
  isLoading: boolean;
  isError: boolean;
}

const postFetcher = async (
  url: string,
  data: ConfigurationState
): Promise<Record<string, string>> => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

const useDoorBothSidesImages = (): UseDoorBothSidesImagesReturn => {
  const selectedConfiguration = useSelector(
    (state: RootState) => state.configuration
  );

  const [bothSidesImages, setBothSidesImages] = useState<{
    innerDoorImage: string | null;
    outerDoorImage: string | null;
  }>({ innerDoorImage: null, outerDoorImage: null });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchAndUpdateBothSidesImages = async (config: ConfigurationState) => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "default-api-url";
      const images = await postFetcher(
        `${apiUrl}/api/door/both-sides-images`,
        config
      );
      setBothSidesImages({
        innerDoorImage: images.innerDoor,
        outerDoorImage: images.outerDoor,
      });
      setIsError(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetch = useMemo(
    () => debounce(fetchAndUpdateBothSidesImages, 500),
    []
  );

  useEffect(() => {
    if (selectedConfiguration) {
      debouncedFetch(selectedConfiguration);
    }
  }, [selectedConfiguration, debouncedFetch]);

  return {
    ...bothSidesImages,
    isLoading,
    isError,
  };
};

export default useDoorBothSidesImages;
