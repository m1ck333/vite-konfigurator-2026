import useSWR, { SWRConfiguration } from "swr";
import { removeAuthToken } from "../api/auth";
import { ERROR_MESSAGES } from "../constants";
import { UserState } from "../features/user/userSlice";
import { EquipmentOther, EquipmentGlass } from "../types";
import i18n from "i18next";

export const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: any[]) => {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const checkDoorFeatures = (doorType: string) => {
  const hasLeftGlass = doorType.includes("both") || doorType.includes("left");
  const hasRightGlass = doorType.includes("both") || doorType.includes("right");

  const hasSideGlass =
    doorType.includes("both") ||
    doorType.includes("right") ||
    doorType.includes("left");

  const hasTransom = doorType.includes("transom");
  const hasDoubleDoor = doorType.includes("double");

  return {
    hasLeftGlass,
    hasRightGlass,
    hasSideGlass,
    hasTransom,
    hasDoubleDoor,
  };
};

export type AuthApiResponse = {
  success: boolean;
  messageKey?: string;
};

export const handleAuthApiResponse = async (
  response: Response
): Promise<AuthApiResponse> => {
  if (!response.ok) {
    const errorData = await response.json();
    let messageKey = "auth-messages.an-unknown-error-occurred";

    if (errorData && errorData.messageTranslation) {
      messageKey = errorData.messageTranslation;
    } else if (errorData) {
      const firstKey: string = Object.keys(errorData)[0];
      messageKey = errorData[firstKey][0];
    }
    return { success: false, messageKey };
  }
  return { success: true };
};

export class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "CustomError";
  }

  toJSON() {
    return {
      message: this.message,
      status: this.status,
      name: this.name,
    };
  }
}

export const handle401Error = (state: UserState, action: any) => {
  const error = action.payload as CustomError;
  if (error.status === 401) {
    state.isLoggedIn = false;
    state.userData = null;
    removeAuthToken();
  } else {
    state.error = error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
  }
  state.isLoading = false;
};

export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const useSWRFetcher = <T>(
  url: string,
  fetchOptions?: RequestInit,
  swrOptions?: SWRConfiguration
) => {
  const fetcher = (url: string) =>
    fetch(url, fetchOptions).then((res) => res.json());

  const {
    data,
    error,
    mutate,
    isValidating: isLoading,
  } = useSWR<T>(url, fetcher, swrOptions);

  return { data, error, mutate, isLoading };
};

export const todayDate = (): string => {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${day}.${month}.${year}.`;
};

export const findItemTranslations = <
  T extends { language: string; name?: string; description?: string },
>(
  translations: T[]
) => {
  const translation = translations.find((t) => t.language === i18n.language);

  return {
    name: translation?.name ?? "",
    description: translation?.description ?? "",
  };
};

export function getEquipmentPictureVisibility(
  equipment: EquipmentOther | null
): {
  showThumbnail: boolean;
  showImage: boolean;
  showInnerImage: boolean;
} {
  const categoryId = equipment?.category_id ?? 0;

  return {
    showThumbnail:
      [2, 4, 7, 9].includes(categoryId) || !!equipment?.is_subcategory,
    showImage:
      [1, 2, 3, 5, 6, 8, 10].includes(categoryId) && !equipment?.is_subcategory,
    showInnerImage: categoryId === 6,
  };
}

/**
 * Processes equipment glass data to extract default values
 * @param equipmentGlass Array of equipment glass from API
 * @returns Object containing default glass values
 */
export const processGlassDefaults = (equipmentGlass: EquipmentGlass[]) => {
  const defaults = {
    "side-glass-name": null as string | null,
    "side-glass-id": null as number | null,
    "transom-glass-name": null as string | null,
    "transom-glass-id": null as number | null,
    "inner-glass-name": null as string | null,
    "inner-glass-id": null as number | null,
  };

  if (!equipmentGlass || equipmentGlass.length === 0) {
    return defaults;
  }

  // Find default side glass (prefer sideglass type, fallback to first glass)
  const defaultSideGlass =
    equipmentGlass.find((glass) => glass.type === "sideglass") ||
    equipmentGlass[0];

  if (defaultSideGlass) {
    if (defaultSideGlass.id) {
      defaults["side-glass-id"] = defaultSideGlass.id;
    }

    if (
      defaultSideGlass.translations &&
      defaultSideGlass.translations.length > 0
    ) {
      const translation = findItemTranslations(defaultSideGlass.translations);
      defaults["side-glass-name"] = translation.name;
    }
  }

  // Find default transom glass (prefer ornament type)
  const defaultTransomGlass = equipmentGlass.find(
    (glass) => glass.type === "ornament"
  );

  if (defaultTransomGlass) {
    if (defaultTransomGlass.id) {
      defaults["transom-glass-id"] = defaultTransomGlass.id;
    }

    if (
      defaultTransomGlass.translations &&
      defaultTransomGlass.translations.length > 0
    ) {
      const translation = findItemTranslations(
        defaultTransomGlass.translations
      );
      defaults["transom-glass-name"] = translation.name;
    }
  }

  // Find default inner glass (prefer decorative type)
  const defaultInnerGlass =
    equipmentGlass.find((glass) => glass.type === "decorative") ||
    equipmentGlass.find((glass) => glass.type === "ornament") ||
    equipmentGlass[0];

  if (defaultInnerGlass) {
    if (defaultInnerGlass.id) {
      defaults["inner-glass-id"] = defaultInnerGlass.id;
    }

    if (
      defaultInnerGlass.translations &&
      defaultInnerGlass.translations.length > 0
    ) {
      const translation = findItemTranslations(defaultInnerGlass.translations);
      defaults["inner-glass-name"] = translation.name;
    }
  }

  return defaults;
};
