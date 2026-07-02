import useSWR from "swr";
import { EquipmentOtherCategory } from "../types";

export interface EquipmentCategoryApiResponse {
  success: boolean;
  categories: EquipmentOtherCategory[];
}

export const useEquipmentOtherCategories = (): {
  categories: EquipmentOtherCategory[];
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

  const { data, error } = useSWR<EquipmentCategoryApiResponse>(
    `${process.env.REACT_APP_API_URL}/api/equipment-other-categories`,
    fetcher
  );

  return {
    categories: data?.categories ?? [],
    isLoading: !error && !data,
    isError: !!error,
  };
};
