import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../../ui/Button";
import { faTimes, faImage } from "@fortawesome/free-solid-svg-icons";

interface ImagePreviewProps {
  colorHex?: string | null;
  thumbnail: string | null;
  name: string | null;
  isNonRectangular?: boolean;
}

/** Muted placeholder shown when there's no image, or the file 404s. */
const Placeholder: React.FC = () => (
  <div
    className="w-12 h-12 rounded-lg border border-dashed border-primary-grey-lightest flex items-center justify-center bg-primary-light"
    title="Image not available"
  >
    <FontAwesomeIcon icon={faImage} className="text-primary-grey" />
  </div>
);

const ImagePreview: React.FC<ImagePreviewProps> = ({
  colorHex,
  thumbnail,
  name,
  isNonRectangular = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (colorHex) {
    return (
      <div
        style={{ backgroundColor: colorHex }}
        className="w-12 h-12 rounded-lg border border-primary-grey-lightest"
      />
    );
  }

  if (!thumbnail || hasError) {
    return <Placeholder />;
  }

  const imageUrl = `${process.env.REACT_APP_API_URL}/${
    thumbnail.startsWith("storage") ? thumbnail : `storage/${thumbnail}`
  }`;

  return (
    <>
      <div
        className="relative w-12 h-12 rounded-lg border border-primary-grey-lightest flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={() => setIsOpen(true)}
      >
        <img
          src={imageUrl}
          alt={name || "image"}
          onError={() => setHasError(true)}
          className={`max-w-full max-h-full ${
            isNonRectangular ? "object-contain" : "object-cover"
          }`}
        />
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="glass-modal relative p-4 rounded-2xl animate-fade-in-up">
            <Button
              onClick={() => setIsOpen(false)}
              variant="icon"
              icon={faTimes}
              className="absolute top-2 right-2 p-2"
            />
            <img
              src={imageUrl}
              alt={name || "image"}
              className="w-96 h-96 object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImagePreview;
