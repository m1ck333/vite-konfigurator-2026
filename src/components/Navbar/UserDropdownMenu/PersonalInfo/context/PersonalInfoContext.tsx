import React, { createContext, useContext, useState, ReactNode } from "react";

const PersonalInfoContext = createContext<{
  activeModal: string | null;
  openModal: (modalName: string) => void;
  closeModal: () => void;
} | null>(null);

const PersonalInfoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (modalName: string) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  return (
    <PersonalInfoContext.Provider
      value={{ activeModal, openModal, closeModal }}
    >
      {children}
    </PersonalInfoContext.Provider>
  );
};

const usePersonalInfoModal = () => {
  const context = useContext(PersonalInfoContext);
  if (!context) {
    throw new Error("useModal must be used within a PersonalInfoProvider");
  }
  return context;
};

export { PersonalInfoProvider, usePersonalInfoModal };
