import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectActiveItem } from "../../features/sidebar/sidebarSlice";
import useDoorImage from "../../hooks/useDoorImage";
import Error from "../ui/Error";
import Loading from "../ui/Loading";
import { useTranslation } from "react-i18next";
import RndDoorImage from "./RndDoorImage";
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
    content = (
      <div className="relative flex justify-center">
        {isInitialLoad ? (
          /* first load is always the default single-leaf door, so a
             door-shaped skeleton matches its known shape/size */
          <Skeleton className="aspect-[13/25] h-[76vh] rounded-2xl" />
        ) : (
          <>
            {/* soft ground shadow once the door is visible */}
            <div className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 w-[62%] h-6 bg-black/25 blur-2xl rounded-[50%]" />
            <img
              key={doorImage}
              className={`object-contain drop-shadow-2xl transition-[filter,opacity] duration-200 ${
                isUpdating ? "blur-md opacity-75 animate-pulse" : ""
              }`}
              style={{
                maxWidth: imageSize.width,
                maxHeight: imageSize.height,
              }}
              src={doorImage ?? undefined}
              alt="Displayed Door"
            />
          </>
        )}
      </div>
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
          className={`${notInsertTheDoorClasses} transition-[padding] duration-300 ease-in-out ${
            isSidebarOpen ? "lg:pl-[27rem]" : ""
          }`}
          style={contentContainerStyle}
          onClick={hideSidebar}
        >
          {content}
        </div>
      )}
    </>
  );
};

export default Main;
