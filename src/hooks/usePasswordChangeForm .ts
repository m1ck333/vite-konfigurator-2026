import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { useFetchWithAuth } from "./useFetchWithAuth";

interface PasswordChangeFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const usePasswordChangeForm = () => {
  const { t } = useTranslation();
  const [isMutating, setIsMutating] = useState(false);
  const { fetchData } = useFetchWithAuth();

  const [formData, setFormData] = useState<PasswordChangeFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.newPassword.length < 6) {
      toast.error(t("form.password-min-length"));
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error(t("auth-messages.passwords-dont-match"));
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error(t("auth-messages.new-password-same-as-old"));
      return;
    }

    setIsMutating(true);

    const response = await fetchData(
      `${process.env.REACT_APP_API_URL}/api/password-update`,
      "PUT",
      {
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
        new_password_confirmation: formData.confirmPassword,
      }
    );

    if (response.success) {
      toast.success(t("auth-messages.password-change-successful"));
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }

    setIsMutating(false);
  };

  return { formData, handleInputChange, handleSubmit, isMutating };
};

export default usePasswordChangeForm;
