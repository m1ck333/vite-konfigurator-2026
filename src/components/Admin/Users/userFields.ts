import { TFunction } from "i18next";

export const fields = (t: TFunction) => {
  return [
    { name: "username", type: "text", label: t("username"), required: true },
    { name: "email", type: "email", label: t("email"), required: false },
    { name: "phone", type: "text", label: t("phone"), required: false },
    {
      name: "mobile_phone",
      type: "text",
      label: t("mobilePhone"),
      required: false,
    },
    { name: "city", type: "text", label: t("city"), required: true },
    { name: "address", type: "text", label: t("address"), required: false },
    { name: "zip_code", type: "text", label: t("zipCode"), required: true },
    {
      name: "company_name",
      type: "text",
      label: t("companyName"),
      required: true,
    },
    { name: "pib", type: "text", label: t("pib"), required: false },
    {
      name: "social_number",
      type: "text",
      label: t("socialNumber"),
      required: false,
    },
    {
      name: "giro_account",
      type: "text",
      label: t("giroAccount"),
      required: false,
    },
    {
      name: "contact_person",
      type: "text",
      label: t("contactPerson"),
      required: false,
    },
    {
      name: "password",
      type: "password",
      label: t("password"),
      required: true,
    },
    {
      name: "confirm_password",
      type: "password",
      label: t("confirmPassword"),
      required: true,
    },
    {
      name: "logo",
      type: "file",
      label: t("logo"),
      required: false,
    },
  ];
};
