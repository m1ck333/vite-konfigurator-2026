import React from "react";

interface LoadingProps {
  classNames?: string;
  variant?: "primary" | "primary-light";
  size?: "xs" | "sm" | "md" | "lg";
}

const Loading = ({
  classNames = "",
  variant = "primary",
  size = "md",
}: LoadingProps) => {
  const sizeVariants = {
    xs: "h-4 w-4 border-2",
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-[3px]",
    lg: "h-16 w-16 border-4",
  };

  const colorVariants = {
    primary: "border-primary-green/25 border-t-primary-green",
    "primary-light": "border-white/40 border-t-white",
  };

  return (
    <div className={`flex justify-center items-center h-full ${classNames}`}>
      <span
        role="status"
        aria-label="Loading"
        className={`inline-block rounded-full animate-spin ${sizeVariants[size]} ${colorVariants[variant]}`}
      />
    </div>
  );
};

export default Loading;
