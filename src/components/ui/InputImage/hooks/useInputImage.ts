import { useState, useEffect } from "react";

const useInputImage = (initialImage?: string | File) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialImage && typeof initialImage === "string") {
      setImageUrl(`${process.env.REACT_APP_API_URL}/storage/${initialImage}`);
    } else if (initialImage instanceof File) {
      setImageFile(initialImage);
      setImageUrl(URL.createObjectURL(initialImage));
    } else {
      setImageUrl(null);
    }
  }, [initialImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImageFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUrl(null);
  };

  return {
    imageFile,
    imageUrl,
    handleFileChange,
    handleRemoveImage,
  };
};

export default useInputImage;
