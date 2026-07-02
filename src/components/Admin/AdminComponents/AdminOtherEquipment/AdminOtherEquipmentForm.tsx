import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { EquipmentOther, EquipmentOtherTranslation } from "../../../../types";
import TextArea from "../../../ui/TextArea";
import Input from "../../../ui/Input";
import CoolCheckbox from "../../../ui/CoolCheckbox";
import FormFooter from "../FormFooter";
import InputImage from "../../../ui/InputImage";
import { useEquipmentOtherCategories } from "../../../../hooks/useEquipmentOtherCategories";
import Select from "../../../ui/Select";
import { getEquipmentPictureVisibility } from "../../../../utils";

interface AdminOtherEquipmentFormProps {
  equipment: EquipmentOther | null;
  subcategories: EquipmentOther[] | null;
  onSubmit: (equipmentData: Partial<EquipmentOther>) => void;
  onCancel: () => void;
  isMutating: boolean;
}

const AdminOtherEquipmentForm: React.FC<AdminOtherEquipmentFormProps> = ({
  equipment,
  subcategories,
  onSubmit,
  onCancel,
  isMutating,
}) => {
  const { i18n, t } = useTranslation();
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    EquipmentOther[] | null
  >(null);
  const { categories } = useEquipmentOtherCategories();
  const languages = useMemo(
    () =>
      Array.isArray(i18n.options?.supportedLngs)
        ? i18n.options.supportedLngs.filter((lng) => lng !== "cimode")
        : [],
    [i18n.options?.supportedLngs]
  );

  const createInitialTranslations = useCallback(
    (): EquipmentOtherTranslation[] =>
      languages.map((language) => ({
        id: 0,
        equipment_id: 0,
        language,
        name: "",
        description: "",
      })),
    [languages]
  );

  const mergeTranslations = (
    initial: EquipmentOtherTranslation[],
    existing: EquipmentOtherTranslation[]
  ): EquipmentOtherTranslation[] =>
    initial.map(
      (initialTranslation) =>
        existing.find((t) => t.language === initialTranslation.language) ||
        initialTranslation
    );

  const initializeFormData = useCallback((): Partial<EquipmentOther> => {
    if (equipment) {
      const translations = mergeTranslations(
        createInitialTranslations(),
        equipment.translations
      );

      return {
        ...equipment,
        translations,
        category_id: equipment.category_id || categories?.[0]?.id || undefined,
        is_subcategory: equipment.is_subcategory || false,
      };
    } else {
      return {
        code: "",
        thumbnail: "",
        price: "0",
        sort_order: null,
        is_shown: true,
        translations: createInitialTranslations(),
        category_id: categories?.[0]?.id || 1,
        is_subcategory: false,
      };
    }
  }, [equipment, categories, createInitialTranslations]);

  useEffect(() => {
    setFormData(initializeFormData());
  }, [initializeFormData]);

  const [formData, setFormData] =
    useState<Partial<EquipmentOther>>(initializeFormData());

  useEffect(() => {
    if (subcategories) {
      setFilteredSubcategories(
        subcategories.filter(
          (subcategory) => subcategory.category_id === formData.category_id
        )
      );
    }
  }, [formData.category_id, subcategories]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === "number" ? value : value;
    setFormData((prevState) => ({ ...prevState, [name]: newValue }));
  };

  const handleFileChange = (
    base64Image: string | null,
    type: "thumbnail" | "image" | "inner_image"
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [type]: base64Image || "",
    }));
  };

  const handleTranslationChange = (
    language: string,
    field: keyof EquipmentOtherTranslation,
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { value } = e.target;

    const updatedTranslations = formData.translations?.map((translation) =>
      translation.language === language
        ? { ...translation, [field]: value }
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

  const handleSubcategoriesChange = (
    selectedSubcategoryName: string | null
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      subcategory: selectedSubcategoryName,
    }));
  };

  const handleCategoryChange = (selectedCategoryId: string | null) => {
    if (!selectedCategoryId) return;
    const newCategoryId = parseInt(selectedCategoryId, 10);

    setFormData((prevState) => ({
      ...prevState,
      category_id: newCategoryId,
    }));

    if (subcategories) {
      setFilteredSubcategories(
        subcategories.filter(
          (subcategory) => subcategory.category_id === newCategoryId
        )
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <div className="w-1/2">
          <Input
            label="Kod"
            type="text"
            name="code"
            value={formData.code || ""}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="w-1/2">
          <CoolCheckbox
            id="is_subcategory"
            checked={formData.is_subcategory || false}
            onChange={(checked) =>
              setFormData((prevState) => ({
                ...prevState,
                is_subcategory: checked,
                ...(checked ? { is_default: false } : {}),
              }))
            }
            label="Da li je podkategorija?"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="w-1/2">
          <Select
            label="Kategorija"
            options={categories.map((category) => ({
              value: String(category.id),
              label: t(category.name),
            }))}
            value={String(formData.category_id) || "1"}
            onChange={handleCategoryChange}
            includeNoneOption={false}
          />
        </div>

        {!formData.is_subcategory && (
          <div className="w-1/2">
            {filteredSubcategories && filteredSubcategories.length > 0 ? (
              <Select
                label="Podkategorija"
                options={filteredSubcategories.map((category) => ({
                  value: category.code,
                  label: category.code,
                }))}
                value={formData.subcategory ?? ""}
                onChange={handleSubcategoriesChange}
                includeNoneOption={true}
              />
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-bold uppercase tracking-wider text-primary-grey">
                  Podkategorija
                </p>
                <div className="text-center text-xs p-2 bg-primary-light rounded-lg">
                  Trenutno nema podkategorija vezanih za ovu kategoriju.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {formData.translations?.map((translation) => (
        <div key={translation.language} className="space-y-2">
          <TextArea
            label={`Naziv (${translation.language.toUpperCase()})`}
            name={`name_${translation.language}`}
            value={translation.name || ""}
            onChange={(e) =>
              handleTranslationChange(translation.language, "name", e)
            }
            required
          />
          <TextArea
            label={`Opis (${translation.language.toUpperCase()})`}
            name={`description_${translation.language}`}
            value={translation.description || ""}
            onChange={(e) =>
              handleTranslationChange(translation.language, "description", e)
            }
          />
        </div>
      ))}

      {!formData.is_subcategory && (
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
      )}

      <div className="flex justify-between">
        <div className="flex gap-4">
          <CoolCheckbox
            id="is_shown"
            checked={formData.is_shown || false}
            onChange={handleCheckboxChange}
            label="Prikazano"
          />

          {!formData.is_subcategory && (
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
          )}
        </div>

        <Input
          label="Redosled za sortiranje"
          type="number"
          name="sort_order"
          value={formData.sort_order || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex justify-between">
        {getEquipmentPictureVisibility(equipment).showThumbnail ? (
          <InputImage
            name="thumbnail"
            initialImage={formData.thumbnail as string}
            onFileChange={(base64Image: string | null) =>
              handleFileChange(base64Image, "thumbnail")
            }
            label="Slika u meniju"
          />
        ) : (
          <div />
        )}

        {getEquipmentPictureVisibility(equipment).showImage && (
          <div className="flex flex-col gap-4">
            <InputImage
              name="image"
              initialImage={formData.image as string}
              onFileChange={(base64Image: string | null) =>
                handleFileChange(base64Image, "image")
              }
              label={
                equipment?.category_id === 6
                  ? "Slika u vratima (spoljašna)"
                  : "Slika u vratima"
              }
            />

            {getEquipmentPictureVisibility(equipment).showInnerImage && (
              <InputImage
                name="inner_image"
                initialImage={formData.inner_image as string}
                onFileChange={(base64Image: string | null) =>
                  handleFileChange(base64Image, "inner_image")
                }
                label="Slika u vratima (unutrašnja)"
              />
            )}
          </div>
        )}
      </div>

      <FormFooter onCancel={onCancel} isMutating={isMutating} />
    </form>
  );
};

export default AdminOtherEquipmentForm;
