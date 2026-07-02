import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { EquipmentLock, EquipmentLockTranslation } from "../../../types";
import Input from "../../ui/Input";
import InputImage from "../../ui/InputImage";
import CoolCheckbox from "../../ui/CoolCheckbox";
import FormFooter from "../AdminComponents/FormFooter";
import TextArea from "../../ui/TextArea";

interface AdminLockFormProps {
  lock: EquipmentLock | null;
  onSubmit: (lockData: Partial<EquipmentLock>) => void;
  onCancel: () => void;
  isMutating: boolean;
}

const AdminLockForm: React.FC<AdminLockFormProps> = ({
  lock,
  onSubmit,
  onCancel,
  isMutating,
}) => {
  const { i18n } = useTranslation();
  const supportedLngs = i18n.options?.supportedLngs;

  const languages = Array.isArray(supportedLngs)
    ? supportedLngs.filter((lng) => lng !== "cimode")
    : [];

  const createInitialTranslations = (): EquipmentLockTranslation[] =>
    languages.map((language) => ({
      id: 0,
      lock_id: 0,
      language,
      name: "",
    }));

  const mergeTranslations = (
    initial: EquipmentLockTranslation[],
    existing: EquipmentLockTranslation[]
  ): EquipmentLockTranslation[] =>
    initial.map(
      (initialTranslation) =>
        existing.find((t) => t.language === initialTranslation.language) ||
        initialTranslation
    );

  const initializeFormData = (): Partial<EquipmentLock> => {
    if (lock) {
      const translations = mergeTranslations(
        createInitialTranslations(),
        lock.translations
      );
      return { ...lock, translations };
    } else {
      return {
        code: "",
        thumbnail: "",
        price: "0",
        sort_order: null,
        is_shown: true,
        translations: createInitialTranslations(),
      };
    }
  };

  const [formData, setFormData] =
    useState<Partial<EquipmentLock>>(initializeFormData());

  useEffect(() => {
    setFormData(initializeFormData());
    // eslint-disable-next-line
  }, [lock]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === "number" ? value : value;
    setFormData((prevState) => ({ ...prevState, [name]: newValue }));
  };

  const handleFileChange = (base64Image: string | null) => {
    setFormData((prevState) => ({
      ...prevState,
      thumbnail: base64Image || "",
    }));
  };

  const handleTranslationChange = (
    language: string,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = e.target;

    const updatedTranslations = formData.translations?.map((translation) =>
      translation.language === language
        ? { ...translation, name: value }
        : translation
    );

    if (updatedTranslations) {
      setFormData((prevState) => ({
        ...prevState,
        translations: updatedTranslations,
      }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prevState) => ({ ...prevState, is_shown: checked }));
  };

  const handlePriceInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || (e.currentTarget.value === "" && e.key === "0")) {
      e.preventDefault();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Kod"
        type="text"
        name="code"
        value={formData.code || ""}
        onChange={handleInputChange}
        required
      />

      {formData.translations?.map((translation) => (
        <TextArea
          key={translation.language}
          label={`Naziv (${translation.language.toUpperCase()})`}
          name={`name_${translation.language}`}
          value={translation.name || ""}
          onChange={(e) => handleTranslationChange(translation.language, e)}
          required
        />
      ))}

      <Input
        label="Cena"
        type="number"
        name="price"
        value={formData.price || "0"}
        onKeyDown={handlePriceInput}
        onChange={handleInputChange}
        min={0}
        step={0.01}
      />

      <div className="flex justify-between">
        <div className="flex gap-4">
          <CoolCheckbox
            id="is_shown"
            checked={formData.is_shown || false}
            onChange={handleCheckboxChange}
            label="Prikazano"
          />

          <CoolCheckbox
            id="is_default"
            checked={formData.is_default || false}
            onChange={(checked) =>
              setFormData((prevState) => ({
                ...prevState,
                is_default: checked,
              }))
            }
            label="Podrazumevano"
          />
        </div>

        <Input
          label="Redosled za sortiranje"
          type="number"
          name="sort_order"
          value={formData.sort_order || ""}
          onChange={handleInputChange}
        />
      </div>

      <InputImage
        name="thumbnail"
        initialImage={formData.thumbnail as string}
        onFileChange={handleFileChange}
      />

      <FormFooter onCancel={onCancel} isMutating={isMutating} />
    </form>
  );
};

export default AdminLockForm;
