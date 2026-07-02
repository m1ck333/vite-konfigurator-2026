import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { useHouses } from "../../../../hooks/useHouses";
import { SkeletonGrid } from "../../../ui/Skeleton";
import Error from "../../../ui/Error";
import {
  setHouseImageUrl,
  setSelectedHouseId,
} from "../../../../features/background/backgroundSlice";
import { RootState } from "../../../../app/store";
import Selectable from "../../../ui/Selectable";
import SectionHeading from "../../../ui/SectionHeading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const Houses: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { houses, isLoading, isError } = useHouses();
  const selectedHouseId = useSelector(
    (state: RootState) => state.background.selectedHouseId
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customImage, setCustomImage] = React.useState<string | null>(null);

  const localStorageImg = localStorage.getItem("backgroundImage");

  useEffect(() => {
    if (localStorageImg) {
      setCustomImage(localStorageImg);
    }
  }, [localStorageImg]);

  const handleAddPicture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setCustomImage(imageUrl);
        dispatch(setHouseImageUrl(imageUrl));
        localStorage.setItem("backgroundImage", imageUrl);
        dispatch(setSelectedHouseId(null));
      };
      reader.readAsDataURL(file);
    }
    if (event.target) {
      event.target.value = "";
    }
  };

  useEffect(() => {
    if (selectedHouseId !== null) {
      const selectedHouse = houses.find(
        (house) => house.id === selectedHouseId
      );
      if (localStorageImg && !selectedHouse) {
        dispatch(setHouseImageUrl(localStorageImg));
        return;
      }
      if (selectedHouse) {
        dispatch(
          setHouseImageUrl(
            `${process.env.REACT_APP_API_URL}/api/${selectedHouse.image}`
          )
        );
      }
    } else if (customImage) {
      dispatch(setHouseImageUrl(customImage));
    }
  }, [selectedHouseId, houses, dispatch, localStorageImg, customImage]);

  const handleSelectHouse = (id: number, image: string) => {
    const newSelectedHouseId = selectedHouseId === id ? null : id;
    dispatch(setSelectedHouseId(newSelectedHouseId));
    dispatch(
      setHouseImageUrl(
        newSelectedHouseId
          ? `${process.env.REACT_APP_API_URL}/api/${image}`
          : ""
      )
    );
  };

  const handleSelectCustomImage = () => {
    dispatch(setSelectedHouseId(null));
    if (customImage) {
      dispatch(setHouseImageUrl(customImage));
    }
  };

  if (isLoading) return <SkeletonGrid columns={1} cardClassName="h-48" />;
  if (isError) return <Error />;

  return (
    <>
      <SectionHeading>{t("choose-door-house")}</SectionHeading>

      <button
        type="button"
        onClick={handleAddPicture}
        className="mb-5 w-full flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary-grey-lightest bg-white py-6 text-primary-grey-dark hover:border-primary-green hover:text-primary-green hover:bg-primary-green/5 transition-colors"
      >
        <FontAwesomeIcon icon={faCamera} className="text-2xl" />
        <span className="text-sm font-medium">{t("insert-image")}</span>
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <div className="grid grid-cols-1 gap-4">
        {customImage && (
          <Selectable
            isSelected={selectedHouseId === null && customImage !== null}
            onClick={handleSelectCustomImage}
            classNames="p-4"
          >
            <img
              src={customImage}
              alt="Custom house"
              className="object-cover w-full h-full rounded-lg"
            />
          </Selectable>
        )}

        {houses.map((house) => (
          <Selectable
            key={house.id}
            isSelected={selectedHouseId === house.id}
            onClick={() => handleSelectHouse(house.id, house.image)}
            classNames="p-4"
          >
            <img
              src={`${process.env.REACT_APP_API_URL}/api/${house.image}`}
              alt={`House ${house.id}`}
              className="object-cover w-full h-full rounded-lg"
            />
          </Selectable>
        ))}
      </div>
    </>
  );
};

export default Houses;
