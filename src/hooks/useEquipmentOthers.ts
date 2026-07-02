import useSWR from "swr";
import { EquipmentOther, EquipmentOthersByCategory } from "../types";

interface UseEquipmentOthersReturn {
  equipmentOthers: EquipmentOthersByCategory[] | undefined;
  equipmentOthersSubcategories: EquipmentOther[] | undefined;
  isLoading: boolean;
  isError: boolean;
  revalidate: () => Promise<boolean>;
  deleteEquipmentOther: (id: number) => Promise<void>;
  addOrUpdateEquipmentOther: (
    id: number | null,
    equipmentData: Partial<EquipmentOther>
  ) => Promise<void>;
}

interface ApiResponse {
  success: boolean;
  equipment_others: EquipmentOthersByCategory[];
  subcategories: EquipmentOther[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useEquipmentOthers = (
  onlyShown: boolean = false
): UseEquipmentOthersReturn => {
  const { data, error, mutate } = useSWR<ApiResponse>(
    `${process.env.REACT_APP_API_URL}/api/equipment-others${
      onlyShown ? "?only_shown=true" : ""
    }`,
    fetcher
  );

  const equipmentOthers = data?.equipment_others;
  const equipmentOthersSubcategories = data?.subcategories;

  const revalidate = async (): Promise<boolean> => {
    await mutate();
    return !error;
  };

  const deleteEquipmentOther = async (id: number): Promise<void> => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/equipment-others/${id}`, {
      method: "DELETE",
    });
    await mutate();
  };

  const addOrUpdateEquipmentOther = async (
    id: number | null,
    equipmentData: Partial<EquipmentOther>
  ): Promise<void> => {
    const url = id
      ? `${process.env.REACT_APP_API_URL}/api/equipment-others/${id}`
      : `${process.env.REACT_APP_API_URL}/api/equipment-others`;

    const method = id ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(equipmentData),
    });

    await mutate();
  };

  return {
    equipmentOthers,
    equipmentOthersSubcategories,
    isLoading: !error && !data,
    isError: !!error,
    revalidate,
    deleteEquipmentOther,
    addOrUpdateEquipmentOther,
  };
};
