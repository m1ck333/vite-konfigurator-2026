import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode, useEffect, useRef } from "react";
import useOutsideClick from "../../../hooks/useOutsideClick";
import ReactDOM from "react-dom";

import { MAX_WIDTH_SIZES } from "../../../constants";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "full";
  closeOnOutsideClick?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  closeOnOutsideClick = true,
  className = "",
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(modalRef, closeOnOutsideClick ? onClose : undefined, true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const modalContent = isOpen ? (
    <div
      data-backdrop="true"
      className={`fixed inset-0 bg-black/40 backdrop-filter backdrop-blur-sm flex justify-center items-center p-4 z-50 ${className}`}
    >
      <div
        ref={modalRef}
        className={`glass-modal relative rounded-2xl p-6 w-full ${MAX_WIDTH_SIZES[size]} flex flex-col max-h-[90vh] animate-fade-in-up`}
      >
        {/* protruding close "pimple" on the modal's top-right corner */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-2.5 -right-2.5 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white text-primary-grey-dark hover:text-danger transition-colors"
        >
          <FontAwesomeIcon icon={faX} className="text-xs" />
        </button>

        {title && (
          <div className="mb-4 pb-3 border-b border-primary-grey-lightest">
            <h3 className="text-lg font-bold text-primary-green-dark">
              {title}
            </h3>
          </div>
        )}
        <div className="overflow-y-auto flex-grow no-scrollbar">{children}</div>
      </div>
    </div>
  ) : null;

  return ReactDOM.createPortal(modalContent, document.body);
};

export default Modal;
