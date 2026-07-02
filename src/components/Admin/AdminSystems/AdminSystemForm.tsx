import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { EquipmentSystem, EquipmentSystemTranslation } from "../../../types";
import Input from "../../ui/Input";
import TextArea from "../../ui/TextArea";
import InputImage from "../../ui/InputImage";
import CoolCheckbox from "../../ui/CoolCheckbox";
import FormFooter from "../AdminComponents/FormFooter";

interface AdminSystemFormProps {
  system: EquipmentSystem | null;
  onSubmit: (systemData: Partial<EquipmentSystem>) => void;
  onCancel: () => void;
  isMutating: boolean;
}

const AdminSystemForm: React.FC<AdminSystemFormProps> = ({
  system,
  onSubmit,
  onCancel,
  isMutating,
}) => {
  const { i18n } = useTranslation();
  const supportedLngs = i18n.options?.supportedLngs;

  const languages = Array.isArray(supportedLngs)
    ? supportedLngs.filter((lng) => lng !== "cimode")
    : [];

  const createInitialTranslations = (): EquipmentSystemTranslation[] =>
    languages.map((language) => ({
      id: 0,
      equipment_id: 0,
      language,
      description: "",
    }));

  const mergeTranslations = (
    initial: EquipmentSystemTranslation[],
    existing: EquipmentSystemTranslation[]
  ): EquipmentSystemTranslation[] =>
    initial.map(
      (initialTranslation) =>
        existing.find((t) => t.language === initialTranslation.language) ||
        initialTranslation
    );

  const initializeFormData = (): Partial<EquipmentSystem> => {
    if (system) {
      const translations = mergeTranslations(
        createInitialTranslations(),
        system.translations
      );
      return { ...system, translations };
    } else {
      return { translations: createInitialTranslations() };
    }
  };

  const [formData, setFormData] =
    useState<Partial<EquipmentSystem>>(initializeFormData());

  useEffect(() => {
    setFormData(initializeFormData());
    // eslint-disable-next-line
  }, [system]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === "number" ? value : value;
    setFormData((prevState) => ({ ...prevState, [name]: newValue }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prevState) => ({ ...prevState, is_shown: checked }));
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
    const updatedTranslations = formData.translations?.map((translation) =>
      translation.language === language
        ? { ...translation, description: e.target.value }
        : translation
    );
    setFormData((prevState) => ({
      ...prevState,
      translations: updatedTranslations,
    }));
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
        label="Ime"
        type="text"
        name="name"
        value={formData.name || ""}
        onChange={handleInputChange}
      />

      <Input
        label="Šifra"
        type="text"
        name="code"
        value={formData.code || ""}
        onChange={handleInputChange}
      />

      {formData.translations?.map((translation) => (
        <TextArea
          key={translation.language}
          label={`Opis (${translation.language.toUpperCase()})`}
          name={`description_${translation.language}`}
          value={translation.description || ""}
          onChange={(e) => handleTranslationChange(translation.language, e)}
        />
      ))}

      <div className="flex justify-between">
        <Input
          label="Cena"
          type="number"
          name="price"
          value={formData.price || ""}
          onKeyDown={handlePriceInput}
          onChange={handleInputChange}
          min={0}
          step={0.01}
        />

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

      <FormFooter onCancel={onCancel} isMutating={isMutating} />
    </form>
  );
};

export default AdminSystemForm;
