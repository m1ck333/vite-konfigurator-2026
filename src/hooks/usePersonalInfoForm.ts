import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { fetchUserData, selectUserData } from "../features/user/userSlice";
import { useFetchWithAuth } from "./useFetchWithAuth";
import { Markup } from "../types";
import { AppDispatch } from "../app/store";

interface FormData {
  username: string;
  phone: string;
  mobile_phone: string;
  city: string;
  address: string;
  zip_code: string;
  company_name: string;
  pib: string;
  social_number: string;
  giro_account: string;
  email: string;
  contact_person: string;
  logo: string | File;
}

const usePersonalInfoForm = () => {
  const { t } = useTranslation();
  const { fetchData } = useFetchWithAuth();
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<FormData>({
    username: "",
    phone: "",
    mobile_phone: "",
    city: "",
    address: "",
    zip_code: "",
    company_name: "",
    pib: "",
    social_number: "",
    giro_account: "",
    email: "",
    contact_person: "",
    logo: "",
  });

  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || "",
        phone: userData.phone || "",
        mobile_phone: userData.mobile_phone || "",
        city: userData.city || "",
        address: userData.address || "",
        zip_code: userData.zip_code || "",
        company_name: userData.company_name || "",
        pib: userData.pib || "",
        social_number: userData.social_number || "",
        giro_account: userData.giro_account || "",
        email: userData.email || "",
        contact_person: userData.contact_person || "",
        logo: userData.logo || "",
      });
    }
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (updatedFormData: FormData): Promise<boolean> => {
    setIsMutating(true);
    const response = await fetchData(
      `${process.env.REACT_APP_API_URL}/api/update`,
      "PUT",
      updatedFormData
    );

    if (response.success) {
      toast.success(t("auth-messages.update-successfully"));
    }

    setIsMutating(false);

    return response.success;
  };

  const updateDefaultMarkup = async (id: number | null): Promise<boolean> => {
    setIsMutating(true);

    const response = await fetchData(
      `${process.env.REACT_APP_API_URL}/api/markups/update-default`,
      "PUT",
      { id }
    );
    setIsMutating(false);

    if (response.success) {
      toast.success(
        id ? t("default-markup-updated") : t("default-markup-cleared")
      );
      dispatch(fetchUserData());
      return true;
    }

    toast.error(t("default-markup-update-failed"));
    return false;
  };

  const addMarkup = async (
    markup: Pick<Markup, "markup_label" | "markup_value">
  ): Promise<Markup | null> => {
    setIsMutating(true);
    const response = await fetchData(
      `${process.env.REACT_APP_API_URL}/api/markups`,
      "POST",
      markup
    );
    setIsMutating(false);

    if (response.success && response.data) {
      toast.success(t("markup-added-successfully"));
      dispatch(fetchUserData());
      return response.data as Markup;
    }
    toast.error(t("markup-add-failed"));
    return null;
  };

  const editMarkup = async (
    id: number,
    markup: Pick<Markup, "markup_label" | "markup_value">
  ): Promise<Markup | null> => {
    setIsMutating(true);
    const response = await fetchData(
      `${process.env.REACT_APP_API_URL}/api/markups/${id}`,
      "PUT",
      markup
    );
    setIsMutating(false);

    if (response.success && response.data) {
      toast.success(t("markup-updated-successfully"));
      dispatch(fetchUserData());
      return response.data as Markup;
    }
    toast.error(t("markup-update-failed"));
    return null;
  };

  const deleteMarkup = async (id: number): Promise<boolean> => {
    setIsMutating(true);
    const response = await fetchData(
      `${process.env.REACT_APP_API_URL}/api/markups/${id}`,
      "DELETE"
    );
    setIsMutating(false);

    if (response.success) {
      toast.success(t("markup-deleted-successfully"));
      dispatch(fetchUserData());
      return true;
    }
    toast.error(t("markup-delete-failed"));
    return false;
  };

  return {
    formData,
    handleInputChange,
    handleSubmit,
    setFormData,
    markups: userData?.markups,
    addMarkup,
    editMarkup,
    deleteMarkup,
    updateDefaultMarkup,
    isMutating,
  };
};

export default usePersonalInfoForm;
