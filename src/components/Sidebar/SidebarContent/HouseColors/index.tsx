import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useHouseColors } from "../../../../hooks/useHouseColors";
import { SkeletonGrid } from "../../../ui/Skeleton";
import Error from "../../../ui/Error";
import {
  setColorImageUrl,
  setSelectedColorId,
} from "../../../../features/background/backgroundSlice";
import { RootState } from "../../../../app/store";
import Selectable from "../../../ui/Selectable";
import SectionHeading from "../../../ui/SectionHeading";
import { useTranslation } from "react-i18next";

const HouseColor: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { houseColors, isLoading, isError } = useHouseColors();
  const selectedColorId = useSelector(
    (state: RootState) => state.background.selectedColorId
  );

  useEffect(() => {
    if (selectedColorId !== null) {
      const selectedColor = houseColors.find(
        (color) => color.id === selectedColorId
      );

      if (selectedColor) {
        dispatch(
          setColorImageUrl(
            `${process.env.REACT_APP_API_URL}/${selectedColor.thumbnail}`
          )
        );
      }
    }
  }, [selectedColorId, houseColors, dispatch]);

  const handleSelectColor = (id: number, thumbnail: string) => {
    const newSelectedColorId = selectedColorId === id ? null : id;
    dispatch(setSelectedColorId(newSelectedColorId));
    dispatch(
      setColorImageUrl(
        newSelectedColorId
          ? `${process.env.REACT_APP_API_URL}/${thumbnail}`
          : ""
      )
    );
  };

  if (isLoading) return <SkeletonGrid />;
  if (isError) return <Error message="Error loading house colors" />;

  return (
    <>
      <SectionHeading>{t("choose-door-house-color")}</SectionHeading>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3">
        {houseColors.map((color) => (
          <Selectable
            key={color.id}
            isSelected={selectedColorId === color.id}
            onClick={() => handleSelectColor(color.id, color.thumbnail)}
          >
            <img
              src={`${process.env.REACT_APP_API_URL}/${color.thumbnail}`}
              alt={`Color ${color.color_code}`}
              className="w-20 h-20 mx-auto rounded-lg object-cover border border-primary-grey-lightest"
            />
          </Selectable>
        ))}
      </div>
    </>
  );
};

export default HouseColor;
