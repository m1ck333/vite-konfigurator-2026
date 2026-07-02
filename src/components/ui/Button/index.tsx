import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import React from "react";
import Loading from "../Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ButtonProps {
  children?: React.ReactNode;
  variant?:
    | "primary"
    | "primary-light"
    | "primary-dark"
    | "primary-green"
    | "primary-green-outline"
    | "danger"
    | "link"
    | "icon"
    | "outline"
    | "glass";
  size?: "xs" | "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  icon?: IconDefinition;
  isLoading?: boolean;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  iconClassName?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary-green",
  size = "md",
  onClick,
  disabled = false,
  className = "",
  type = "button",
  icon,
  isLoading,
  iconPosition = "left",
  fullWidth = false,
  iconClassName = "",
}) => {
  const variantClasses = {
    primary:
      "bg-primary text-white hover:bg-primary-accent focus:ring-primary/30",
    "primary-light":
      "bg-primary-light text-primary-grey-dark hover:bg-primary-grey-lightest focus:ring-primary-light/30",
    "primary-dark":
      "bg-primary-dark text-white hover:bg-primary-dark-accent focus:ring-primary-dark/30",
    "primary-green":
      "bg-gradient-to-b from-primary-green to-primary-green-dark text-white hover:brightness-110 focus:ring-primary-green/30 shadow-md",
    "primary-green-outline":
      "bg-transparent text-primary-green border border-primary-green hover:bg-primary-green hover:text-white focus:ring-primary-green/30",
    danger: "bg-danger text-white hover:bg-danger-dark focus:ring-danger/30 shadow-md",
    link: "text-primary-green underline hover:text-primary-green-dark focus:ring-primary-green/20 shadow-none bg-transparent",
    icon: "p-0 bg-transparent border-none hover:text-primary-green focus:ring-primary/20",
    outline:
      "bg-transparent border border-primary-grey-light text-primary-grey-dark hover:border-primary-green hover:text-primary-green focus:ring-primary-grey/20",
    glass:
      "bg-white/25 backdrop-blur-md border border-white/60 text-primary-green-dark hover:bg-white/45 focus:ring-primary-green/30 shadow-lg",
  };

  const sizeClasses = {
    xs: "text-xs py-0.5 px-2",
    sm: "text-xs py-1 px-2.5",
    md: "text-sm py-1.5 px-3",
    lg: "text-base py-2 px-4",
  };

  const iconSizeClasses = {
    xs: "h-3 w-3",
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative rounded-lg font-medium transition-all duration-200 ease-in-out active:scale-[0.98]
        ${variant === "icon" ? "flex items-center justify-center" : sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled || isLoading ? "opacity-60 cursor-not-allowed" : "opacity-100"}
        ${fullWidth ? "w-full" : "!w-auto"}
        focus:outline-none focus:ring-2 focus:ring-offset-1
        ${className}
      `}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Loading variant="primary-light" classNames="h-4 w-4" size="xs" />
        </span>
      )}
      <span
        className={`${isLoading ? "invisible" : "visible"} flex items-center gap-2 ${
          iconPosition === "right" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            className={`${iconSizeClasses[size]} ${iconClassName}`}
          />
        )}
        {children}
      </span>
    </button>
  );
};

export default Button;
