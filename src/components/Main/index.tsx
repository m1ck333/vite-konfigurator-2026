import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectActiveItem } from "../../features/sidebar/sidebarSlice";
import { RootState } from "../../app/store";
import useDoorImage from "../../hooks/useDoorImage";
import Error from "../ui/Error";
import Loading from "../ui/Loading";
import { useTranslation } from "react-i18next";
import RndDoorImage from "./RndDoorImage";
import WallScene from "./WallScene";
import Skeleton from "../ui/Skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useScreenshot } from "../../hooks/useScreenshot";
import { toast } from "react-toastify";

interface MainProps {
  isSidebarOpen: boolean;
  hideSidebar: React.MouseEventHandler<HTMLElement>;
}

const Main = ({ isSidebarOpen, hideSidebar }: MainProps) => {
  const { t } = useTranslation();
  const activeItem = useSelector(selectActiveItem);
  const interiorDoorShown = useSelector((s: RootState) => s.configuration.interiorDoorShown);
  const doorType = useSelector((s: RootState) => s.configuration.type);
  const { doorImage, isInitialLoad, isUpdating, isError } = useDoorImage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageSize, setImageSize] = useState({ width: "auto", height: "auto" });

  const { captureHouseWithDoor, isCapturing } = useScreenshot({
    onBeforeCapture: async () => {
      if (isSidebarOpen && typeof hideSidebar === "function") {
        hideSidebar({} as React.MouseEvent<HTMLElement>);
      }
    },
    onAfterCapture: () => {
      toast.success(t("screenshot-saved"), {
        position: "bottom-right",
        autoClose: 3000,
      });
    },
    onError: (error) => {
      console.error("Screenshot error:", error);
      toast.error(t("screenshot-error"));
    },
  });

  useEffect(() => {
    if (!doorImage || !containerRef.current) return;

    const updateImageSize = () => {
      if (!containerRef.current) return;

      const containerHeight = containerRef.current.clientHeight;
      const containerWidth = containerRef.current.clientWidth;
      const maxHeight = containerHeight - 40;

      const img = new Image();
      img.onload = () => {
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const containerRatio = containerWidth / containerHeight;

        if (img.naturalHeight > maxHeight || imgRatio < containerRatio) {
          setImageSize({
            height: `${maxHeight}px`,
            width: "auto",
          });
        } else {
          const maxWidth = containerWidth - 40;
          if (img.naturalWidth > maxWidth) {
            setImageSize({
              width: `${maxWidth}px`,
              height: "auto",
            });
          } else {
            setImageSize({ width: "auto", height: "auto" });
          }
        }
      };
      img.src = doorImage;
    };

    updateImageSize();
    window.addEventListener("resize", updateImageSize);

    return () => {
      window.removeEventListener("resize", updateImageSize);
    };
  }, [doorImage]);

  const handleSaveScreenshot = () => {
    toast.info(t("preparing-screenshot"), {
      position: "bottom-right",
      autoClose: 1000,
    });
    captureHouseWithDoor();
  };

  let content;

  if (isError) {
    content = <Error message={t("error-occurred")} variant="block" />;
  } else if (activeItem === "insert-the-door") {
    content = doorImage ? (
      <div className="relative flex justify-center">
        <RndDoorImage imageUrl={doorImage} />
      </div>
    ) : (
      <div className="flex items-center justify-center w-full min-h-[60vh]">
        <Loading size="lg" />
      </div>
    );
  } else {
    content = isInitialLoad ? (
      <div className="flex h-full w-full items-center justify-center">
        <Skeleton className="aspect-[768/1376] h-[70vh] rounded-2xl" />
      </div>
    ) : (
      /* full-bleed house wall; the door tracks the opening (exterior/interior follows the
         Inner/Outer view toggle that also flips the door's face) */
      <WallScene doorImage={doorImage} doorType={doorType} interior={!!interiorDoorShown} isUpdating={isUpdating} />
    );
  }

  const insertTheDoorStyles: React.CSSProperties = {
    height: "100vh",
    overflow: "hidden",
  };

  const notInsertTheDoorClasses = "justify-center items-end flex-grow flex p-4";

  const contentContainerStyle: React.CSSProperties = {
    maxHeight: "100vh",
    overflow: "hidden",
    paddingTop: "2rem",
  };

  return (
    <>
      {activeItem === "insert-the-door" && (
        <div
          className="fixed z-30"
          style={{
            top: "4.75rem",
            right: "1rem",
          }}
        >
          <button
            type="button"
            onClick={handleSaveScreenshot}
            disabled={isCapturing}
            className="glass-btn inline-flex items-center gap-2 h-11 rounded-full px-4 text-sm font-medium text-primary-grey-dark hover:text-primary-green transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon
              icon={isCapturing ? faSpinner : faSave}
              className={isCapturing ? "animate-spin" : ""}
            />
            {isCapturing ? t("saving-image") : t("save-image")}
          </button>
        </div>
      )}

      {activeItem === "insert-the-door" ? (
        <div
          ref={containerRef}
          style={insertTheDoorStyles}
          className="absolute w-full"
          onMouseDown={hideSidebar}
        >
          {content}
        </div>
      ) : (
        <div
          ref={containerRef}
          className={`absolute inset-0 transition-[left] duration-300 ease-in-out ${
            isSidebarOpen ? "lg:left-[27rem]" : ""
          }`}
          onClick={hideSidebar}
        >
          {content}
        </div>
      )}
    </>
  );
};

export default Main;
