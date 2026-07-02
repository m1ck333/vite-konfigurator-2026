import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import { EquipmentGlass, Door } from "../types";
import {
  toBase64,
  useSWRFetcher,
  checkDoorFeatures,
  findItemTranslations,
} from "../utils";
import { RootState } from "../app/store";
import { setConfigurationField } from "../features/configuration/configurationSlice";

type ProccessedGlass = {
  name: string;
  img: string;
  id: number;
};

const useEquipmentGlasses = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [isMutating, setIsMutating] = useState(false);
  const dispatch = useDispatch();

  const {
    data: glasses,
    error,
    mutate,
    isLoading,
  } = useSWRFetcher<{ success: boolean; equipment_glasses: EquipmentGlass[] }>(
    `${API_URL}/api/equipment-glasses`,
    undefined,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const ornamentGlasses: ProccessedGlass[] = [];
  let decorativeSideGlasses: ProccessedGlass[] = [];

  glasses?.equipment_glasses?.forEach((glass: EquipmentGlass) => {
    const translation = findItemTranslations(glass.translations);

    const processedGlass: ProccessedGlass = {
      name: translation.name,
      img: `${API_URL}/storage/${glass.thumbnail}`,
      id: glass.id,
    };

    if (glass.type === "ornament") {
      ornamentGlasses.push(processedGlass);
    } else if (glass.type === "sideglass") {
      decorativeSideGlasses.push(processedGlass);
    }
  });

  const proccessedGlasses = glasses?.equipment_glasses?.map(
    (glass: EquipmentGlass) => {
      const translation = findItemTranslations(glass.translations);

      return {
        ...glass,
        name: translation.name,
      };
    }
  );

  const deleteGlass = async (id: number): Promise<void> => {
    setIsMutating(true);
    try {
      await fetch(`${API_URL}/api/equipment-glasses/${id}`, {
        method: "DELETE",
      });
      mutate();
    } catch (error) {
      throw error;
    } finally {
      setIsMutating(false);
    }
  };

  const addOrUpdateGlass = async (
    id: number | null,
    glassData: Partial<EquipmentGlass>
  ): Promise<void> => {
    setIsMutating(true);
    const dataToUpdate = { ...glassData };

    if (dataToUpdate.thumbnail instanceof File) {
      dataToUpdate.thumbnail = await toBase64(dataToUpdate.thumbnail);
    }

    if (dataToUpdate.sort_order === 0) {
      dataToUpdate.sort_order = null;
    }

    const method = id ? "PUT" : "POST";
    const url = id
      ? `${API_URL}/api/equipment-glasses/${id}`
      : `${API_URL}/api/equipment-glasses`;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToUpdate),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred");
      }

      mutate();
    } catch (error) {
      throw error;
    } finally {
      setIsMutating(false);
    }
  };

  const dispatchSelectedGlass = (
    field: "inner-glass-name" | "side-glass-name" | "transom-glass-name",
    id: number | null,
    value: string
  ) => {
    dispatch(setConfigurationField({ field, value }));

    // Determine the correct ID field based on the field name
    let idField: "inner-glass-id" | "side-glass-id" | "transom-glass-id";
    if (field === "inner-glass-name") {
      idField = "inner-glass-id";
    } else if (field === "side-glass-name") {
      idField = "side-glass-id";
    } else {
      idField = "transom-glass-id";
    }

    dispatch(
      setConfigurationField({
        field: idField,
        value: id,
      })
    );
  };

  const selectedDoorId = useSelector(
    (state: RootState) => state.configuration["model-id"]
  );
  const selectedDoorModel = useSelector(
    (state: RootState) => state.configuration["model-name"]
  );
  const selectedDoorType = useSelector(
    (state: RootState) => state.configuration["type"]
  );
  const selectedInnerGlassId = useSelector(
    (state: RootState) => state.configuration["inner-glass-id"]
  );
  const selectedSideGlassId = useSelector(
    (state: RootState) => state.configuration["side-glass-id"]
  );
  const selectedTransomGlassId = useSelector(
    (state: RootState) => state.configuration["transom-glass-id"]
  );

  const { hasSideGlass, hasTransom } = checkDoorFeatures(selectedDoorType);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: doorData } = useSWR<Door>(
    selectedDoorId ? `${API_URL}/api/doors/${selectedDoorId}` : null,
    fetcher
  );

  const hasInDoorGlass = doorData?.has_glass;

  const decorativeInnerGlassForModal = doorData?.decorative_glass_name
    ? `${API_URL}/storage/thumbnails/glass/${doorData.decorative_glass_name}.png`
    : null;

  const decorativeSideGlassForModal = doorData?.side_glass_code
    ? {
        name: doorData.side_glass_code,
        img: `${API_URL}/storage/thumbnails/sideglass/${selectedDoorModel}.jpg`,
        id: 0,
      }
    : null;

  if (decorativeSideGlassForModal) {
    decorativeSideGlasses = [
      decorativeSideGlassForModal,
      ...decorativeSideGlasses,
    ];
  }

  const selectedGlasses = {
    inner: selectedInnerGlassId,
    side: selectedSideGlassId,
    transom: selectedTransomGlassId,
  };

  return {
    glasses: proccessedGlasses,
    error,
    isLoading,
    isMutating,
    deleteGlass,
    addOrUpdateGlass,
    mutate,
    ornamentGlasses,
    decorativeSideGlasses,
    hasTransom,
    hasSideGlass,
    decorativeInnerGlassForModal,
    selectedDoorModel,
    hasInDoorGlass,
    selectedGlasses,
    dispatchSelectedGlass,
  };
};

export default useEquipmentGlasses;
