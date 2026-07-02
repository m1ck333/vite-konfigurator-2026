import React from "react";
import Input from "../../ui/Input";
import InputImage from "../../ui/InputImage";
import { fields } from "./userFields";
import { useTranslation } from "react-i18next";

interface UserFormFieldsProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: (formData: any) => void;
  errors?: { [key: string]: string };
  mode: "create" | "edit";
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({
  formData,
  handleInputChange,
  setFormData,
  errors,
  mode,
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields(t).map(({ name, type, label, required }) => {
        const error = errors?.[name];

        if (
          mode === "edit" &&
          (name === "password" || name === "confirm_password")
        ) {
          return null;
        }

        if (type === "file") {
          return (
            <InputImage
              key={name}
              type="logo"
              name="logo"
              initialImage={formData.logo as string}
              onFileChange={(base64Image) =>
                setFormData({ ...formData, logo: base64Image || "" })
              }
            />
          );
        } else {
          return (
            <Input
              key={name}
              name={name}
              type={type}
              label={label}
              placeholder={label}
              value={(formData as Record<string, string>)[name] || ""}
              onChange={handleInputChange}
              required={required}
              error={error}
            />
          );
        }
      })}
    </div>
  );
};

export default UserFormFields;
