import useSWR from "swr";
import { House } from "../types";

export interface HousesApiResponse {
  success: boolean;
  houses: House[];
}

export const useHouses = (): {
  houses: House[];
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

  const { data, error } = useSWR<HousesApiResponse>(
    `${process.env.REACT_APP_API_URL}/api/houses`,
    fetcher
  );

  return {
    houses: data?.houses ?? [],
    isLoading: !error && !data,
    isError: !!error,
  };
};
