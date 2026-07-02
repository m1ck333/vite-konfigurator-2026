import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RegisterFormData } from "../types";

const useUserForm = (initialData: Partial<RegisterFormData> = {}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<RegisterFormData>({
    company_name: "",
    city: "",
    zip_code: "",
    address: "",
    pib: "",
    social_number: "",
    giro_account: "",
    phone: "",
    mobile_phone: "",
    email: "",
    contact_person: "",
    currency: "RSD",
    username: "",
    password: "",
    logo: "",
    confirm_password: "",
    ...initialData,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const validate = useCallback(() => {
    const newErrors: { [key: string]: string } = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = t("form.username-required");
    } else if (formData.username.length > 255) {
      newErrors.username = t("form.username-max-length");
    }

    // Password validation (only if a password is entered)
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = t("form.password-min-length");
      }
      if (formData.password !== formData.confirm_password) {
        newErrors.confirm_password = t("form.passwords-dont-match");
      }
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = t("form.city-required");
    } else if (formData.city.length > 255) {
      newErrors.city = t("form.city-max-length");
    }

    // Zip code validation
    if (!formData.zip_code.trim()) {
      newErrors.zip_code = t("form.zip-code-required");
    } else if (formData.zip_code.length > 20) {
      newErrors.zip_code = t("form.zip-code-max-length");
    }

    // Company name validation
    if (!formData.company_name.trim()) {
      newErrors.company_name = t("form.company-name-required");
    } else if (formData.company_name.length > 255) {
      newErrors.company_name = t("form.company-name-max-length");
    }

    // Optional field validations
    if (formData.pib && formData.pib.length > 20) {
      newErrors.pib = t("form.pib-max-length");
    }
    if (formData.social_number && formData.social_number.length > 20) {
      newErrors.social_number = t("form.social-number-max-length");
    }
    if (formData.giro_account && formData.giro_account.length > 20) {
      newErrors.giro_account = t("form.giro-account-max-length");
    }
    if (formData.phone && formData.phone.length > 50) {
      newErrors.phone = t("form.phone-max-length");
    }
    if (formData.mobile_phone && formData.mobile_phone.length > 50) {
      newErrors.mobile_phone = t("form.mobile-phone-max-length");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

  const resetForm = useCallback(() => {
    setFormData({
      company_name: "",
      city: "",
      zip_code: "",
      address: "",
      pib: "",
      social_number: "",
      giro_account: "",
      phone: "",
      mobile_phone: "",
      email: "",
      contact_person: "",
      currency: "RSD",
      username: "",
      password: "",
      logo: "",
      confirm_password: "",
    });
    setErrors({});
  }, []);

  useEffect(() => {
    if (
      JSON.stringify(formData) !==
      JSON.stringify({ ...formData, ...initialData })
    ) {
      setFormData((prevState) => ({
        ...prevState,
        ...initialData,
      }));
    }
    // eslint-disable-next-line
  }, [initialData]);

  return {
    formData,
    setFormData,
    errors,
    handleChange,
    validate,
    resetForm,
  };
};

export default useUserForm;
