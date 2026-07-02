import { useSelector } from "react-redux";
import { selectUserToken } from "../features/user/userSlice";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { AuthApiResponse, handleAuthApiResponse } from "../utils";

export const useFetchWithAuth = (showToast = true) => {
  const token = useSelector(selectUserToken);
  const { t } = useTranslation();

  const fetchData = async (
    url: string,
    method: "GET" | "PUT" | "POST" | "DELETE",
    body?: any,
    isFormData: boolean = false
  ): Promise<{ success: boolean; data?: any }> => {
    if (!token) {
      if (showToast) {
        toast.error(t("auth-messages.no-auth-token"));
      }
      return { success: false };
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    };

    const fetchOptions: RequestInit = {
      method,
      headers,
      body: isFormData ? body : JSON.stringify(body),
    };

    try {
      const response = await fetch(url, fetchOptions);

      const apiResponse: AuthApiResponse =
        await handleAuthApiResponse(response);
      if (!apiResponse.success) {
        toast.error(
          t(apiResponse.messageKey || "auth-messages.an-unknown-error-occurred")
        );
        return { success: false };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error(t("auth-messages.an-unknown-error-occurred"));
      return { success: false };
    }
  };

  return { fetchData };
};
