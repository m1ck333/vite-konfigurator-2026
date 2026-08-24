import React from "react";

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Configurator section heading: a tight, bold title.
 */
const SectionHeading: React.FC<SectionHeadingProps> = ({
  children,
  className = "",
}) => (
  <div className={`mb-6 ${className}`}>
    <h2 className="text-xl font-bold leading-snug tracking-tight text-primary-grey-dark">
      {children}
    </h2>
  </div>
);

export default SectionHeading;
