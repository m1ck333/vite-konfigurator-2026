import React, { useEffect, useState } from "react";
import Button from "../../ui/Button";
import { Color, ColorCategory } from "../../../types";
import Input from "../../ui/Input";
import ColorInput from "../../ui/ColorInput";
import InputImage from "../../ui/InputImage";
import CoolCheckbox from "../../ui/CoolCheckbox";
import Select from "../../ui/Select";
import Modal from "../../ui/Modal";
import FormFooter from "../AdminComponents/FormFooter";
import { findItemTranslations } from "../../../utils";

interface AdminColorFormProps {
  color: Color | null;
  onSubmit: (colorData: Partial<Color>) => void;
  onCancel: () => void;
  isMutating: boolean;
  categories: ColorCategory[];
  setErrorModalOpen: (isOpen: boolean) => void;
}

const AdminColorForm: React.FC<AdminColorFormProps> = ({
  color,
  onSubmit,
  onCancel,
  isMutating,
  categories,
  setErrorModalOpen,
}) => {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [colorCode, setColorCode] = useState(color?.color_code || "");
  const [colorHex, setColorHex] = useState(color?.color_hex || "#000000");
  const [useThumbnail, setUseThumbnail] = useState(Boolean(color?.thumbnail));
  const [thumbnailBase64, setThumbnailBase64] = useState<string | null>(
    color?.thumbnail
      ? `${process.env.REACT_APP_API_URL}/${color.thumbnail}`
      : null
  );

  const defaultCategory =
    categories?.find((category) => category.id === 1) || null;
  const [colorCategory, setColorCategory] = useState<ColorCategory | null>(
    color?.color_category || defaultCategory
  );
  const [price, setPrice] = useState(color?.price || 0);
  const [sortOrder, setSortOrder] = useState(color?.sort_order || null);
  const [isShown, setIsShown] = useState(color?.is_shown ?? true);

  useEffect(() => {
    if (color) {
      setColorCode(color.color_code);
      setColorHex(color.color_hex || "#000000");
      setThumbnailBase64(
        color?.thumbnail
          ? `${process.env.REACT_APP_API_URL}/storage/${color?.thumbnail}`
          : null
      );
      setColorCategory(color.color_category || defaultCategory);
      setUseThumbnail(Boolean(color.thumbnail));
      setPrice(color.price || 0);
      setSortOrder(color.sort_order || null);
      setIsShown(color.is_shown ?? true);
    }
  }, [color, defaultCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!colorCode.trim()) {
      setErrorModalOpen(true);
      setIsErrorModalOpen(true);
      return;
    }

    const colorData: Partial<Color> = {
      color_code: colorCode,
      color_hex: useThumbnail ? null : colorHex,
      thumbnail: useThumbnail ? thumbnailBase64 : null,
      color_category: colorCategory ?? undefined,
      price,
      sort_order: sortOrder ?? null,
      is_shown: isShown,
    };

    onSubmit(colorData);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setUseThumbnail(checked);
    if (checked) {
      setColorHex("");
    } else {
      setThumbnailBase64(null);
    }
  };

  const handleCategoryChange = (value: string | null) => {
    const selectedCategory =
      categories?.find((category) => category.id.toString() === value) || null;
    setColorCategory(selectedCategory);
  };

  const handlePriceInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || (e.currentTarget.value === "" && e.key === "0")) {
      e.preventDefault();
    }
  };

  const categoryOptions =
    categories?.map((category) => ({
      value: category.id.toString(),
      label:
        findItemTranslations(category.translations || []).name || "Nepoznato",
    })) || [];

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3">
          <Input
            type="text"
            label="Kod boje"
            name="color_code"
            value={colorCode}
            onChange={(e) => setColorCode(e.target.value)}
          />

          <div className="flex justify-between">
            <CoolCheckbox
              id="use-thumbnail"
              checked={useThumbnail}
              onChange={handleCheckboxChange}
              label="Koristi sliku"
            />

            {useThumbnail ? (
              <InputImage
                name="thumbnail"
                initialImage={thumbnailBase64 || ""}
                onFileChange={(base64Image) => setThumbnailBase64(base64Image)}
              />
            ) : (
              <ColorInput
                label="Hex boja"
                name="color_hex"
                value={colorHex}
                onChange={(e) => setColorHex(e.target.value)}
              />
            )}
          </div>

          <Select
            label="Kategorija boje"
            options={categoryOptions}
            value={colorCategory?.id.toString() || ""}
            onChange={handleCategoryChange}
          />

          <div className="flex justify-between">
            <Input
              label="Cena"
              type="number"
              name="price"
              value={price.toString()}
              onKeyDown={handlePriceInput}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              min={0}
              step={0.01}
            />

            <Input
              label="Redosled za sortiranje"
              type="number"
              name="sort_order"
              value={sortOrder?.toString() || "0"}
              onChange={(e) =>
                setSortOrder(e.target.value ? parseInt(e.target.value) : 0)
              }
            />
          </div>

          <CoolCheckbox
            id="is_shown"
            checked={isShown}
            onChange={(e) => setIsShown(e)}
            label="Prikazano"
          />

          <FormFooter onCancel={onCancel} isMutating={isMutating} />
        </div>
      </form>

      {isErrorModalOpen && (
        <Modal
          isOpen={isErrorModalOpen}
          onClose={() => {
            setIsErrorModalOpen(false);
            setErrorModalOpen(false);
          }}
          title="Greška"
        >
          <p>Kod boje ne može biti prazan.</p>
          <div className="flex justify-end mt-4">
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                setIsErrorModalOpen(false);
                setErrorModalOpen(false);
              }}
            >
              OK
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default AdminColorForm;
