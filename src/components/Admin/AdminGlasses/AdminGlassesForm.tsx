import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { EquipmentGlass, EquipmentGlassTranslation } from "../../../types";
import Input from "../../ui/Input";
import TextArea from "../../ui/TextArea";
import InputImage from "../../ui/InputImage";
import CoolCheckbox from "../../ui/CoolCheckbox";
import FormFooter from "../AdminComponents/FormFooter";
import Select from "../../ui/Select";

interface AdminGlassesFormProps {
  glass: EquipmentGlass | null;
  onSubmit: (glassData: Partial<EquipmentGlass>) => void;
  onCancel: () => void;
  isMutating: boolean;
}

const AdminGlassesForm: React.FC<AdminGlassesFormProps> = ({
  glass,
  onSubmit,
  onCancel,
  isMutating,
}) => {
  const { i18n } = useTranslation();
  const supportedLngs = i18n.options?.supportedLngs;

  const languages = Array.isArray(supportedLngs)
    ? supportedLngs.filter((lng) => lng !== "cimode")
    : [];

  const createInitialTranslations = (): EquipmentGlassTranslation[] =>
    languages.map((language) => ({
      id: 0,
      glass_id: 0,
      language,
      name: "",
    }));

  const mergeTranslations = (
    initial: EquipmentGlassTranslation[],
    existing: EquipmentGlassTranslation[]
  ): EquipmentGlassTranslation[] =>
    initial.map(
      (initialTranslation) =>
        existing.find((t) => t.language === initialTranslation.language) ||
        initialTranslation
    );

  const initializeFormData = (): Partial<EquipmentGlass> => {
    if (glass) {
      const translations = mergeTranslations(
        createInitialTranslations(),
        glass.translations
      );
      return { ...glass, translations };
    } else {
      return {
        translations: createInitialTranslations(),
        type: "ornament",
        price: "0",
      };
    }
  };

  const [formData, setFormData] =
    useState<Partial<EquipmentGlass>>(initializeFormData());

  useEffect(() => {
    setFormData(initializeFormData());
    // eslint-disable-next-line
  }, [glass]);

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

  const handlePriceInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || (e.currentTarget.value === "" && e.key === "0")) {
      e.preventDefault();
    }
  };

  const handleTypeChange = (value: EquipmentGlass["type"]) => {
    setFormData((prevState) => ({ ...prevState, type: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="flex justify-between">
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

        <Input
          label="Redosled za sortiranje"
          type="number"
          name="sort_order"
          value={formData.sort_order || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex justify-between">
        <InputImage
          name="thumbnail"
          initialImage={formData.thumbnail as string}
          onFileChange={handleFileChange}
        />

        <Select
          label="Tip stakla"
          options={[
            { value: "ornament", label: "Ornamentalno" },
            { value: "sideglass", label: "Bočno" },
          ]}
          value={formData.type || "ornament"}
          onChange={(value) =>
            handleTypeChange(value as EquipmentGlass["type"])
          }
        />
      </div>

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

export default AdminGlassesForm;
