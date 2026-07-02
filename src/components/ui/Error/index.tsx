import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

interface ErrorProps {
  message?: string;
  className?: string;
  variant?: "inline" | "block" | "toast";
  showIcon?: boolean;
}

const Error: React.FC<ErrorProps> = ({
  message,
  className = "",
  variant = "inline",
  showIcon = true,
}) => {
  const { t } = useTranslation();
  const errorMessage = message || t("error-occurred");

  const variantClasses = {
    inline:
      "inline-flex items-center px-3 py-2 rounded-lg border border-danger/20 bg-danger/5",
    block:
      "flex items-start p-4 rounded-lg border border-danger/20 bg-danger/5 shadow-sm",
    toast: "flex items-center p-3 rounded-lg bg-danger text-white shadow-md",
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {showIcon && (
        <div className={`${variant === "block" ? "mt-0.5 mr-3" : "mr-2"}`}>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className={`${variant === "toast" ? "text-white" : "text-danger"} ${variant === "block" ? "h-5 w-5" : "h-4 w-4"}`}
          />
        </div>
      )}
      <div>
        <p
          className={`${variant === "block" ? "text-sm font-medium" : "text-xs font-medium"} ${variant === "toast" ? "text-white" : "text-danger"}`}
        >
          {errorMessage}
        </p>
        {variant === "block" && (
          <p className="mt-1 text-xs text-danger/80">
            {t("please-try-again-or-contact-support")}
          </p>
        )}
      </div>
    </div>
  );
};

export default Error;
