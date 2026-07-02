import useSWR from "swr";
import { HouseColor } from "../types";

export interface HouseColorsApiResponse {
  success: boolean;
  colors: HouseColor[];
}

export const useHouseColors = (): {
  houseColors: HouseColor[];
  isLoading: boolean;
  isError: boolean;
} => {
  const fetcher = (url: string) =>
    fetch(url).then((res) => {
      if (!res.ok) {
        throw new Error(`An error occurred: ${res.status}`);
      }
      return res.json();
    });

  const { data, error } = useSWR<HouseColorsApiResponse>(
    `${process.env.REACT_APP_API_URL}/api/house-colors`,
    fetcher
  );

  return {
    houseColors: data?.colors ?? [],
    isLoading: !error && !data,
    isError: !!error,
  };
};
