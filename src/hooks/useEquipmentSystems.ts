import { useState } from "react";

import { EquipmentSystem } from "../types";
import { toBase64, useSWRFetcher, findItemTranslations } from "../utils";

const useEquipmentSystems = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [isMutating, setIsMutating] = useState(false);

  const {
    data: systems,
    error,
    mutate,
    isLoading,
  } = useSWRFetcher<{ success: boolean; equipment_systems: EquipmentSystem[] }>(
    `${API_URL}/api/equipment-systems`,
    undefined,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const processedSystems = systems?.equipment_systems?.map((system) => {
    const translation = findItemTranslations(system.translations);
    return {
      ...system,
      description: translation.description,
    };
  });

  const deleteSystem = async (id: number): Promise<void> => {
    setIsMutating(true);
    try {
      await fetch(`${API_URL}/api/equipment-systems/${id}`, {
        method: "DELETE",
      });
      mutate();
    } catch (error) {
      throw error;
    } finally {
      setIsMutating(false);
    }
  };

  const addOrUpdateSystem = async (
    id: number | null,
    systemData: Partial<EquipmentSystem>
  ): Promise<void> => {
    setIsMutating(true);
    const dataToUpdate = { ...systemData };

    if (dataToUpdate.thumbnail instanceof File) {
      dataToUpdate.thumbnail = await toBase64(dataToUpdate.thumbnail);
    }

    if (dataToUpdate.sort_order === 0) {
      dataToUpdate.sort_order = null;
    }

    const method = id ? "PUT" : "POST";
    const url = id
      ? `${API_URL}/api/equipment-systems/${id}`
      : `${API_URL}/api/equipment-systems`;

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToUpdate),
      });
      mutate();
    } catch (error) {
      throw error;
    } finally {
      setIsMutating(false);
    }
  };

  return {
    systems: processedSystems,
    error,
    isLoading,
    isMutating,
    deleteSystem,
    addOrUpdateSystem,
    mutate,
  };
};

export default useEquipmentSystems;
