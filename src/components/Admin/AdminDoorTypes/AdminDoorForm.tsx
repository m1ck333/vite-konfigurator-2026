import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Color, Door } from "../../../types";
import Input from "../../ui/Input";
import InputImage from "../../ui/InputImage";
import CoolCheckbox from "../../ui/CoolCheckbox";
import FormFooter from "../AdminComponents/FormFooter";
import ColorSelect from "./ColorSelect";
import { toast } from "react-toastify";

interface AdminDoorFormProps {
  door: Door | null;
  colors?: Color[];
  onSubmit: (doorData: Partial<Door>) => void;
  onCancel: () => void;
  isMutating: boolean;
}

const AdminDoorForm: React.FC<AdminDoorFormProps> = ({
  door,
  colors,
  onSubmit,
  onCancel,
  isMutating,
}) => {
  const { t } = useTranslation();

  const initializeFormData = (): Partial<Door> => {
    if (door) {
      return { ...door };
    } else {
      return {
        model_code: "",
        thumbnail: "",
        color_id: 0,
        decorative_glass_name: "",
        side_glass_code: "",
        has_glass: false,
        price: "0",
        sort_order: null,
        is_shown: true,
        is_default: false,
      };
    }
  };

  const [formData, setFormData] = useState<Partial<Door>>(initializeFormData());

  useEffect(() => {
    setFormData(initializeFormData());
    // eslint-disable-next-line
  }, [door]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prevState) => ({ ...prevState, has_glass: checked }));
  };

  const handleFileChange = (base64Image: string | null) => {
    setFormData((prevState) => ({
      ...prevState,
      thumbnail: base64Image || "",
    }));
  };

  const handlePriceInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || (e.currentTarget.value === "" && e.key === "0")) {
      e.preventDefault();
    }
  };

  const handleSelectChange = (value: number | null, fieldName: keyof Door) => {
    setFormData((prevState) => ({ ...prevState, [fieldName]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.model_code || !formData.thumbnail || !formData.color_id) {
      toast.error(
        'Molimo popunite sva obavezna polja: "kod modela", "slika" i "boja vrata".'
      );
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={t("model-code")}
        type="text"
        name="model_code"
        value={formData.model_code || ""}
        onChange={handleInputChange}
        required
      />

      <div className="flex gap-2">
        <div className="flex-1">
          <InputImage
            name="thumbnail"
            initialImage={formData.thumbnail as string}
            onFileChange={handleFileChange}
            required
          />
        </div>

        {colors && (
          <div className="flex-1">
            <ColorSelect
              label={t("choose-door-color")}
              colors={colors}
              value={formData.color_id || null}
              onChange={(value: number) =>
                handleSelectChange(value, "color_id")
              }
            />
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Input
          label={t("price")}
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
        <div className="flex gap-4">
          <CoolCheckbox
            id="has_glass"
            checked={formData.has_glass || false}
            onChange={handleCheckboxChange}
            label="Ima staklo"
          />

          <CoolCheckbox
            id="is_default"
            checked={formData.is_default || false}
            onChange={(checked) =>
              setFormData((prev) => ({ ...prev, is_default: checked }))
            }
            label="Podrazumevano"
          />
        </div>

        <CoolCheckbox
          id="is_shown"
          checked={formData.is_shown || false}
          onChange={(checked) =>
            setFormData((prev) => ({ ...prev, is_shown: checked }))
          }
          label="Prikazano"
        />
      </div>

      <FormFooter onCancel={onCancel} isMutating={isMutating} />
    </form>
  );
};

export default AdminDoorForm;
