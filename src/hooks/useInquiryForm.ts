import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { InquiryFormFields } from "../types";
import usePrepareConfiguration from "./usePrepareConfiguration";

const useInquiryForm = (
  setModalOpen: (isOpen: boolean) => void,
  innerDoorImage: string | null,
  outerDoorImage: string | null
) => {
  const { t } = useTranslation();
  const { sectionsSerbian } = usePrepareConfiguration();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<InquiryFormFields>({});

  const clearFieldError = (fieldName: keyof InquiryFormFields) => {
    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [fieldName]: undefined,
    }));
  };

  const validateForm = (fields: InquiryFormFields): boolean => {
    let errors: InquiryFormFields = {};

    if (!fields.email) {
      errors.email = t("form.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(fields.email)) {
      errors.email = t("form.emailInvalid");
    }

    if (!fields.phone) {
      errors.phone = t("form.phoneNumberRequired");
    } else if (!/^\d{10,}$/.test(fields.phone.replace(/\D/g, ""))) {
      errors.phone = t("form.phoneNumberInvalid");
    }

    if (!fields.postalCode) {
      errors.postalCode = t("form.postalCodeRequired");
    } else if (!/^[\w\s-]{3,10}$/.test(fields.postalCode)) {
      errors.postalCode = t("form.postalCodeInvalid");
    }

    if (!fields.city) {
      errors.city = t("form.cityRequired");
    } else if (fields.city.length < 2) {
      errors.city = t("form.cityTooShort");
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    const formData = new FormData(formRef.current as HTMLFormElement);
    const formFields = Object.fromEntries(formData) as InquiryFormFields;

    if (!validateForm(formFields)) {
      toast.error(t("form.validationFailed"));
      return;
    }

    setIsSubmitting(true);

    const submissionData = {
      ...formFields,
      configuration: sectionsSerbian,
      innerDoorImage,
      outerDoorImage,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/submit-inquiry`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      toast.success(t("form.inquirySent"));
      setModalOpen(false);
      formRef.current?.reset();
      setFormErrors({});
    } catch (error) {
      console.error("Failed to send inquiry:", error);
      toast.error(t("form.inquiryFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formRef,
    isSubmitting,
    handleSubmit,
    formErrors,
    clearFieldError,
    setFormErrors,
  };
};

export default useInquiryForm;
