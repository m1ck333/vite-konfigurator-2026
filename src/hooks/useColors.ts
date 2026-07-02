import { useState, useMemo } from "react";
import {
  Color,
  GroupedColors,
  ColorCategory,
  ColorCategoryTranslation,
} from "../types";
import { useSWRFetcher } from "../utils";
import { useTranslation } from "react-i18next";
interface UseColorsReturn {
  colorsByCategory: GroupedColors[] | undefined;
  colors: Color[] | undefined;
  categories: ColorCategory[] | undefined;
  isLoading: boolean;
  isError: boolean;
  isMutating: boolean;
  deleteColor: (id: number) => Promise<void>;
  addOrUpdateColor: (
    id: number | null,
    colorData: Partial<Color>
  ) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  addOrUpdateCategory: (
    id: number | null,
    categoryData: Partial<ColorCategory>,
    translations: ColorCategoryTranslation[]
  ) => Promise<void>;
}

export const useColors = (
  colorType?: "panel" | "frame",
  language: string = "en"
): UseColorsReturn => {
  const { t } = useTranslation();
  const API_URL = process.env.REACT_APP_API_URL;
  const [isMutating, setIsMutating] = useState(false);

  const {
    data: colorsData,
    error: colorsError,
    mutate: mutateColors,
    isLoading: colorsLoading,
  } = useSWRFetcher<Color[]>(`${API_URL}/api/colors`, undefined, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const {
    data: categoriesData,
    error: categoriesError,
    mutate: mutateCategories,
    isLoading: categoriesLoading,
  } = useSWRFetcher<ColorCategory[]>(
    `${API_URL}/api/color-categories`,
    undefined,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  const colorsByCategory = useMemo(() => {
    if (!colorsData || !categoriesData) return [];

    // Filter categories based on the selected colorType
    const filteredCategories = categoriesData.filter((category) => {
      if (colorType === "panel") return category.show_in_panel;
      if (colorType === "frame") return category.show_in_stock;
      return true; // Default: show all categories
    });

    // Sort categories based on sort_order
    const sortedCategories = [...filteredCategories].sort((a, b) => {
      if (a.sort_order === null && b.sort_order !== null) return 1; // Move NULL to end
      if (b.sort_order === null && a.sort_order !== null) return -1;
      return (a.sort_order ?? Infinity) - (b.sort_order ?? Infinity);
    });

    // Convert categories into an ordered array with their colors
    return sortedCategories.map((category) => ({
      categoryName:
        category.translations?.find((t) => t.language === language)?.name ||
        t("uncategorized"),
      colors: colorsData.filter(
        (color) => color.color_category?.id === category.id
      ),
    }));
  }, [colorsData, categoriesData, colorType, language]);

  const deleteColor = async (id: number): Promise<void> => {
    setIsMutating(true);
    try {
      await fetch(`${API_URL}/api/colors/${id}`, {
        method: "DELETE",
      });
      await mutateColors();
    } catch (error) {
      throw error;
    } finally {
      setIsMutating(false);
    }
  };

  const addOrUpdateColor = async (
    id: number | null,
    colorData: Partial<Color>
  ): Promise<void> => {
    setIsMutating(true);
    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/api/colors/${id}` : `${API_URL}/api/colors`;

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(colorData),
      });
      await mutateColors();
    } catch (error) {
      throw error;
    } finally {
      setIsMutating(false);
    }
  };

  const deleteCategory = async (id: number): Promise<void> => {
    setIsMutating(true);
    try {
      await fetch(`${API_URL}/api/color-categories/${id}`, {
        method: "DELETE",
      });
      await mutateCategories();
    } catch (error) {
      throw error;
    } finally {
      setIsMutating(false);
    }
  };

  const addOrUpdateCategory = async (
    id: number | null,
    categoryData: Partial<ColorCategory>,
    translations: ColorCategoryTranslation[]
  ): Promise<void> => {
    setIsMutating(true);
    const method = id ? "PUT" : "POST";
    const url = id
      ? `${API_URL}/api/color-categories/${id}`
      : `${API_URL}/api/color-categories`;

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...categoryData,
          translations,
        }),
      });
      await mutateCategories();
    } catch (error) {
      throw error;
    } finally {
      setIsMutating(false);
    }
  };

  return {
    colorsByCategory,
    colors: colorsData,
    categories: categoriesData,
    isLoading: colorsLoading || categoriesLoading,
    isError: !!colorsError || !!categoriesError,
    isMutating,
    deleteColor,
    addOrUpdateColor,
    deleteCategory,
    addOrUpdateCategory,
  };
};
