import useSWR from "swr";

interface EquipmentTranslation {
  equipment_id?: number;
  lock_id?: number;
  glass_id?: number;
  language: string;
  name: string;
}

interface TranslationsResponse {
  success: boolean;
  data: Record<string, EquipmentTranslation[]>;
}

interface UseEquipmentTranslationsReturn {
  translations: Record<string, EquipmentTranslation[]> | undefined;
  getTranslation: (category: string, id: number, language: string) => string;
  isLoading: boolean;
  isError: boolean;
  revalidate: () => Promise<boolean>;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useEquipmentTranslations = (): UseEquipmentTranslationsReturn => {
  const { data, error, mutate } = useSWR<TranslationsResponse>(
    `${process.env.REACT_APP_API_URL}/api/equipment-translations`,
    fetcher
  );

  const translations = data?.data;

  // Function to retrieve translation based on category, id, and language
  const getTranslation = (category: string, id: number, language: string) => {
    if (!translations || !translations[category]) return "";

    const translatedItem = translations[category].find(
      (item) =>
        (item.equipment_id === id ||
          item.lock_id === id ||
          item.glass_id === id) &&
        item.language === language
    );

    return translatedItem ? translatedItem.name : "";
  };

  const revalidate = async (): Promise<boolean> => {
    await mutate();
    return !error;
  };

  return {
    translations,
    getTranslation,
    isLoading: !error && !data,
    isError: !!error,
    revalidate,
  };
};
