import React, { useState, useEffect } from "react";
import { ColorCategory, ColorCategoryTranslation } from "../../../types";
import Input from "../../ui/Input";
import Checkbox from "../../ui/Checkbox";
import FormFooter from "../AdminComponents/FormFooter";

interface AdminCategoryFormProps {
  category: ColorCategory | null;
  onSubmit: (categoryData: Partial<ColorCategory>) => void;
  onCancel: () => void;
  isMutating: boolean;
}

const AdminCategoryForm: React.FC<AdminCategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
  isMutating,
}) => {
  const [translations, setTranslations] = useState<ColorCategoryTranslation[]>(
    category?.translations || [
      { language: "sr", name: "", color_category_id: category?.id ?? 0 },
      { language: "en", name: "", color_category_id: category?.id ?? 0 },
    ]
  );

  const [showInStock, setShowInStock] = useState(
    category?.show_in_stock ?? true
  );
  const [showInPanel, setShowInPanel] = useState(
    category?.show_in_panel ?? true
  );
  const [sortOrder, setSortOrder] = useState(category?.sort_order ?? 0);

  useEffect(() => {
    if (category) {
      setTranslations(
        category.translations?.map((t) => ({
          ...t,
          color_category_id: category.id,
        })) || [
          { language: "sr", name: "", color_category_id: category.id ?? 0 },
          { language: "en", name: "", color_category_id: category.id ?? 0 },
        ]
      );
      setShowInStock(category.show_in_stock ?? true);
      setShowInPanel(category.show_in_panel ?? true);
      setSortOrder(category.sort_order ?? 0);
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryData: Partial<ColorCategory> = {
      show_in_stock: showInStock,
      show_in_panel: showInPanel,
      sort_order: sortOrder,
      translations,
    };

    onSubmit(categoryData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        {translations.map((translation, index) => (
          <div key={translation.language} className="mb-4">
            <Input
              label={`Ime kategorije (${translation.language.toUpperCase()})`}
              name={`categoryName_${translation.language}`}
              type="text"
              value={translation.name}
              onChange={(e) => {
                const updatedTranslations = [...translations];
                updatedTranslations[index].name = e.target.value;
                setTranslations(updatedTranslations);
              }}
            />
          </div>
        ))}

        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <Checkbox
              checked={showInStock}
              onChange={setShowInStock}
              label="Prikaži u štoku"
            />

            <Checkbox
              checked={showInPanel}
              onChange={setShowInPanel}
              label="Prikaži u panelu"
            />
          </div>

          <Input
            label="Redosled"
            name="sort"
            type="number"
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value ? parseInt(e.target.value) : 0)
            }
          />
        </div>

        <FormFooter onCancel={onCancel} isMutating={isMutating} />
      </div>
    </form>
  );
};

export default AdminCategoryForm;
