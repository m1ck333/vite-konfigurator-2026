import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button";
import { toBase64 } from "../../../utils";

interface InputImageProps {
  type?: string;
  initialImage?: string | undefined;
  name: string;
  required?: boolean;
  onFileChange: (base64Image: string | null) => void;
  label?: string;
}

const InputImage: React.FC<InputImageProps> = ({
  type = "image",
  initialImage,
  name,
  required,
  onFileChange,
  label,
}) => {
  const { t } = useTranslation();
  const fileInputRef = React.createRef<HTMLInputElement>();

  const [localImage, setLocalImage] = useState<string | null>(
    initialImage || null
  );
  const [isOpen, setIsOpen] = useState(false); // State for enlarged image modal

  useEffect(() => {
    if (initialImage) {
      setLocalImage(initialImage);
    } else {
      setLocalImage(null);
    }
  }, [initialImage]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await toBase64(file);
        setLocalImage(base64);
        onFileChange(base64);
      } catch (error) {
        console.error("Error converting file to base64", error);
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    setLocalImage(null);
    onFileChange(null);
  };

  return (
    <div className="flex flex-col">
      {label && (
        <label className="block mb-1.5 text-sm font-medium text-primary-grey-dark">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {localImage ? (
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={
                localImage.startsWith("data:")
                  ? localImage
                  : localImage.includes("storage")
                    ? `${process.env.REACT_APP_API_URL}/${localImage}`
                    : `${process.env.REACT_APP_API_URL}/storage/${localImage}`
              }
              alt={name}
              className="h-20 w-20 object-cover rounded-xl border border-primary-grey-lightest cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setIsOpen(true)}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              aria-label="Remove"
              className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-danger text-white shadow hover:bg-danger-dark transition-colors"
            >
              <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleButtonClick}
            className="text-sm font-medium text-primary-green hover:text-primary-green-dark transition-colors"
          >
            {t(`change-${type}`)}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleButtonClick}
          className="w-full flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary-grey-lightest bg-white py-6 text-primary-grey-dark hover:border-primary-green hover:text-primary-green hover:bg-primary-green/5 transition-colors"
        >
          <FontAwesomeIcon icon={faFile} className="text-2xl" />
          <span className="text-sm font-medium">{t(`choose-${type}`)}</span>
        </button>
      )}

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
              src={
                localImage?.startsWith("data:")
                  ? localImage
                  : localImage?.includes("storage")
                    ? `${process.env.REACT_APP_API_URL}/${localImage}`
                    : `${process.env.REACT_APP_API_URL}/storage/${localImage}`
              }
              alt={name}
              className="w-96 h-96 object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InputImage;
